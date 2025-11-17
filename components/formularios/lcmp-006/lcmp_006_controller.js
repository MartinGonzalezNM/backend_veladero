import { lcmp_006Service } from "./lcmp_006_service.js";
import { procesarImagenBase64 } from "../imagenes/imageProcessor.js";


export const lcmp_006Controller = {
  async crear(req, res) {
    try {
      const carpeta = 'lcmp_006';
      let datosFormulario = await procesarImagenBase64(req.body, carpeta);
      
      const registro = await lcmp_006Service.crearLcmp006(datosFormulario);
      res.status(201).json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.error('Error en crear lcmp_006:', error);
    }
  },

  async obtenerTodos(req, res) {
    try {
      const registros = await lcmp_006Service.obtenerTodos();
      res.json(registros);
    } catch (error) {
      console.error('Error en obtener lcmp_006:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const registro = await lcmp_006Service.actualizar(req.params.id, req.body);
      if (!registro) return res.status(404).json({ error: "Registro lcmp_006 no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const registro = await lcmp_006Service.eliminar(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro lcmp_006 no encontrado" });
      res.json({ message: "Registro lcmp_006 eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
  try {
    const registro = await lcmp_006Service.obtenerPorId(req.params.id);
    if (!registro) return res.status(404).json({ error: "Registro lcmp_006 no encontrado" });
    res.json(registro);
    console.log('Registro encontrado:', registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

async obtenerPorIdTarea(req, res) {
  try {
    const registro = await lcmp_006Service.obtenerPorIdTarea(req.params.id);
    if (!registro) return res.status(404).json({ error: "Registro lcmp_006 no encontrado" });
    res.json(registro);
    console.log('Registro encontrado:', registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

}