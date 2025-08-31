import { Router } from "express";
import { DescripcionController } from "./descripcion_controller.js";

const router = Router();

router.post("/", DescripcionController.crear);
router.get("/", DescripcionController.obtenerTodos);
router.get("/:id", DescripcionController.obtenerPorId);
router.put("/:id", DescripcionController.actualizar);
router.delete("/:id", DescripcionController.eliminar);

export default router;
