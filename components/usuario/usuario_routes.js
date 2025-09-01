import { Router } from "express";
import { UsuarioController } from "./usuario_controller.js";

const router = Router();

router.post("/", UsuarioController.crearUsuario);
router.get("/", UsuarioController.obtenerUsuarios);
router.get("/users", UsuarioController.obtenerUsuariosPorRol);
router.get("/:id", UsuarioController.obtenerUsuarioPorId);
router.put("/:id", UsuarioController.actualizarUsuario);
router.delete("/:id", UsuarioController.eliminarUsuario);
router.post("/login", UsuarioController.login);


export default router;
