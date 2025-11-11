import express from "express";
import { cvmp_003Controller } from "./cvmp_003_controller.js";
import { verificarToken } from "../../../auth/auth_middleware.js";

const router = express.Router();

router.post("/", verificarToken, cvmp_003Controller.crear);
router.get("/", verificarToken, cvmp_003Controller.obtenerTodos);
router.get("/:id", verificarToken, cvmp_003Controller.obtenerPorId);
router.put("/:id", verificarToken, cvmp_003Controller.actualizar);
router.delete("/:id", verificarToken, cvmp_003Controller.eliminar);

router.get("/tarea/:id", cvmp_003Controller.obtenerPorIdTarea);
router.get("/tarea/:id/excel", cvmp_003Controller.exportarExcel);

export default router;