import express from "express";
import { sbmp_005Controller } from "./sbmp_005_controller.js";

const router = express.Router();

router.post("/", sbmp_005Controller.crear);
router.get("/", sbmp_005Controller.obtenerTodos);
router.get("/:id", sbmp_005Controller.obtenerPorId);
router.put("/:id", sbmp_005Controller.actualizar);
router.delete("/:id", sbmp_005Controller.eliminar);

router.get("/tarea/:id", sbmp_005Controller.obtenerPorIdTarea);
router.get("/tarea/:id/excel", sbmp_005Controller.exportarExcel);

export default router;