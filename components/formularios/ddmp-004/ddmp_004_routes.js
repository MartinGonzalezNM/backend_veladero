import express from "express";
import { verificarToken } from "../../../auth/auth_middleware.js";
import { ddmp_004Controller } from "./ddmp_004_controller.js";

const router = express.Router();

// Rutas CRUD básicas
router.post("/", verificarToken, ddmp_004Controller.crear);
router.get("/", verificarToken, ddmp_004Controller.obtenerTodos);
router.get("/:id", verificarToken, ddmp_004Controller.obtenerPorId);
router.put("/:id", verificarToken, ddmp_004Controller.actualizar);
router.delete("/:id", verificarToken, ddmp_004Controller.eliminar);

export default router;