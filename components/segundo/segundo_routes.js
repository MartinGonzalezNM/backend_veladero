import { Router } from "express";
import { SegundoController } from "./segundo_controller.js";

const router = Router();

router.post("/", SegundoController.crear);
router.get("/", SegundoController.obtenerTodos);
router.get("/:id", SegundoController.obtenerPorId);
router.put("/:id", SegundoController.actualizar);
router.delete("/:id", SegundoController.eliminar);

export default router;
