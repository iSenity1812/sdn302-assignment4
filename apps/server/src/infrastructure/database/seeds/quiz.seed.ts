import { PinoLogger } from "@/infrastructure/observability/logging/pino-logger";
import { QuestionDocument } from "@/modules/question/infrastructure/database/mongoose/persistence/question.model";
import { QuizModel } from "@/modules/quiz/infrastructure/database/mongoose/persistence/quiz.model";
import { QuizStatus } from "@/modules/quiz/domain/value-objects/quiz-status.vo";
import { faker } from "@faker-js/faker";

function toQuizQuestionSnapshot(question: QuestionDocument) {
  return {
    id: question._id.toString(),
    content: question.content,
    options: question.options,
    correctAnswer: question.correctAnswer,
    difficulty: question.difficulty,
    type: question.type,
    explanation: question.explanation,
  };
}

function pickQuestionsByTags(questions: QuestionDocument[], tags: string[]) {
  return questions.filter((question) =>
    tags.every((tag) => question.tags.includes(tag)),
  );
}

function pickQuestionsByDifficulty(
  questions: QuestionDocument[],
  difficulty: string,
) {
  return questions.filter((question) => question.difficulty === difficulty);
}

export async function seedQuizzes(
  questions: QuestionDocument[],
  adminIds: string[],
  logger?: PinoLogger,
) {
  if (adminIds.length === 0) {
    throw new Error("At least one admin user is required to seed quizzes");
  }

  const createdBy = adminIds[0];

  const titleVariant = (base: string) =>
    `${base}: ${faker.helpers.arrayElement([
      "Spring Intake",
      "Practice Set",
      "Weekly Challenge",
      "Bootcamp Edition",
    ])}`;

  const descriptionSuffix = faker.helpers.arrayElement([
    "Designed for onboarding assessment.",
    "Suitable for self-paced revision.",
    "Intended for mock interview preparation.",
    "Curated for production readiness checks.",
  ]);

  const backendFundamentals = pickQuestionsByTags(questions, ["architecture"])
    .concat(pickQuestionsByTags(questions, ["http"]))
    .slice(0, 4)
    .map(toQuizQuestionSnapshot);

  const securityQuiz = pickQuestionsByTags(questions, ["security"])
    .concat(pickQuestionsByTags(questions, ["jwt"]))
    .slice(0, 3)
    .map(toQuizQuestionSnapshot);

  const advancedEngineering = pickQuestionsByDifficulty(questions, "HARD")
    .slice(0, 3)
    .map(toQuizQuestionSnapshot);

  const quizzes = [
    {
      title: titleVariant("Backend Engineering Fundamentals"),
      description: `Covers clean architecture, dependency injection, and HTTP API design basics. ${descriptionSuffix}`,
      createdBy,
      status: QuizStatus.PUBLISHED,
      questions: backendFundamentals,
    },
    {
      title: titleVariant("API Security Essentials"),
      description: `Focuses on authentication, JWT usage, and secure credential handling. ${descriptionSuffix}`,
      createdBy,
      status: QuizStatus.PUBLISHED,
      questions: securityQuiz,
    },
    {
      title: titleVariant("Advanced System Design Drill"),
      description: `Challenging set on consistency models, CQRS trade-offs, and event reliability. ${descriptionSuffix}`,
      createdBy,
      status: QuizStatus.DRAFT,
      questions: advancedEngineering,
    },
  ].filter((quiz) => quiz.questions.length > 0);

  const inserted = await QuizModel.insertMany(quizzes);
  logger?.info(`Seeded ${inserted.length} quizzes`, {
    published: inserted.filter((quiz) => quiz.status === QuizStatus.PUBLISHED)
      .length,
    draft: inserted.filter((quiz) => quiz.status === QuizStatus.DRAFT).length,
  });

  return inserted;
}
