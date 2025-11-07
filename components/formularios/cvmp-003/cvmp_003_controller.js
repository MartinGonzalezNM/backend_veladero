import { cvmp_003Service } from "./cvmp_003_service.js";
import { procesarImagenBase64 } from "../imagenes/imageProcessor.js";

export const cvmp_003Controller = {
  async crear(req, res) {
    try {
      const carpeta = 'cvmp_003';
      let datosFormulario = await procesarImagenBase64(req.body, carpeta);
      
      const registro = await cvmp_003Service.crearCvmp003(datosFormulario);
      res.status(201).json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.error('Error en crear cvmp_003:', error);
    }
  },

  async obtenerTodos(req, res) {
    try {
      const registros = await cvmp_003Service.obtenerTodos();
      res.json(registros);
    } catch (error) {
      console.error('Error en obtener cvmp_003:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const registro = await cvmp_003Service.actualizar(req.params.id, req.body);
      if (!registro) return res.status(404).json({ error: "Registro cvmp_003 no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const registro = await cvmp_003Service.eliminar(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro cvmp_003 no encontrado" });
      res.json({ message: "Registro cvmp_003 eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
  try {
    const registro = await cvmp_003Service.obtenerPorId(req.params.id);
    if (!registro) return res.status(404).json({ error: "Registro cvmp_003 no encontrado" });
    res.json(registro);
    console.log('Registro encontrado:', registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

async obtenerPorIdTarea(req, res) {
  try {
    const registro = await cvmp_003Service.obtenerPorIdTarea(req.params.id);
    if (!registro) return res.status(404).json({ error: "Registro cvmp_003 no encontrado" });
    res.json(registro);
    console.log('Registro encontrado:', registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},


};