export interface AppError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;
}

export function createError(
  message: string,
  statusCode = 500,
  code = "INTERNAL_SERVER_ERROR",
  details?: unknown,
): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  Error.captureStackTrace?.(error, createError);
  return error;
}

export const badRequest = (message = "Bad request", details?: unknown) =>
  createError(message, 400, "BAD_REQUEST", details);

export const unauthorized = (message = "Unauthorized", details?: unknown) =>
  createError(message, 401, "UNAUTHORIZED", details);

export const forbidden = (message = "Forbidden", details?: unknown) =>
  createError(message, 403, "FORBIDDEN", details);

export const notFound = (message = "Resource not found", details?: unknown) =>
  createError(message, 404, "NOT_FOUND", details);

export const conflict = (message = "Conflict", details?: unknown) =>
  createError(message, 409, "CONFLICT", details);

export const unprocessableEntity = (message = "Unprocessable entity", details?: unknown) =>
  createError(message, 422, "UNPROCESSABLE_ENTITY", details);

export const tooManyRequests = (message = "Too many requests", details?: unknown) =>
  createError(message, 429, "TOO_MANY_REQUESTS", details);

export const internalServer = (message = "Internal server error", details?: unknown) =>
  createError(message, 500, "INTERNAL_SERVER_ERROR", details);
