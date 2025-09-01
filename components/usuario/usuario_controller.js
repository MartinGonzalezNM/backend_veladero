import { UsuarioService } from "./usuario_service.js";

export const UsuarioController = {
  // 🔹 LOGIN
  async login(req, res) {
    try {
      const { email, contrasena } = req.body;
      const result = await UsuarioService.login(email, contrasena);
      res.json(result);
    } catch (error) {
      if (error.message === "Usuario no encontrado") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === "Contraseña incorrecta") {
        return res.status(401).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // 🔹 CREAR USUARIO
  async crearUsuario(req, res) {
    try {
      const nuevoUsuario = await UsuarioService.crearUsuario(req.body);
      res.status(201).json(nuevoUsuario);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async obtenerUsuarios(req, res) {
    try {
      const usuarios = await UsuarioService.obtenerUsuarios();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerUsuariosPorRol(req, res) {
    try {
      const usuarios = await UsuarioService.obtenerUsuariosPorRol();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerUsuarioPorId(req, res) {
    try {
      const usuario = await UsuarioService.obtenerUsuarioPorId(req.params.id);
      if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizarUsuario(req, res) {
    try {
      const usuario = await UsuarioService.actualizarUsuario(req.params.id, req.body);
      if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
      res.json(usuario);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminarUsuario(req, res) {
    try {
      const usuario = await UsuarioService.eliminarUsuario(req.params.id);
      if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
      res.json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
