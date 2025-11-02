import { Router } from "express";
import { imprevistoController } from "./imprevisto_controller.js";
import { verificarToken } from "../../../auth/auth_middleware.js";

const router = Router();

// Rutas principales
router.post("/", verificarToken, imprevistoController.crear);
router.put("/:id", verificarToken, imprevistoController.actualizar);

// Rutas de consulta
router.get("/", verificarToken, imprevistoController.obtenerTodos);
router.get("/:id", verificarToken, imprevistoController.obtenerPorId);

// ⭐ NUEVA RUTA PARA REPORTES (debe ir ANTES de /:id para evitar conflictos)
router.get("/reporte/rango-fechas", verificarToken, imprevistoController.obtenerParaReporte);

// Ruta para exportar imprevisto individual a Excel
router.get("/:id/excel", verificarToken, imprevistoController.exportarImprevistoExcel);

// Rutas de eliminación
router.delete("/:id", verificarToken, imprevistoController.eliminar);
router.delete("/:id/imagen", verificarToken, imprevistoController.eliminarImagen);



export default router;