import { Router } from "express";
import { csevr_001Controller } from "./csevr_001_controller.js";
import { verificarToken } from "../../../auth/auth_middleware.js";

const router = Router();

router.post("/", verificarToken, csevr_001Controller.crear);
router.get("/", verificarToken, csevr_001Controller.obtenerTodos);
router.get("/:id", verificarToken, csevr_001Controller.obtenerPorId);
router.get("/tarea/:id", verificarToken, csevr_001Controller.obtenerPorIdTarea);
router.put("/:id", verificarToken, csevr_001Controller.actualizar);
router.delete("/:id", verificarToken, csevr_001Controller.eliminar);
router.get("/tarea/:id/excel", verificarToken, csevr_001Controller.exportarExcel);

/*
router.patch("/:id/marcar-observacion-leida", csevr_001Controller.marcarObservacionLeida);
router.get("/observaciones-pendientes", csevr_001Controller.obtenerObservacionesPendientes);
*/
export default router;