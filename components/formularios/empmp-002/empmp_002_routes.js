import express from "express";
import { empmp_002Controller } from "./empmp_002_controller.js";
import { verificarToken } from "../../../auth/auth_middleware.js";

const router = express.Router();

// Rutas CRUD básicas
router.post("/", verificarToken, empmp_002Controller.crear);
router.get("/", verificarToken, empmp_002Controller.obtenerTodos);
router.get("/:id", verificarToken, empmp_002Controller.obtenerPorId);
router.put("/:id", verificarToken, empmp_002Controller.actualizar);
router.delete("/:id", verificarToken, empmp_002Controller.eliminar);
router.get("/tarea/:id", verificarToken, empmp_002Controller.obtenerPorIdTarea);

router.get("/tarea/:id/excel", verificarToken, empmp_002Controller.exportarExcel);

export default router;