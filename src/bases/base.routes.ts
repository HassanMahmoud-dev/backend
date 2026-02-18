import { Router } from "express";

import type { BaseController } from "./base.controller";

export abstract class BaseRoutes {
  public router: Router = Router();
  protected abstract controller: BaseController;
  protected abstract path: string;

  constructor() {
    // Initialization will be handled by subclasses calling initializeRoutes
  }

  protected abstract initializeRoutes(): void;
}
