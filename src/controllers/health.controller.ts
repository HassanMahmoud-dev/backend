import { Request, Response } from "express";
import { HealthService } from "@/services/health.service";
import { BaseController } from "@/bases/base.controller";

export class HealthController extends BaseController {
  private healthService: HealthService;

  constructor() {
    super();
    this.healthService = new HealthService();
  }

  public getSystemHealth = this.execute((_req: Request, res: Response) => {
    const status = this.healthService.getSystemStatus();
    this.ok(res, status);
  });

  public getDatabaseHealth = this.execute(async (_req: Request, res: Response) => {
    const status = await this.healthService.getDatabaseStatus();
    if (status.ok) {
      this.ok(res, status);
    } else {
      this.fail(res, "Database health check failed", 503, undefined, status);
    }
  });
}
