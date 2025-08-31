import { Router } from "express";
import { ItemController } from "./item_controller.js";

const router = Router();

router.post("/", ItemController.crear);
router.get("/", ItemController.obtenerTodos);
router.get("/:id", ItemController.obtenerPorId);
router.put("/:id", ItemController.actualizar);
router.delete("/:id", ItemController.eliminar);

export default router;
