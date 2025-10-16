import { Router } from "express";
import { ObservacionesController } from "./observaciones_controller.js";

const router = Router();

// Obtener todas las observaciones pendientes
router.get("/pendientes", ObservacionesController.obtenerTodasObservacionesPendientes);

// Obtener conteo de observaciones pendientes
router.get("/conteo", ObservacionesController.obtenerConteoObservacionesPendientes);

// Marcar una observación como leída
router.patch("/:tipo_formulario/:id/marcar-leida", ObservacionesController.marcarObservacionLeida);

export default router;