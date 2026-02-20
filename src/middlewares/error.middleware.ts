import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/error.util";
import { sendErrorResponse } from "../utils/response.util";

export const notFoundHandler = (_req: Request, res: Response): void => {
  sendErrorResponse(res, "Route not found", { code: "NOT_FOUND" }, 404);
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

  let errorPayload: unknown = (err as AppError).errors || {
    code: "INTERNAL_SERVER_ERROR",
  };

  if (process.env.NODE_ENV !== "production") {
    if (typeof errorPayload === "object" && errorPayload !== null) {
      errorPayload = { ...errorPayload, stack: err.stack };
    } else {
      errorPayload = { originalError: errorPayload, stack: err.stack };
    }
  }

  sendErrorResponse(res, err.message || "Internal server error", errorPayload, statusCode);
};
