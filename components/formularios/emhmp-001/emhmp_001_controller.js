import { emhmp_001Service } from "./emhmp_001_service.js";
import { procesarImagenBase64 } from "../imagenes/imageProcessor.js";

export const emhmp_001Controller = {
  async crear(req, res) {
    try {
      const carpeta = 'emhmp_001';
      let datosFormulario = await procesarImagenBase64(req.body, carpeta);
      
      const registro = await emhmp_001Service.crearEmhmp001(datosFormulario);
      res.status(201).json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.error('Error en crear emhmp_001:', error);
    }
  },

  async obtenerTodos(req, res) {
    try {
      const registros = await emhmp_001Service.obtenerTodos();
      res.json(registros);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const registro = await emhmp_001Service.obtenerPorId(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro emhmp_001 no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const registro = await emhmp_001Service.actualizar(req.params.id, req.body);
      if (!registro) return res.status(404).json({ error: "Registro emhmp_001no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const registro = await emhmp_001Service.eliminar(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro emhmp_001 no encontrado" });
      res.json({ message: "Registro emhmp_001 eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};