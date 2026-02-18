import { Router, type RequestHandler } from "express";
import type { BaseCrudController } from "./base.controller";
import type { Model } from "sequelize";

export abstract class BaseRoutes {
  public readonly router: Router;

  constructor() {
    this.router = Router();
  }

  protected abstract initializeRoutes(): void;
}

export class BaseCrudRoutes<T extends Model> extends BaseRoutes {
  constructor(
    private readonly controller: BaseCrudController<T>,
    private readonly options: { middlewares?: RequestHandler[] } = {},
  ) {
    super();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    if (this.options.middlewares && this.options.middlewares.length > 0) {
      this.router.use(this.options.middlewares);
    }

    this.router.get("/", this.controller.findAll);
    this.router.get("/:id", this.controller.findOne);
    this.router.post("/", this.controller.create);
    this.router.put("/:id", this.controller.update);
    this.router.delete("/:id", this.controller.delete);
  }
}
