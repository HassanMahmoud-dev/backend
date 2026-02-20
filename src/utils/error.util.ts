export interface AppError extends Error {
  statusCode: number;
  errors?: unknown;
}

/**
 * Functional approach to creating application errors with standard properties.
 */
export function createError(message: string, statusCode = 500, errors?: unknown): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.errors = errors;

  // Capture stack trace, avoiding this function call in the trace
  if (Error.captureStackTrace) {
    Error.captureStackTrace(error, createError);
  }

  return error;
}

export const badRequestError = (message = "Bad request", errors?: unknown) =>
  createError(message, 400, errors);

export const unauthorizedError = (message = "Unauthorized", errors?: unknown) =>
  createError(message, 401, errors);

export const forbiddenError = (message = "Forbidden", errors?: unknown) =>
  createError(message, 403, errors);

export const notFoundError = (message = "Resource not found", errors?: unknown) =>
  createError(message, 404, errors);

export const conflictError = (message = "Conflict", errors?: unknown) =>
  createError(message, 409, errors);

export const unprocessableEntityError = (message = "Unprocessable entity", errors?: unknown) =>
  createError(message, 422, errors);

export const tooManyRequestsError = (message = "Too many requests", errors?: unknown) =>
  createError(message, 429, errors);

export const internalServerError = (message = "Internal server error", errors?: unknown) =>
  createError(message, 500, errors);
