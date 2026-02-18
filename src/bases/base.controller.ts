import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { Model } from "sequelize";

import { BaseError } from "./base.error";
import { BaseResponse, type ResponseMeta } from "./base.response";
import type { BaseService } from "./base.service";

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

  protected validateResult(
    res: Response,
    data: unknown,
    message = "Not Found",
    statusCode = 404,
  ): boolean {
    if (!data) {
      this.fail(res, message, statusCode);
      return false;
    }
    return true;
  }
}

export abstract class BaseCrudController<T extends Model> extends BaseController {
  constructor(protected readonly service: BaseService<T>) {
    super();
  }

  public findAll: RequestHandler = this.execute(async (req, res) => {
    const data = await this.service.findAll();
    this.ok(res, data);
  });

  public findOne: RequestHandler = this.execute(async (req, res) => {
    const { id } = req.params;
    const data = await this.service.findById(id as string);
    if (this.validateResult(res, data)) {
      this.ok(res, data);
    }
  });

  public create: RequestHandler = this.execute(async (req, res) => {
    const data = await this.service.create(req.body);
    this.created(res, data);
  });

  public update: RequestHandler = this.execute(async (req, res) => {
    const { id } = req.params;
    const data = await this.service.update(id as string, req.body);
    if (this.validateResult(res, data, "Not Found or Update Failed")) {
      this.ok(res, data);
    }
  });

  public delete: RequestHandler = this.execute(async (req, res) => {
    const { id } = req.params;
    const deletedCount = await this.service.delete(id as string);
    if (this.validateResult(res, deletedCount, "Not Found")) {
      this.ok(res, null, "Deleted successfully");
    }
  });
}
