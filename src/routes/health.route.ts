import { Router } from "express";
import { healthController } from "@/controllers/health.controller";

const router = Router();

router.get("/health", healthController.getSystemHealth);
router.get("/health/db", healthController.getDatabaseHealth);

export default router;
