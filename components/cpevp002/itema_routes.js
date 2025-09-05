import { Router } from "express";
import { ItemAController } from "./itema_controller";

const router = Router();

router.post("/", ItemAController.crear);
router.get("/", ItemAController.obtenerTodos);
router.get("/filtros", ItemAController.obtenerPorFiltros);
router.get("/:id", ItemAController.obtenerPorId);
router.put("/:id", ItemAController.actualizar);
router.delete("/:id", ItemAController.eliminar);

export default router;