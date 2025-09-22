// routes/prueba_routes.js
import { Router } from "express";
import { pruebaController } from "./prueba_controller.js";
import { upload } from "../../services/imagenService.js";

const router = Router();

// Rutas que pueden recibir imagen (firma_imagen)
router.post("/", upload.single('firma_imagen'), pruebaController.crear);
router.put("/:id", upload.single('firma_imagen'), pruebaController.actualizar);

// Rutas que no necesitan manejo de archivos
router.get("/", pruebaController.obtenerTodos);
router.get("/filtros", pruebaController.obtenerPorFiltros);
router.get("/tarea/:id_tarea", pruebaController.obtenerPorTarea);
router.get("/:id", pruebaController.obtenerPorId);
router.delete("/:id", pruebaController.eliminar);

export default router;