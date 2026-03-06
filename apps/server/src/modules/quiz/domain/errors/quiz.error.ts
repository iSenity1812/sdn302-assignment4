import { DomainError } from "@/shared/errors/domain.errors";
import { ErrorCodes } from "@/shared/errors/error-code";

export class QuizNotFoundError extends DomainError {
  constructor(message: string = "Quiz not found", details?: unknown) {
    super(ErrorCodes.QUIZ_NOT_FOUND, message, 404, details);
  }
}

export class QuizValidationError extends DomainError {
  constructor(message: string = "Quiz validation failed", details?: unknown) {
    super(ErrorCodes.QUIZ_VALIDATION_ERROR, message, 400, details);
  }
}

export class QuizError extends DomainError {
  constructor(
    message: string = "An error occurred while processing the quiz",
    details?: unknown,
    statusCode?: number,
  ) {
    super(ErrorCodes.QUIZ_ERROR, message, statusCode || 500, details);
  }
}
