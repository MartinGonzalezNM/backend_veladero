import express from "express";
import { TareaController } from "./tarea_controller.js";
import { cpevp002Model } from "../cpevp002/itema_model.js";

const router = express.Router();

router.post("/", TareaController.crear);
router.get("/", TareaController.listar);
router.get("/:id", TareaController.obtener);
router.patch("/:id", TareaController.actualizar);
router.delete("/:id", TareaController.eliminar);

export default router;
