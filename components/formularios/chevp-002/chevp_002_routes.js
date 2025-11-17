import { Router } from "express";
import { chevp_002Controller } from "./chevp_002_controller.js";
import { verificarToken } from "../../../auth/auth_middleware.js";

const router = Router();

router.post("/", verificarToken, chevp_002Controller.crear);
router.get("/", verificarToken, chevp_002Controller.obtenerTodos);
router.get("/:id", verificarToken, chevp_002Controller.obtenerPorId);
router.get("/tarea/:id", verificarToken, chevp_002Controller.obtenerPorIdTarea);
router.put("/:id", verificarToken, chevp_002Controller.actualizar);
router.delete("/:id", verificarToken, chevp_002Controller.eliminar);

/*
router.patch("/:id/marcar-observacion-leida", csevr_001Controller.marcarObservacionLeida);
router.get("/observaciones-pendientes", csevr_001Controller.obtenerObservacionesPendientes);
*/
export default router;