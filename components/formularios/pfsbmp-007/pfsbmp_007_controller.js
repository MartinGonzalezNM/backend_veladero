import { pfsbmp_007Service } from "./pfsbmp_007_service.js";
import { procesarImagenBase64 } from "../imagenes/imageProcessor.js";



export const pfsbmp_007Controller = {
  async crear(req, res) {
    try {
      const carpeta = 'pfsbmp_007';
      let datosFormulario = await procesarImagenBase64(req.body, carpeta);
      
      const registro = await pfsbmp_007Service.crearPfsbmp007(datosFormulario);
      res.status(201).json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.error('Error en crear pfsbmp_007:', error);
    }
  },

  async obtenerTodos(req, res) {
    try {
      const registros = await pfsbmp_007Service.obtenerTodos();
      res.json(registros);
    } catch (error) {
      console.error('Error en obtener pfsbmp_007:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const registro = await pfsbmp_007Service.actualizar(req.params.id, req.body);
      if (!registro) return res.status(404).json({ error: "Registro pfsbmp_007 no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const registro = await pfsbmp_007Service.eliminar(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro pfsbmp_007 no encontrado" });
      res.json({ message: "Registro pfsbmp_007 eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
  try {
    const registro = await pfsbmp_007Service.obtenerPorId(req.params.id);
    if (!registro) return res.status(404).json({ error: "Registro pfsbmp_007 no encontrado" });
    res.json(registro);
    console.log('Registro encontrado:', registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

async obtenerPorIdTarea(req, res) {
  try {
    const registro = await pfsbmp_007Service.obtenerPorIdTarea(req.params.id);
    if (!registro) return res.status(404).json({ error: "Registro pfsbmp_007 no encontrado" });
    res.json(registro);
    console.log('Registro encontrado:', registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},
}