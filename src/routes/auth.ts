import { Router } from "express";
import authRoutes from "./auth.routes";
import healthRoutes from "./health.route";
import systemUserRoutes from "./systemUser.routes";

const router = Router();

router.use("/", authRoutes);
router.use("/", healthRoutes);
router.use("/users", systemUserRoutes);

export default router;
