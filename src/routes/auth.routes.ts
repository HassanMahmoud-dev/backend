import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { uploadProfile } from "../utils/upload";

const router = Router();

router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
router.put(
  "/profile",
  authenticateToken,
  uploadProfile.single("AVATAR"),
  authController.updateProfile,
);

export default router;
