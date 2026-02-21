import { Router } from "express";
import { systemUserController } from "../controllers/systemUser.controller";
import { authenticateToken, authorizeRole } from "../middlewares/auth.middleware";
import { uploadProfile } from "../utils/upload";

const router = Router();

// Apply auth middleware to all routes in this router
router.use(authenticateToken, authorizeRole(["admin"]));

router.get("/", systemUserController.findAll);
router.get("/connected", systemUserController.getConnectedUsers);
router.delete("/connected/:tokenId", systemUserController.revokeSession);
router.get("/:id", systemUserController.findOne);

// Security: Handle file upload through multer
router.post("/", uploadProfile.single("AVATAR"), systemUserController.create);
router.put("/:id", uploadProfile.single("AVATAR"), systemUserController.update);

router.delete("/:id", systemUserController.delete);

export default router;
