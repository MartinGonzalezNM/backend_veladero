import { csevr_001Model } from "./csevr_001_model.js";
import { TareaService } from "../../tarea/tarea_service.js";

export const csevr_001Service = {
  async crearCsevr001(data) {
    const nuevoRegistro = new csevr_001Model(data);
    
    //cambiar el estado de la tarea a 'completada'
    await TareaService.finalizarTarea(data.id_tarea);
    return await nuevoRegistro.save();
  },

  async obtenerTodos() {
    return await csevr_001Model.find()
      .populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async obtenerPorId(id) {
    return await csevr_001Model.findById(id)
      .populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },
  
  //obtener por id de tarea, llamar a la collection tareas
  async obtenerPorIdTarea(id_tarea) {
    return await csevr_001Model.findOne({ id_tarea })
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
  },

  async actualizar(id, data) {
    return await csevr_001Model.findByIdAndUpdate(id, data, { 
      new: true,
      runValidators: true 
    }).populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async eliminar(id) {
    return await csevr_001Model.findByIdAndDelete(id);
  },

  async obtenerPorFiltros(filtros) {
    return await csevr_001Model.find(filtros)
      .populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },
/*
  // NUEVA FUNCIÓN: Obtener formularios con observaciones = "SI" y observacion_leida = false
  async obtenerObservacionesPendientes() {
    return await csevr_001Model.find({
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
      .sort({ fecha_inspeccion: -1 }); // Ordenar por fecha descendente
  },

  // NUEVA FUNCIÓN: Marcar observacion_leida como true
  async marcarObservacionLeida(id) {
    return await csevr_001Model.findByIdAndUpdate(
      id,
      { observacion_leida: true },
      { 
        new: true,
        runValidators: true 
      }
    )
      .populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  }

  */
};

