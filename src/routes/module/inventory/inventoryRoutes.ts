import { Router } from "express";
import itemCardRoutes from "./itemCard.routes";
import warehouseRoutes from "./warehouse.routes";

const router = Router();

router.use("/inventory/item-cards", itemCardRoutes);
router.use("/inventory/warehouses", warehouseRoutes);

export default router;
