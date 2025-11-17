import express from "express";
import { verificarToken } from "../../../auth/auth_middleware.js";
import { mp_006Controller } from "./mp_006_controller.js";

const router = express.Router();

router.post("/", verificarToken, mp_006Controller.crear);
router.get("/", verificarToken, mp_006Controller.obtenerTodos);
router.get("/:id", verificarToken, mp_006Controller.obtenerPorId);
router.put("/:id", verificarToken, mp_006Controller.actualizar);
router.delete("/:id", verificarToken, mp_006Controller.eliminar);
router.get("/tarea/:id", verificarToken, mp_006Controller.obtenerPorIdTarea);
//router.get("/tarea/:id/excel", verificarToken, mp_006Controller.exportarExcelCompleto);

export default router;