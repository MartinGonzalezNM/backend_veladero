import { HHService } from "./hh_service.js";

export const HHController = {
  async crear(req, res) {
    try {
      const hh = await HHService.crearHH(req.body);
      res.status(201).json(hh);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async obtenerTodos(req, res) {
    try {
      const hhs = await HHService.obtenerHHs();
      res.json(hhs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const hh = await HHService.obtenerHHPorId(req.params.id);
      if (!hh) return res.status(404).json({ error: "HH no encontrado" });
      res.json(hh);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const hh = await HHService.actualizarHH(req.params.id, req.body);
      if (!hh) return res.status(404).json({ error: "HH no encontrado" });
      res.json(hh);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const hh = await HHService.eliminarHH(req.params.id);
      if (!hh) return res.status(404).json({ error: "HH no encontrado" });
      res.json({ message: "HH eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
