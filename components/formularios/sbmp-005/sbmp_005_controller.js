import { sbmp_005Service } from "./sbmp_005_service.js";
import { procesarImagenBase64 } from "../imagenes/imageProcessor.js";

export const sbmp_005Controller = {
  async crear(req, res) {
    try {
      const carpeta = 'sbmp_005';
      let datosFormulario = await procesarImagenBase64(req.body, carpeta);
      
      const registro = await sbmp_005Service.crearSbmp005(datosFormulario);
      res.status(201).json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.error('Error en crear sbmp_005:', error);
    }
  },

  async obtenerTodos(req, res) {
    try {
      const registros = await sbmp_005Service.obtenerTodos();
      res.json(registros);
    } catch (error) {
      console.error('Error en obtener sbmp_005:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const registro = await sbmp_005Service.actualizar(req.params.id, req.body);
      if (!registro) return res.status(404).json({ error: "Registro sbmp_005 no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const registro = await sbmp_005Service.eliminar(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro sbmp_005 no encontrado" });
      res.json({ message: "Registro sbmp_005 eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
  try {
    const registro = await sbmp_005Service.obtenerPorId(req.params.id);
    if (!registro) return res.status(404).json({ error: "Registro sbmp_005 no encontrado" });
    res.json(registro);
    console.log('Registro encontrado:', registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

async obtenerPorIdTarea(req, res) {
  try {
    const registro = await sbmp_005Service.obtenerPorIdTarea(req.params.id);
    if (!registro) return res.status(404).json({ error: "Registro sbmp_005 no encontrado" });
    res.json(registro);
    console.log('Registro encontrado:', registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},


};