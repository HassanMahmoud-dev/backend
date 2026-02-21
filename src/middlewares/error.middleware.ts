import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/error.util";
import { sendErrorResponse } from "../utils/response.util";
import { systemService } from "../services/system/system.service";

export const notFoundHandler = (_req: Request, res: Response): void => {
  sendErrorResponse(res, "Route not found", { code: "NOT_FOUND" }, 404);
};

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  const statusCode = (err as AppError).statusCode || 500;

  // Track the fault
  systemService.addFault({
    message: err.message || "Internal server error",
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode,
  });

  console.error(err);

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
