// components/sector/sector_routes.js
import { Router } from "express";
import { SectorController } from "./sector_controller.js";

const router = Router();

router.post("/", SectorController.crear);
router.get("/", SectorController.obtenerTodos);
router.get("/:id", SectorController.obtenerPorId);
router.put("/:id", SectorController.actualizar);
router.delete("/:id", SectorController.eliminar);

export default router;
