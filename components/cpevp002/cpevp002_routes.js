import { Router } from "express";
import { Cpevp002Controller } from "./cpevp002_controller.js";

const router = Router();

router.post("/", Cpevp002Controller.crear);
router.get("/", Cpevp002Controller.obtenerTodos);
router.get("/filtros", Cpevp002Controller.obtenerPorFiltros);
router.get("/:id", Cpevp002Controller.obtenerPorId);
router.put("/:id", Cpevp002Controller.actualizar);
router.delete("/:id", Cpevp002Controller.eliminar);

export default router;