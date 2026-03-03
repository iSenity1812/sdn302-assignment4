import { AppError } from "@/building-blocks/result/error";
import { ErrorCode, ErrorCodes } from "./error-code";

/**
 * Separate domain-specific errors from generic application errors.
 * This allows us to handle them differently in the error middleware and provide more meaningful responses to clients.
 * If you have specific error scenarios in your application, you can create custom error classes that extend DomainError.
 *
 */
export class DomainError extends AppError {
  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number,
    details?: unknown,
  ) {
    super(code, message, statusCode, details);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = "Unauthorized", details?: unknown) {
    super(ErrorCodes.UNAUTHORIZED, message, 401, details);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message = "Forbidden", details?: unknown) {
    super(ErrorCodes.FORBIDDEN, message, 403, details);
  }
}

export class NotFoundError extends DomainError {
  constructor(message = "Resource not found", details?: unknown) {
    super(ErrorCodes.NOT_FOUND, message, 404, details);
  }
}

export class UserNotFoundError extends DomainError {
  constructor(userId?: string, details?: unknown) {
    super(ErrorCodes.USER_NOT_FOUND, "User not found", 404, {
      userId,
      ...((details as object | undefined) ?? {}),
    });
  }
}

export class InvalidIdentifierError extends DomainError {
  constructor(
    identifierName: string,
    identifierValue: unknown,
    details?: unknown,
  ) {
    super(
      ErrorCodes.INVALID_IDENTIFIER,
      `Invalid identifier: ${identifierName}`,
      400,
      {
        [identifierName]: identifierValue,
        ...((details as object | undefined) ?? {}),
      },
    );
  }
}

export class UserAlreadyExistsError extends DomainError {
  constructor(email: string, details?: unknown) {
    super(
      ErrorCodes.VALIDATION_ERROR,
      "User with this email already exists",
      400,
      {
        email,
        ...((details as object | undefined) ?? {}),
      },
    );
  }
}

export class ValidationError extends DomainError {
  constructor(message = "Validation error", details?: unknown) {
    super(ErrorCodes.VALIDATION_ERROR, message, 400, details);
  }
}

export class ServiceUnavailableError extends DomainError {
  constructor(message = "Service unavailable", details?: unknown) {
    super(ErrorCodes.SERVICE_UNAVAILABLE, message, 503, details);
  }
}
