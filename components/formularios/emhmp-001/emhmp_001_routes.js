import express from "express";
import { emhmp_001Controller } from "./emhmp_001_controller.js";
import { verificarToken } from "../../../auth/auth_middleware.js";

const router = express.Router();

// Rutas CRUD básicas
router.post("/", verificarToken, emhmp_001Controller.crear);
router.get("/", verificarToken, emhmp_001Controller.obtenerTodos);
router.get("/:id", verificarToken, emhmp_001Controller.obtenerPorId);
router.put("/:id", verificarToken, emhmp_001Controller.actualizar);
router.delete("/:id", verificarToken, emhmp_001Controller.eliminar);
router.get("/tarea/:id", verificarToken, emhmp_001Controller.obtenerPorIdTarea);

router.get("/tarea/:id/excel", verificarToken, emhmp_001Controller.exportarExcel);

export default router;