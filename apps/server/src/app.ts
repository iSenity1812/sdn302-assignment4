import express, { Application } from "express";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "./shared/middleware/error.middleware";
import { buildContainer } from "./config/inversify.config";
import { HealthController } from "./modules/health/presentation/http/health.controller";
import { API_PREFIX } from "./config/api-prefix.config";
import { healthRoutes } from "./modules/health/presentation/http/health.routes";
import { UserController } from "./modules/user/presentation/user.controller";
import { userRoutes } from "./modules/user/presentation/user.routes";
import { USER_TYPES } from "./modules/user/user.token";
import { AUTH_TYPES } from "./modules/auth/auth.token";
import { AuthController } from "./modules/auth/presentation/auth.controller";
import { authRoutes } from "./modules/auth/presentation/auth.routes";
import passport from "passport";
import { configurePassport } from "./modules/auth/infrastructure/security/passport.config";
import { QuestionController } from "./modules/question/presentation/question.controller";
import { QUESTION_TYPES } from "./modules/question/di/question.token";
import { questionRoutes } from "./modules/question/presentation/question.route";
import { QUIZ_TYPES } from "./modules/quiz/di/quiz.token";
import { QuizController } from "./modules/quiz/presentation/quiz.controller";
import { quizRoutes } from "./modules/quiz/presentation/quiz.route";

export async function createApp(): Promise<Application> {
  const app = express();
  const container = await buildContainer();
  configurePassport(container);

  // Get controllers
  const healthController = container.get(HealthController);
  const userController = container.get<UserController>(USER_TYPES.Controller);
  const authController = container.get<AuthController>(AUTH_TYPES.Controller);
  const questionController = container.get<QuestionController>(
    QUESTION_TYPES.Controller,
  );
  const quizController = container.get<QuizController>(QUIZ_TYPES.Controller);

  // Middleware
  app.use(express.json());
  app.use(passport.initialize());

  // health check
  app.use(API_PREFIX, healthRoutes(healthController));
  // user routes
  app.use(API_PREFIX, userRoutes(userController));
  // auth routes
  app.use(API_PREFIX, authRoutes(authController));
  // question routes
  app.use(API_PREFIX, questionRoutes(questionController));
  // quiz routes
  app.use(API_PREFIX, quizRoutes(quizController));

  // error handling middleware
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
