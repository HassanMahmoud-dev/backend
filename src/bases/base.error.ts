export interface BaseErrorOptions {
	statusCode?: number;
	code?: string;
	details?: unknown;
	isOperational?: boolean;
	cause?: unknown;
}

export class BaseError extends Error {
	public readonly statusCode: number;
	public readonly code: string;
	public readonly details?: unknown;
	public readonly isOperational: boolean;

	constructor(message: string, options: BaseErrorOptions = {}) {
		super(message);

		this.name = new.target.name;
		this.statusCode = options.statusCode ?? 500;
		this.code = options.code ?? "INTERNAL_SERVER_ERROR";
		this.details = options.details;
		this.isOperational = options.isOperational ?? true;

		if (options.cause !== undefined) {
			(this as Error & { cause?: unknown }).cause = options.cause;
		}

		Error.captureStackTrace?.(this, new.target);
	}
}