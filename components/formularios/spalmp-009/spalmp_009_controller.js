import { spalmp_009Service } from "./spalmp_009_service.js";
import { imageService } from "../imagenes/imageService.js";
import ExcelJS from "exceljs";
import { procesarImagenBase64 } from "../imagenes/imageProcessor.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const spalmp_009Controller = {
  async crear(req, res) {
    try {
      const carpeta = 'spalmp_009';
      let datosFormulario = await procesarImagenBase64(req.body, carpeta);
      
      const registro = await spalmp_009Service.crearSpalmp009(datosFormulario);
      res.status(201).json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.error('Error en crear spalmp009:', error);
    }
  },

  async obtenerTodos(req, res) {
    try {
      const registros = await spalmp_009Service.obtenerTodos();
      res.json(registros);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const registro = await spalmp_009Service.obtenerPorId(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro spalmp009 no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  

  async obtenerPorIdTarea(req, res) {
    try {
      const registro = await spalmp_009Service.obtenerPorIdTarea(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro spalmp009 no encontrado" });
      res.json(registro);
      console.log('Registro spalmp009 encontrado:', registro);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const registro = await spalmp_009Service.actualizar(req.params.id, req.body);
      if (!registro) return res.status(404).json({ error: "Registro spalmp009 no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const registro = await spalmp_009Service.eliminar(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro spalmp009 no encontrado" });
      res.json({ message: "Registro spalmp009 eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
}
