import { Router } from "express";
import { csevr_001Controller } from "./csevr_001_controller.js";

const router = Router();

router.post("/", csevr_001Controller.crear);
router.get("/", csevr_001Controller.obtenerTodos);
router.get("/filtros", csevr_001Controller.obtenerPorFiltros);
router.get("/:id", csevr_001Controller.obtenerPorId);
router.get("/tarea/:id", csevr_001Controller.obtenerPorIdTarea);
router.put("/:id", csevr_001Controller.actualizar);
router.delete("/:id", csevr_001Controller.eliminar);
// En tu archivo de rutas (csevr_001Routes.js)
router.get("/tarea/:id/excel", csevr_001Controller.exportarExcel);

export default router;