import { ddmp_004Model } from "./ddmp_004_model.js";
import { TareaService } from "../../tarea/tarea_service.js";

export const ddmp_004Service = {
  async crearDdmp004(data) {
    const nuevoRegistro = new ddmp_004Model(data);
    
    // Cambiar el estado de la tarea a 'completada'
    await TareaService.finalizarTarea(data.id_tarea);
    return await nuevoRegistro.save();
  },

  async obtenerTodos() {
    return await ddmp_004Model.find()
      .populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async obtenerPorId(id) {
    return await ddmp_004Model.findById(id)
      .populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async actualizar(id, data) {
    return await ddmp_004Model.findByIdAndUpdate(id, data, { 
      new: true,
      runValidators: true 
    }).populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async eliminar(id) {
    return await emhmp_001Model.findByIdAndDelete(id);
  },
    async obtenerPorIdTarea(id_tarea) {
      return await ddmp_004Model.findOne({ id_tarea })
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