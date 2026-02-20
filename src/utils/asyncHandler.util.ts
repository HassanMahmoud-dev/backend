import { Request, Response, NextFunction } from "express";

/**
 * Functional wrapper for handling asynchronous controller methods.
 * Any caught errors from the asynchronous operation are passed to the next() middleware.
 * Use it to avoid try/catch blocks within the controllers.
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
