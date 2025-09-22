import { Router } from "express";
import { pruebaController } from "./prueba_controller.js";

const router = Router();

// Rutas principales
router.post("/", pruebaController.crear);
router.put("/:id", pruebaController.actualizar);

// Ruta específica para eliminar la imagen
router.delete("/:id/imagen", pruebaController.eliminarImagen);

// Rutas existentes
router.get("/", pruebaController.obtenerTodos);
router.get("/filtros", pruebaController.obtenerPorFiltros);
router.get("/tarea/:id_tarea", pruebaController.obtenerPorTarea);
router.get("/:id", pruebaController.obtenerPorId);
router.delete("/:id", pruebaController.eliminar);

export default router;