import e from "express";
import { RolController } from "./rol_controller.js";

const router = e.Router();

router.post("/", RolController.crearRol);
router.get("/", RolController.obtenerRoles);
router.get("/:id", RolController.obtenerRolPorId);
router.patch("/:id", RolController.actualizarRol);
router.delete("/:id", RolController.eliminarRol);

export default router;
