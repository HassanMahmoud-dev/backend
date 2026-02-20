import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    errors: { code: "NOT_FOUND" },
    data: null,
  });
};

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  console.error(err);

  const statusCode = (err as AppError).statusCode || 500;

  const errorPayload: Record<string, unknown> = {
    code: (err as AppError).code || "INTERNAL_SERVER_ERROR",
  };

  if ((err as AppError).details) {
    errorPayload.details = (err as AppError).details;
  }

  if (process.env.NODE_ENV !== "production") {
    errorPayload.stack = err.stack;
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    errors: errorPayload,
    data: null,
  });
};
