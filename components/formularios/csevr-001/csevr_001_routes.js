import { Router } from "express";
import { csevr_001Controller } from "./csevr_001_controller.js";

const router = Router();

router.post("/", csevr_001Controller.crear);
router.get("/", csevr_001Controller.obtenerTodos);
router.get("/filtros", csevr_001Controller.obtenerPorFiltros);
router.get("/observaciones-pendientes", csevr_001Controller.obtenerObservacionesPendientes);
router.get("/:id", csevr_001Controller.obtenerPorId);
router.get("/tarea/:id", csevr_001Controller.obtenerPorIdTarea);
router.put("/:id", csevr_001Controller.actualizar);
router.patch("/:id/marcar-observacion-leida", csevr_001Controller.marcarObservacionLeida);
router.delete("/:id", csevr_001Controller.eliminar);
router.get("/tarea/:id/excel", csevr_001Controller.exportarExcel);

export default router;