import { csevr_001Model } from "../csevr-001/csevr_001_model.js";
import { sdscmp_008Model } from "../sdscmp-008/sdscmp_008_model.js";
import { cvmp_003Model } from "../cvmp-003/cvmp_003_model.js";
import {ddmp_004Model} from "../ddmp-004/ddmp_004_model.js";
import { emhmp_001Model } from "../emhmp-001/emhmp_001_model.js";
import {empmp_002Model} from "../empmp-002/empmp_002_model.js";
import { lcmp_006Model } from "../lcmp-006/lcmp_006_model.js";
import { pfsbmp_007Model } from "../pfsbmp-007/pfsbmp_007_model.js";
import { sbmp_005Model } from "../sbmp-005/sbmp_005_model.js";
import { spalmp_009Model } from "../spalmp-009/spalmp_009_model.js";

// Registro de todos los modelos de formularios
const MODELOS_FORMULARIOS = {
  csevr_001: csevr_001Model,
  sdscmp_008: sdscmp_008Model,
  emhmp_001: emhmp_001Model,
  pfsbmp_007: pfsbmp_007Model,
  cvmp_003: cvmp_003Model,
  ddmp_004: ddmp_004Model,
  emhmp_001: emhmp_001Model,
  empmp_002: empmp_002Model,
  lcmp_006: lcmp_006Model,
  pfsbmp_007: pfsbmp_007Model,
  sbmp_005: sbmp_005Model,
  sdscmp_008: sdscmp_008Model,
  spalmp_009: spalmp_009Model,
  // Aquí irás agregando los demás formularios conforme los necesites
};

export const ObservacionesService = {
  // Obtener todas las observaciones pendientes de todos los formularios
  async obtenerTodasObservacionesPendientes() {
    try {
      // Crear un array de promesas para consultar todos los modelos en paralelo
      const queries = Object.entries(MODELOS_FORMULARIOS).map(([tipo, modelo]) =>
        modelo.find({
          observaciones: "SI",
          observacion_leida: false
        })
          .populate({
            path: "id_tarea",
            populate: [
              { path: "id_area", select: "nombre_area" },
              { path: "id_sector", select: "nombre_sector" },
              { path: "id_descripcion", select: "nombre_descripcion" },
              { path: "id_item", select: "nombre_item" },
              { path: "responsable", select: "nombre_usuario email" },
            ]
          })
          .populate("firmas.supervisor", "nombre_usuario email")
          .populate("firmas.supervisor_area", "nombre_usuario email")
          .populate("firmas.brigada", "nombre_usuario email")
          .lean() // Convierte a objetos planos de JS para mejor performance
          .then(results => results.map(r => ({ 
            ...r, 
            tipo_formulario: tipo // Agregar el tipo de formulario a cada resultado
          })))
      );

      // Ejecutar todas las consultas en paralelo
      const resultados = await Promise.all(queries);
      
      // Combinar todos los resultados en un solo array
      const todosLosFormularios = resultados.flat();

      // Ordenar por fecha de inspección descendente (más recientes primero)
      return todosLosFormularios.sort((a, b) => 
        new Date(b.fecha_inspeccion) - new Date(a.fecha_inspeccion)
      );
    } catch (error) {
      throw new Error(`Error al obtener observaciones pendientes: ${error.message}`);
    }
  },

  // Marcar una observación como leída
  async marcarObservacionLeida(tipo_formulario, id) {
    try {
      const modelo = MODELOS_FORMULARIOS[tipo_formulario];
      
      if (!modelo) {
        throw new Error(`Tipo de formulario no válido: ${tipo_formulario}`);
      }

      const resultado = await modelo.findByIdAndUpdate(
        id,
        { observacion_leida: true },
        { 
          new: true,
          runValidators: true 
        }
      )
        .populate({
          path: "id_tarea",
          populate: [
            { path: "id_area", select: "nombre_area" },
            { path: "id_sector", select: "nombre_sector" },
            { path: "id_descripcion", select: "nombre_descripcion" },
            { path: "id_item", select: "nombre_item" },
            { path: "responsable", select: "nombre_usuario email" },
          ]
        })
        .populate("firmas.supervisor", "nombre_usuario email")
        .populate("firmas.supervisor_area", "nombre_usuario email")
        .populate("firmas.brigada", "nombre_usuario email");

      return resultado;
    } catch (error) {
      throw new Error(`Error al marcar observación como leída: ${error.message}`);
    }
  },

  // Obtener el conteo de observaciones pendientes por tipo de formulario
  async obtenerConteoObservacionesPendientes() {
    try {
      const conteos = await Promise.all(
        Object.entries(MODELOS_FORMULARIOS).map(async ([tipo, modelo]) => {
          const count = await modelo.countDocuments({
            observaciones: "SI",
            observacion_leida: false
          });
          return { tipo_formulario: tipo, count };
        })
      );

      const total = conteos.reduce((sum, item) => sum + item.count, 0);

      return {
        total,
        por_formulario: conteos
      };
    } catch (error) {
      throw new Error(`Error al obtener conteo de observaciones: ${error.message}`);
    }
  }
};