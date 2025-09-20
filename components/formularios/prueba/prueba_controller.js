import { pruebaService } from "./prueba_service.js";

export const pruebaController = {
  async crear(req, res) {
    try {
      const registro = await pruebaService.crearPrueba(req.body);
      res.status(201).json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async obtenerTodos(req, res) {
    try {
      const registros = await pruebaService.obtenerTodos();
      res.json(registros);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const registro = await pruebaService.obtenerPorId(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const registro = await pruebaService.actualizar(req.params.id, req.body);
      if (!registro) return res.status(404).json({ error: "Registro no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const registro = await pruebaService.eliminar(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro no encontrado" });
      res.json({ message: "Registro eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorFiltros(req, res) {
    try {
      const { id_tarea, fecha_inicio, fecha_fin, red_seca, red_humeda } = req.query;
      
      const filtros = {};
      
      if (id_tarea) filtros.id_tarea = id_tarea;
      if (red_seca) filtros['checklist.red_seca'] = red_seca;
      if (red_humeda) filtros['checklist.red_humeda'] = red_humeda;
      
      if (fecha_inicio || fecha_fin) {
        filtros.fecha_inspeccion = {};
        if (fecha_inicio) filtros.fecha_inspeccion.$gte = new Date(fecha_inicio);
        if (fecha_fin) filtros.fecha_inspeccion.$lte = new Date(fecha_fin);
      }

      const registros = await pruebaService.obtenerPorFiltros(filtros);
      res.json(registros);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorTarea(req, res) {
    try {
      const { id_tarea } = req.params;
      const registros = await pruebaService.obtenerPorTarea(id_tarea);
      res.json(registros);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};