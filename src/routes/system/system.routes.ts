import { Router, RequestHandler } from "express";
import { systemController } from "@/controllers/system/system.controller";
import { authenticateToken, authorizeRole } from "@/middlewares/auth.middleware";

const router = Router();

// Restricted to admins
router.get(
  "/routes",
  authenticateToken as unknown as RequestHandler,
  authorizeRole(["admin"]) as unknown as RequestHandler,
  systemController.getApiRoutes,
);

router.get(
  "/metrics",
  authenticateToken as unknown as RequestHandler,
  authorizeRole(["admin"]) as unknown as RequestHandler,
  systemController.getSystemMetrics,
);

router.get(
  "/faults",
  authenticateToken as unknown as RequestHandler,
  authorizeRole(["admin"]) as unknown as RequestHandler,
  systemController.getFaults,
);

export default router;
