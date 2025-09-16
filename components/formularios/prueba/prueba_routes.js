import { Router } from "express";
import { pruebaController } from "./prueba_controller.js";

const router = Router();

router.post("/", pruebaController.crear);
router.get("/", pruebaController.obtenerTodos);
router.get("/filtros", pruebaController.obtenerPorFiltros);
router.get("/tarea/:id_tarea", pruebaController.obtenerPorTarea);
router.get("/:id", pruebaController.obtenerPorId);
router.put("/:id", pruebaController.actualizar);
router.delete("/:id", pruebaController.eliminar);

export default router;