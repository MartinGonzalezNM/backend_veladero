import { empmp_002Service } from "./empmp_002_service.js";
import { procesarImagenBase64 } from "../imagenes/imageProcessor.js";

export const empmp_002Controller = {
  async crear(req, res) {
    try {
      const carpeta = 'empmp_002';
      let datosFormulario = await procesarImagenBase64(req.body, carpeta);

      const registro = await empmp_002Service.crearEmpmp002(datosFormulario);
      res.status(201).json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.error('Error en crear empmp_002:', error);
    }
  },

  async obtenerTodos(req, res) {
    try {
      const registros = await empmp_002Service.obtenerTodos();
      res.json(registros);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const registro = await empmp_002Service.obtenerPorId(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro empmp_002 no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const registro = await empmp_002Service.actualizar(req.params.id, req.body);
      if (!registro) return res.status(404).json({ error: "Registro empmp_002 no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const registro = await empmp_002Service.eliminar(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro empmp_002 no encontrado" });
      res.json({ message: "Registro empmp_002 eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};