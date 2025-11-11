import { Router } from "express";
import { ObservacionesController } from "./observaciones_controller.js";
import { verificarToken } from "../../../auth/auth_middleware.js";

const router = Router();

// Obtener todas las observaciones pendientes
router.get("/pendientes", verificarToken, ObservacionesController.obtenerTodasObservacionesPendientes);

// Obtener conteo de observaciones pendientes
router.get("/conteo", verificarToken,  ObservacionesController.obtenerConteoObservacionesPendientes);

// Marcar una observación como leída
router.patch("/:tipo_formulario/:id/marcar-leida", verificarToken, ObservacionesController.marcarObservacionLeida);

export default router;