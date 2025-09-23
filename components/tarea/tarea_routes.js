import express from "express";
import { TareaController } from "./tarea_controller.js";
import { verificarToken } from "../../auth/auth_middleware.js";

const router = express.Router();

router.post("/", verificarToken, TareaController.crear);
router.get("/", verificarToken, TareaController.listar);
router.get("/:id", verificarToken, TareaController.obtener);
router.patch("/:id", verificarToken, TareaController.actualizar);
router.delete("/:id", verificarToken, TareaController.eliminar);

router.get("/usuario/:usuarioId", verificarToken, TareaController.obtenerPorUsuario);

router.get("/usuario/:usuarioId/activas", verificarToken, TareaController.obtenerActivasPorUsuario);

export default router;
