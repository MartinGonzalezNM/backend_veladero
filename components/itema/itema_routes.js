import { Router } from "express";
import { ItemaController } from "./itema_controller.js";

const router = Router();

router.post("/", ItemaController.crear);
router.get("/", ItemaController.obtenerTodos);
router.get("/filtros", ItemaController.obtenerPorFiltros);
router.get("/:id", ItemaController.obtenerPorId);
router.put("/:id", ItemaController.actualizar);
router.delete("/:id", ItemaController.eliminar);

export default router;