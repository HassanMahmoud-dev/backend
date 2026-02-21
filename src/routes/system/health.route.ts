import { Router } from "express";
import { healthController } from "@/controllers/system/health.controller";

const router = Router();

router.get("/health", healthController.getSystemHealth);
router.get("/health/db", healthController.getDatabaseHealth);

export default router;
