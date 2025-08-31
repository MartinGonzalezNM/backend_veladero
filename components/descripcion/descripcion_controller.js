import { DescripcionService } from "./descripcion_service.js";

export const DescripcionController = {
  async crear(req, res) {
    try {
      const descripcion = await DescripcionService.crearDescripcion(req.body);
      res.status(201).json(descripcion);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async obtenerTodos(req, res) {
    try {
      const descripciones = await DescripcionService.obtenerDescripciones();
      res.json(descripciones);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const descripcion = await DescripcionService.obtenerDescripcionPorId(req.params.id);
      if (!descripcion) return res.status(404).json({ error: "Descripcion no encontrada" });
      res.json(descripcion);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const descripcion = await DescripcionService.actualizarDescripcion(req.params.id, req.body);
      if (!descripcion) return res.status(404).json({ error: "Descripcion no encontrada" });
      res.json(descripcion);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const descripcion = await DescripcionService.eliminarDescripcion(req.params.id);
      if (!descripcion) return res.status(404).json({ error: "Descripcion no encontrada" });
      res.json({ message: "Descripcion eliminada correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
