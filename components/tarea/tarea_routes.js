import express from "express";
import { TareaController } from "./tarea_controller.js";

const router = express.Router();

router.post("/", TareaController.crear);
router.get("/", TareaController.listar);
router.get("/:id", TareaController.obtener);
router.patch("/:id", TareaController.actualizar);
router.delete("/:id", TareaController.eliminar);

export default router;
