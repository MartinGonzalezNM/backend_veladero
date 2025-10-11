import express from "express";
import { sdscmp_008Controller } from "./sdscmp_008_controller.js";

const router = express.Router();

// Rutas CRUD básicas
router.post("/", sdscmp_008Controller.crear);
router.get("/", sdscmp_008Controller.obtenerTodos);
router.get("/:id", sdscmp_008Controller.obtenerPorId);
router.get("/tarea/:id", sdscmp_008Controller.obtenerPorIdTarea);
router.put("/:id", sdscmp_008Controller.actualizar);
router.delete("/:id", sdscmp_008Controller.eliminar);

// Ruta para filtros
router.get("/filtros/buscar", sdscmp_008Controller.obtenerPorFiltros);

// Ruta para exportar a Excel
router.get("/exportar/excel/:id", sdscmp_008Controller.exportarExcel);

export default router;