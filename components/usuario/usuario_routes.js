import { Router } from "express";
import { UsuarioController } from "./usuario_controller.js";

const router = Router();

// 🔹 Rutas de autenticación (DEBEN IR ANTES de las rutas con parámetros)
router.post("/login", UsuarioController.login);
router.get("/verify", UsuarioController.verifyToken);

// 🔹 Rutas CRUD
router.post("/", UsuarioController.crearUsuario);
router.get("/", UsuarioController.obtenerUsuarios);
router.get("/users", UsuarioController.obtenerUsuariosPorRol);
router.get("/:id", UsuarioController.obtenerUsuarioPorId);
router.put("/:id", UsuarioController.actualizarUsuario);
router.delete("/:id", UsuarioController.eliminarUsuario);

export default router;