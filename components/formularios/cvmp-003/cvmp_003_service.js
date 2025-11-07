import { cvmp_003Model } from "./cvmp_003_model.js";
import { TareaService } from "../../tarea/tarea_service.js";

export const cvmp_003Service = {
  async crearCvmp003(data) {
    const nuevoRegistro = new cvmp_003Model(data);
    
    // Cambiar el estado de la tarea a 'completada'
    await TareaService.finalizarTarea(data.id_tarea);
    return await nuevoRegistro.save();
  },

  async obtenerTodos() {
    return await cvmp_003Model.find()
      .populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async actualizar(id, data) {
    return await cvmp_003Model.findByIdAndUpdate(id, data, { 
      new: true,
      runValidators: true 
    }).populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async eliminar(id) {
    return await cvmp_003Model.findByIdAndDelete(id);
  },
  async obtenerPorId(id) {
  return await cvmp_003Model.findById(id)
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
  return await cvmp_003Model.findOne({ id_tarea })
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