import { chevp_002Service } from "./chevp_002_service.js";
import { imageService } from "../imagenes/imageService.js";
import ExcelJS from "exceljs";
import { procesarImagenBase64 } from "../imagenes/imageProcessor.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const chevp_002Controller = {

  async crear(req, res) {
    try {
      const carpeta = 'chevp_002';
      let datosFormulario = await procesarImagenBase64(req.body, carpeta);
      
      const registro = await chevp_002Service.crearChevp002(datosFormulario);
      res.status(201).json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.error('Error en crear chevp002:', error);
    }
  },

  async obtenerTodos(req, res) {
    try {
      const registros = await chevp_002Service.obtenerTodos();
      res.json(registros);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const registro = await chevp_002Service.obtenerPorId(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro chevp002 no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  //obtener por id de tarea
  async obtenerPorIdTarea(req, res) {
    try {
      const registro = await chevp_002Service.obtenerPorIdTarea(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro chevp002 no encontrado" });
      res.json(registro);
      console.log('Registro encontrado:', registro);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const registro = await chevp_002Service.actualizar(req.params.id, req.body);
      if (!registro) return res.status(404).json({ error: "Registro chevp002 no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const registro = await chevp_002Service.eliminar(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro chevp002 no encontrado" });
      res.json({ message: "Registro chevp002  eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
}