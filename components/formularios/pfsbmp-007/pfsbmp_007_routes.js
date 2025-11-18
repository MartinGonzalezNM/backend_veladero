import express from "express";
import { pfsbmp_007Controller } from "./pfsbmp_007_controller.js";
import { verificarToken } from "../../../auth/auth_middleware.js";

const router = express.Router();

router.post("/", verificarToken, pfsbmp_007Controller.crear);
router.get("/", verificarToken, pfsbmp_007Controller.obtenerTodos);
router.get("/:id", verificarToken, pfsbmp_007Controller.obtenerPorId);
router.put("/:id", verificarToken, pfsbmp_007Controller.actualizar);
router.delete("/:id", verificarToken, pfsbmp_007Controller.eliminar);

router.get("/tarea/:id", verificarToken, pfsbmp_007Controller.obtenerPorIdTarea);
router.get("/tarea/:id/excel", verificarToken, pfsbmp_007Controller.exportarExcel);


export default router;