import { Router } from "express";
import { EmpresaController } from "./empresa_controller.js";

const router = Router();

router.post("/", EmpresaController.create);
router.get("/", EmpresaController.getAll);
router.get("/:id", EmpresaController.getById);
router.put("/:id", EmpresaController.update);
router.delete("/:id", EmpresaController.delete);

export default router;
