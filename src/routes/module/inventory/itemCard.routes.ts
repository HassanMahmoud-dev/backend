import { Router } from "express";
import { itemCardController } from "@/controllers/module/inventory/itemCard.controller";
import { authenticateToken, authorizeRole } from "@/middlewares/auth.middleware";

const router = Router();

router.use(authenticateToken, authorizeRole(["admin", "employee"]));

router.get("/", itemCardController.findAll);
router.get("/:id", itemCardController.findOne);
router.post("/", itemCardController.create);
router.put("/:id", itemCardController.update);
router.delete("/:id", itemCardController.delete);

export default router;
