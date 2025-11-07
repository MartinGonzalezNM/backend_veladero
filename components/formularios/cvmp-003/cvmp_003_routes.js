import express from "express";
import { cvmp_003Controller } from "./cvmp_003_controller.js";

const router = express.Router();

router.post("/", cvmp_003Controller.crear);
router.get("/", cvmp_003Controller.obtenerTodos);
router.get("/:id", cvmp_003Controller.obtenerPorId);
router.put("/:id", cvmp_003Controller.actualizar);
router.delete("/:id", cvmp_003Controller.eliminar);

router.get("/tarea/:id", cvmp_003Controller.obtenerPorIdTarea);

export default router;