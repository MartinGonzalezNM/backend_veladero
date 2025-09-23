import { TareaService } from "./tarea_service.js";

export const TareaController = {
  async crear(req, res) {
    try {
      const tarea = await TareaService.crearTarea(req.body);
      res.status(201).json(tarea);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async listar(req, res) {
    try {
      const tareas = await TareaService.obtenerTareas();
      res.json(tareas);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async obtener(req, res) {
    try {
      const tarea = await TareaService.obtenerTareaPorId(req.params.id);
      if (!tarea) return res.status(404).json({ error: "Tarea no encontrada" });
      res.json(tarea);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async actualizar(req, res) {
    try {
      const tarea = await TareaService.actualizarTarea(req.params.id, req.body);
      res.json(tarea);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async eliminar(req, res) {
    try {
      await TareaService.eliminarTarea(req.params.id);
      res.json({ mensaje: "Tarea eliminada correctamente" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async obtenerPorUsuario(req, res) {
    try {
      const tareas = await TareaService.obtenerTareaPorUsuario(req.params.usuarioId);
      res.json(tareas);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async obtenerFinalizadasPorUsuario(req, res) {
    try {
      const tareas = await TareaService.obtenerTareaFinalizadaPorUsuario(req.params.usuarioId);
      res.json(tareas);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

};
