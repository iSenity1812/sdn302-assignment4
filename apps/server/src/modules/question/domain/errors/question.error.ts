import { DomainError } from "@/shared/errors/domain.errors";
import { ErrorCodes } from "@/shared/errors/error-code";

export class QuestionEmptyOptionError extends DomainError {
  constructor(
    message: string = "Option value cannot be empty",
    details?: unknown,
  ) {
    super(ErrorCodes.QUESTION_EMPTY_OPTION, message, 400, details);
  }
}

export class QuestionNotEnoughOptionsError extends DomainError {
  constructor(
    message: string = "Multiple choice questions must have at least 2 options",
    details?: unknown,
  ) {
    super(ErrorCodes.QUESTION_NOT_ENOUGH_OPTIONS, message, 400, details);
  }
}

export class QuestionValidationError extends DomainError {
  constructor(
    message: string = "Question validation failed",
    details?: unknown,
  ) {
    super(ErrorCodes.QUESTION_VALIDATION_ERROR, message, 400, details);
  }
}

export class QuestionNotFoundError extends DomainError {
  constructor(questionId?: string, details?: unknown) {
    super(ErrorCodes.QUESTION_NOT_FOUND, "Question not found", 404, {
      questionId,
      ...((details as object | undefined) ?? {}),
    });
  }
}

export class QuestionNotAnswerableError extends DomainError {
  constructor(
    message: string = "Question cannot be answered",
    details?: unknown,
  ) {
    super(ErrorCodes.QUESTION_NOT_ANSWERABLE, message, 400, details);
  }
}