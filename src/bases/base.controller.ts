import type { NextFunction, Request, RequestHandler, Response } from "express";

import { BaseError } from "./base.error";
import { BaseResponse, type ResponseMeta } from "./base.response";

export abstract class BaseController {
	protected ok<TData>(
		res: Response,
		data?: TData,
		message = "Success",
		meta?: ResponseMeta,
		statusCode = 200,
	): Response {
		return res.status(statusCode).json(BaseResponse.success(data, message, meta));
	}

	protected created<TData>(
		res: Response,
		data?: TData,
		message = "Created",
		meta?: ResponseMeta,
	): Response {
		return this.ok(res, data, message, meta, 201);
	}

	protected fail(
		res: Response,
		message = "Error",
		statusCode = 400,
		errors?: unknown,
		meta?: ResponseMeta,
	): Response {
		return res.status(statusCode).json(BaseResponse.fail(message, errors, meta));
	}

	protected execute(
		handler: (req: Request, res: Response, next: NextFunction) => Promise<void> | void,
	): RequestHandler {
		return async (req: Request, res: Response, next: NextFunction) => {
			try {
				await handler(req, res, next);
			} catch (error: unknown) {
				this.handleError(error, next);
			}
		};
	}

	protected handleError(error: unknown, next: NextFunction): void {
		if (error instanceof Error) {
			next(error);
			return;
		}

		next(
			new BaseError("Unexpected error", {
				details: error,
			}),
		);
	}
}