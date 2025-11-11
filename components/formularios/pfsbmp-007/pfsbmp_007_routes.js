import express from "express";
import { sbmp_005Controller } from "./sbmp_005_controller.js";
import { verificarToken } from "../../../auth/auth_middleware.js";

const router = express.Router();

router.post("/", verificarToken, sbmp_005Controller.crear);
router.get("/", verificarToken, sbmp_005Controller.obtenerTodos);
router.get("/:id", verificarToken, sbmp_005Controller.obtenerPorId);
router.put("/:id", verificarToken, sbmp_005Controller.actualizar);
router.delete("/:id", verificarToken, sbmp_005Controller.eliminar);

router.get("/tarea/:id", verificarToken, sbmp_005Controller.obtenerPorIdTarea);


export default router;