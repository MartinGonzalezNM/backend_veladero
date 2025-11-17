import { mp_006Model } from "./mp_006_model.js";
import { TareaService } from "../../tarea/tarea_service.js";

export const mp_006Service = {
  async crearMp006(data) {
    const nuevoRegistro = new mp_006Model(data);
    
    // Cambiar el estado de la tarea a 'completada'
    await TareaService.finalizarTarea(data.id_tarea);
    return await nuevoRegistro.save();
  },

  async obtenerTodos() {
    return await mp_006Model.find()
      .populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async actualizar(id, data) {
    return await mp_006Model.findByIdAndUpdate(id, data, { 
      new: true,
      runValidators: true 
    }).populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async eliminar(id) {
    return await mp_006Model.findByIdAndDelete(id);
  },
  async obtenerPorId(id) {
  return await mp_006Model.findById(id)
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

async obtenerPorIdTarea(id_tarea) {
  return await mp_006Model.findOne({ id_tarea })
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

};