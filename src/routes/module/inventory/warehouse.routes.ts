import { Router } from "express";
import { warehouseController } from "@/controllers/module/inventory/warehouse.controller";
import { authenticateToken, authorizeRole } from "@/middlewares/auth.middleware";

const router = Router();

router.use(authenticateToken, authorizeRole(["admin", "employee"]));

router.get("/", warehouseController.findAll);
router.get("/:id", warehouseController.findOne);
router.post("/", warehouseController.create);
router.put("/:id", warehouseController.update);
router.delete("/:id", warehouseController.delete);

export default router;
