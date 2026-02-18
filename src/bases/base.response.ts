export interface ResponseMeta {
  [key: string]: unknown;
}

export class BaseResponse<TData = unknown> {
  public readonly success: boolean;
  public readonly message: string;
  public readonly data?: TData;
  public readonly errors?: unknown;
  public readonly meta?: ResponseMeta;

  constructor(params: {
    success: boolean;
    message: string;
    data?: TData;
    errors?: unknown;
    meta?: ResponseMeta;
  }) {
    this.success = params.success;
    this.message = params.message;
    this.data = params.data;
    this.errors = params.errors;
    this.meta = params.meta;
  }

  public static success<TData = unknown>(
    data?: TData,
    message = "Success",
    meta?: ResponseMeta,
  ): BaseResponse<TData> {
    return new BaseResponse<TData>({
      success: true,
      message,
      data,
      meta,
    });
  }

  public static fail(
    message = "Error",
    errors?: unknown,
    meta?: ResponseMeta,
  ): BaseResponse<never> {
    return new BaseResponse<never>({
      success: false,
      message,
      errors,
      meta,
    });
  }
}
