import { chevp_002Model } from "./chevp_002_model.js";
import { TareaService } from "../../tarea/tarea_service.js";

export const chevp_002Service = {
  async crearChevp002(data) {
    const nuevoRegistro = new chevp_002Model(data);
    
    //cambiar el estado de la tarea a 'completada'
    await TareaService.finalizarTarea(data.id_tarea);
    return await nuevoRegistro.save();
  },

  async obtenerTodos() {
    return await chevp_002Model.find()
      .populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async obtenerPorId(id) {
    return await chevp_002Model.findById(id)
      .populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },
  
  //elimine obtener por id de tarea, llamar a la collection tareas creo que no se usaba
  //obtener por id de tarea, llamar a la collection tareas
  async obtenerPorIdTarea(id_tarea) {
    return await chevp_002Model.findOne({ id_tarea })
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
    return await chevp_002Model.findByIdAndUpdate(id, data, { 
      new: true,
      runValidators: true 
    }).populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async eliminar(id) {
    return await chevp_002Model.findByIdAndDelete(id);
  },
  
   //elimine obtener por filtros creo que no se usaba

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

