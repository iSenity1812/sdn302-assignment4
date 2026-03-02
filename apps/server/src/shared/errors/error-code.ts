export const ErrorCodes = {
  // Add specific error codes for your application here
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  INVALID_IDENTIFIER: "INVALID_IDENTIFIER",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
