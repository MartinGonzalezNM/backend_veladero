import express from "express";
import { spalmp_009Controller } from "./spalmp_009_controller.js";
import { verificarToken } from "../../../auth/auth_middleware.js";

const router = express.Router();

// Rutas CRUD básicas
router.post("/", verificarToken, spalmp_009Controller.crear);
router.get("/", verificarToken, spalmp_009Controller.obtenerTodos);
router.get("/:id", verificarToken, spalmp_009Controller.obtenerPorId);
router.get("/tarea/:id", verificarToken, spalmp_009Controller.obtenerPorIdTarea);
router.put("/:id", verificarToken, spalmp_009Controller.actualizar);
router.delete("/:id", verificarToken, spalmp_009Controller.eliminar);

// Ruta para exportar a Excel
//router.get("/tarea/:id/excel", verificarToken, spalmp_009Controller.exportarExcel);
export default router;