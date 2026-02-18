import { BaseError, type BaseErrorOptions } from "./base.error";

type HttpErrorOptions = Omit<BaseErrorOptions, "statusCode" | "code">;

export class BadRequestError extends BaseError {
	constructor(message = "Bad request", options: HttpErrorOptions = {}) {
		super(message, { ...options, statusCode: 400, code: "BAD_REQUEST" });
	}
}

export class UnauthorizedError extends BaseError {
	constructor(message = "Unauthorized", options: HttpErrorOptions = {}) {
		super(message, { ...options, statusCode: 401, code: "UNAUTHORIZED" });
	}
}

export class ForbiddenError extends BaseError {
	constructor(message = "Forbidden", options: HttpErrorOptions = {}) {
		super(message, { ...options, statusCode: 403, code: "FORBIDDEN" });
	}
}

export class NotFoundError extends BaseError {
	constructor(message = "Resource not found", options: HttpErrorOptions = {}) {
		super(message, { ...options, statusCode: 404, code: "NOT_FOUND" });
	}
}

export class ConflictError extends BaseError {
	constructor(message = "Conflict", options: HttpErrorOptions = {}) {
		super(message, { ...options, statusCode: 409, code: "CONFLICT" });
	}
}

export class UnprocessableEntityError extends BaseError {
	constructor(message = "Unprocessable entity", options: HttpErrorOptions = {}) {
		super(message, {
			...options,
			statusCode: 422,
			code: "UNPROCESSABLE_ENTITY",
		});
	}
}

export class TooManyRequestsError extends BaseError {
	constructor(message = "Too many requests", options: HttpErrorOptions = {}) {
		super(message, {
			...options,
			statusCode: 429,
			code: "TOO_MANY_REQUESTS",
		});
	}
}

export class InternalServerError extends BaseError {
	constructor(message = "Internal server error", options: HttpErrorOptions = {}) {
		super(message, {
			...options,
			statusCode: 500,
			code: "INTERNAL_SERVER_ERROR",
		});
	}
}

export class ServiceUnavailableError extends BaseError {
	constructor(message = "Service unavailable", options: HttpErrorOptions = {}) {
		super(message, {
			...options,
			statusCode: 503,
			code: "SERVICE_UNAVAILABLE",
		});
	}
}