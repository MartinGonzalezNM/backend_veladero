import express from "express";
import { sdscmp_008Controller } from "./sdscmp_008_controller.js";
import { verificarToken } from "../../../auth/auth_middleware.js";

const router = express.Router();

// Rutas CRUD básicas
router.post("/", verificarToken, sdscmp_008Controller.crear);
router.get("/", verificarToken, sdscmp_008Controller.obtenerTodos);
router.get("/:id", verificarToken, sdscmp_008Controller.obtenerPorId);
router.get("/tarea/:id", verificarToken, sdscmp_008Controller.obtenerPorIdTarea);
router.put("/:id", verificarToken, sdscmp_008Controller.actualizar);
router.delete("/:id", verificarToken, sdscmp_008Controller.eliminar);

// Ruta para exportar a Excel
router.get("/tarea/:id/excel", verificarToken, sdscmp_008Controller.exportarExcel);
export default router;