import { Router } from "express";
import authRoutes from "./auth.routes";
import healthRoutes from "./health.route";
import systemUserRoutes from "./systemUser.routes";
import systemRoutes from "./system.routes";

const router = Router();

// Consolidate all system routes with their respective prefixes
router.use("/auth", authRoutes);
router.use("/auth", healthRoutes);
router.use("/auth/users", systemUserRoutes);
router.use("/system", systemRoutes);

export default router;
