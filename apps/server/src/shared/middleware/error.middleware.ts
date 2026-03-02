import { Request, Response, NextFunction } from "express";
import { AppError } from "../../building-blocks/result/Error";
import { ErrorCodes } from "../errors/error-code";
import { fail } from "../http/builder/response.factory";

// api not found middleware
export function notFoundMiddleware(_: Request, res: Response) {
  return res.status(404).json(
    fail({
      code: ErrorCodes.NOT_FOUND,
      message: "API endpoint not found.",
    }),
  );
}

// global error handling middleware
export function errorMiddleware(
  err: Error,
  _: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(
      fail(
        {
          code: err.code,
          message: err.message,
          details: err.details,
        },
        {},
      ),
    );
  }

  return res.status(500).json(
    fail({
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: "An unexpected error occurred.",
    }),
  );
}
