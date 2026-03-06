import { envConfig } from "@/config/env.config";
import { PinoLogger } from "@/infrastructure/observability/logging/pino-logger";
import mongoose from "mongoose";
import { seedUsers } from "./user.seed";
import { BcryptPasswordHasher } from "@/shared/security/bcrypt.password-hasher";
import { UserModel } from "@/modules/user/infrastructure/database/model/user.model";
import { QuestionModel } from "@/modules/question/infrastructure/database/mongoose/persistence/question.model";
import { QuizModel } from "@/modules/quiz/infrastructure/database/mongoose/persistence/quiz.model";
import { seedQuestions } from "./question.seed";
import { seedQuizzes } from "./quiz.seed";

async function seed() {
  const logger = new PinoLogger();
  const hashedPassword = new BcryptPasswordHasher();
  try {
    await mongoose.connect(envConfig.mongodbUri, {
      dbName: envConfig.mongodbDbName,
    });
    logger.info("Connected to MongoDB");

    // Reset existing seed collections to keep seeding idempotent.
    await Promise.all([
      UserModel.deleteMany({}),
      QuestionModel.deleteMany({}),
      QuizModel.deleteMany({}),
    ]);
    logger.info("Cleared users, questions, and quizzes collections");

    const seededUsers = await seedUsers(hashedPassword, logger);
    const seededQuestions = await seedQuestions(seededUsers.adminIds, logger);
    await seedQuizzes(seededQuestions, seededUsers.adminIds, logger);

    logger.info("Seeding completed");
  } catch (error) {
    logger.error("Error connecting to MongoDB", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed().catch((err) => {
  console.error("Error seeding database", err);
  process.exit(1);
});
