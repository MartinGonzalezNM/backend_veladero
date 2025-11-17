import express from "express";
import { verificarToken } from "../../../auth/auth_middleware.js";
import { lcmp_006Controller } from "./lcmp_006_controller.js";

const router = express.Router();

router.post("/", verificarToken, lcmp_006Controller.crear);
router.get("/", verificarToken, lcmp_006Controller.obtenerTodos);
router.get("/:id", verificarToken, lcmp_006Controller.obtenerPorId);
router.put("/:id", verificarToken, lcmp_006Controller.actualizar);
router.delete("/:id", verificarToken, lcmp_006Controller.eliminar);
router.get("/tarea/:id", verificarToken, lcmp_006Controller.obtenerPorIdTarea);
//router.get("/tarea/:id/excel", verificarToken, lcmp_006Controller.exportarExcelCompleto);

export default router;