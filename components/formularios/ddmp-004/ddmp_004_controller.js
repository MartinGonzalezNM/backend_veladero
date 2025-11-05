import { ddmp_004Service } from "./ddmp_004_service.js";
import { procesarImagenBase64 } from "../imagenes/imageProcessor.js";

export const ddmp_004Controller = {
  async crear(req, res) {
    try {
      const carpeta = 'ddmp_004';
      let datosFormulario = await procesarImagenBase64(req.body, carpeta);

      const registro = await ddmp_004Service.crearDdmp004(datosFormulario);
      res.status(201).json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.error('Error en crear ddmp_004:', error);
    }
  },

  async obtenerTodos(req, res) {
    try {
      const registros = await ddmp_004Service.obtenerTodos();
      res.json(registros);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const registro = await ddmp_004Service.obtenerPorId(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro ddmp_004 no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const registro = await ddmp_004Service.actualizar(req.params.id, req.body);
      if (!registro) return res.status(404).json({ error: "Registro ddmp_004 no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const registro = await ddmp_004Service.eliminar(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro ddmp_004 no encontrado" });
      res.json({ message: "Registro ddmp_004 eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

    async obtenerPorIdTarea(req, res) {
      try {
        const registro = await ddmp_004Service.obtenerPorIdTarea(req.params.id);
        if (!registro) return res.status(404).json({ error: "Registro no encontrado" });
        res.json(registro);
        console.log('Registro encontrado:', registro);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
};