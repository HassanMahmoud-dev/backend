import { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  errors: unknown | null;
}

/**
 * Base function to send standard API responses.
 */
export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: T | null = null,
  errors: unknown = null,
) => {
  const response: ApiResponse<T> = {
    success,
    message,
    data,
    errors,
  };

  return res.status(statusCode).json(response);
};

/**
 * Utility for sending successful responses.
 */
export const sendSuccessResponse = <T>(
  res: Response,
  message: string,
  data: T | null = null,
  statusCode = 200,
) => {
  return sendResponse(res, statusCode, true, message, data, null);
};

/**
 * Utility for sending error responses.
 */
export const sendErrorResponse = (
  res: Response,
  message: string,
  errors: unknown = null,
  statusCode = 500,
) => {
  return sendResponse(res, statusCode, false, message, null, errors);
};
