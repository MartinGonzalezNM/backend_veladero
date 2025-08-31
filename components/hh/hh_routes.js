import { Router } from "express";
import { HHController } from "./hh_controller.js";

const router = Router();

router.post("/", HHController.crear);
router.get("/", HHController.obtenerTodos);
router.get("/:id", HHController.obtenerPorId);
router.put("/:id", HHController.actualizar);
router.delete("/:id", HHController.eliminar);

export default router;
