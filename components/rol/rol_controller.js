import { RolService } from "./rol_service.js";

export const RolController = {
  async crearRol(req, res) {
    try {
      const rol = await RolService.crearRol(req.body);
      res.status(201).json(rol);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerRoles(req, res) {
    try {
      const roles = await RolService.obtenerRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerRolPorId(req, res) {
    try {
      const rol = await RolService.obtenerRolPorId(req.params.id);
      if (!rol) return res.status(404).json({ error: "Rol no encontrado" });
      res.json(rol);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizarRol(req, res) {
    try {
      const rol = await RolService.actualizarRol(req.params.id, req.body);
      if (!rol) return res.status(404).json({ error: "Rol no encontrado" });
      res.json(rol);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async eliminarRol(req, res) {
    try {
      const rol = await RolService.eliminarRol(req.params.id);
      if (!rol) return res.status(404).json({ error: "Rol no encontrado" });
      res.json({ mensaje: "Rol eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
