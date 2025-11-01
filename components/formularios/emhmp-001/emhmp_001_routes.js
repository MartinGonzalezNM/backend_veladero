import express from "express";
import { emhmp_001Controller } from "./emhmp_001_controller.js";

const router = express.Router();

// Rutas CRUD básicas
router.post("/", emhmp_001Controller.crear);
router.get("/", emhmp_001Controller.obtenerTodos);
router.get("/:id", emhmp_001Controller.obtenerPorId);
router.put("/:id", emhmp_001Controller.actualizar);
router.delete("/:id", emhmp_001Controller.eliminar);

export default router;