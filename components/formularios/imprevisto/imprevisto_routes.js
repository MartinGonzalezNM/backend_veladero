import { Router } from "express";
import { imprevistoController } from "./imprevisto_controller.js";

const router = Router();

// Rutas principales
router.post("/", imprevistoController.crear);
router.put("/:id", imprevistoController.actualizar);


// Rutas existentes
router.get("/", imprevistoController.obtenerTodos);
router.get("/:id", imprevistoController.obtenerPorId);
router.delete("/:id", imprevistoController.eliminar);

router.get('/:id/excel', imprevistoController.exportarImprevistoExcel);

export default router;