import { SegundoService } from "./segundo_service.js";

export const SegundoController = {
  async crear(req, res) {
    try {
      const hh = await SegundoService.crearHH(req.body);
      res.status(201).json(hh);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async obtenerTodos(req, res) {
    try {
      const hhs = await SegundoService.obtenerHHs();
      res.json(hhs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const hh = await SegundoService.obtenerHHPorId(req.params.id);
      if (!hh) return res.status(404).json({ error: "HH no encontrado" });
      res.json(hh);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const hh = await SegundoService.actualizarHH(req.params.id, req.body);
      if (!hh) return res.status(404).json({ error: "HH no encontrado" });
      res.json(hh);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const hh = await SegundoService.eliminarHH(req.params.id);
      if (!hh) return res.status(404).json({ error: "HH no encontrado" });
      res.json({ message: "HH eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
