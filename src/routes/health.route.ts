import { BaseRoutes } from "@/bases/base.routes";
import { HealthController } from "@/controllers/health.controller";

class HealthRoutes extends BaseRoutes {
  constructor(private controller: HealthController = new HealthController()) {
    super();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.get("/health", this.controller.getSystemHealth);
    this.router.get("/health/db", this.controller.getDatabaseHealth);
  }
}

export default new HealthRoutes().router;
