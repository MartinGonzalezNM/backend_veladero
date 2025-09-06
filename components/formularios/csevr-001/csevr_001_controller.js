import { csevr_001Service } from "./csevr_001_service.js";

export const csevr_001Controller = {
  async crear(req, res) {
    try {
      const registro = await csevr_001Service.crearCsevr001(req.body);
      res.status(201).json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async obtenerTodos(req, res) {
    try {
      const registros = await csevr_001Service.obtenerTodos();
      res.json(registros);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const registro = await csevr_001Service.obtenerPorId(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const registro = await csevr_001Service.actualizar(req.params.id, req.body);
      if (!registro) return res.status(404).json({ error: "Registro no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const registro = await csevr_001Service.eliminar(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro no encontrado" });
      res.json({ message: "Registro eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorFiltros(req, res) {
    try {
      const { id_area, id_sector, id_empresa, fecha_inicio, fecha_fin } = req.query;
      
      const filtros = {};
      
      if (id_area) filtros.id_area = id_area;
      if (id_sector) filtros.id_sector = id_sector;
      if (id_empresa) filtros.id_empresa = id_empresa;
      
      if (fecha_inicio || fecha_fin) {
        filtros.fecha_inspeccion = {};
        if (fecha_inicio) filtros.fecha_inspeccion.$gte = new Date(fecha_inicio);
        if (fecha_fin) filtros.fecha_inspeccion.$lte = new Date(fecha_fin);
      }

      const registros = await csevr_001Service.obtenerPorFiltros(filtros);
      res.json(registros);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};