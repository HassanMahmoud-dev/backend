import { Request, Response } from "express";

import { BaseError } from "@/bases/base.error";
import { BaseResponse } from "@/bases/base.response";

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json(
    BaseResponse.fail("Route not found", {
      code: "NOT_FOUND",
    }),
  );
};

export const errorHandler = (
 	err: Error,
  _req: Request,
  res: Response,
): void => {
  console.error(err);

  if (err instanceof BaseError) {
    res.status(err.statusCode).json(
      BaseResponse.fail(err.message, {
        code: err.code,
        details: err.details,
      }),
    );
    return;
  }

  const errorPayload: Record<string, unknown> = {
    code: "INTERNAL_SERVER_ERROR",
  };

  if (process.env.NODE_ENV !== "production") {
    errorPayload.stack = err.stack;
  }

  res.status(500).json(BaseResponse.fail("Internal server error", errorPayload));
};
