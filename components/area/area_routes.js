// components/area/area_routes.js
import { Router } from "express";
import { AreaController } from "./area_controller.js";

const router = Router();

router.get("/", AreaController.getAll);
router.get("/:id", AreaController.getById);
router.post("/", AreaController.create);
router.put("/:id", AreaController.update);
router.delete("/:id", AreaController.delete);

export default router;
