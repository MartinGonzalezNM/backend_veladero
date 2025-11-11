import { pfsbmp_007Model } from "./pfsbmp_007_model.js";
import { TareaService } from "../../tarea/tarea_service.js";

export const pfsbmp_007Service = {
  async crearPfsbmp007(data) {
    const nuevoRegistro = new pfsbmp_007Model(data);
    
    // Cambiar el estado de la tarea a 'completada'
    await TareaService.finalizarTarea(data.id_tarea);
    return await nuevoRegistro.save();
  },

  async obtenerTodos() {
    return await pfsbmp_007Model.find()
      .populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async actualizar(id, data) {
    return await pfsbmp_007Model.findByIdAndUpdate(id, data, { 
      new: true,
      runValidators: true 
    }).populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async eliminar(id) {
    return await pfsbmp_007Model.findByIdAndDelete(id);
  },
  async obtenerPorId(id) {
  return await pfsbmp_007Model.findById(id)
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
  return await pfsbmp_007Model.findOne({ id_tarea })
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