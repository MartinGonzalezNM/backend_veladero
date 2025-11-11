import { empmp_002Model } from "./empmp_002_model.js";
import { TareaService } from "../../tarea/tarea_service.js";

export const empmp_002Service = {
  async crearEmpmp002(data) {
    const nuevoRegistro = new empmp_002Model(data);
    
    // Cambiar el estado de la tarea a 'completada'
    await TareaService.finalizarTarea(data.id_tarea);
    return await nuevoRegistro.save();
  },

  async obtenerTodos() {
    return await empmp_002Model.find()
      .populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async obtenerPorId(id) {
    return await empmp_002Model.findById(id)
      .populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async actualizar(id, data) {
    return await empmp_002Model.findByIdAndUpdate(id, data, { 
      new: true,
      runValidators: true 
    }).populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async eliminar(id) {
    return await empmp_002Model.findByIdAndDelete(id);
  },
  async obtenerPorIdTarea(id_tarea) {
    return await empmp_002Model.findOne({ id_tarea })
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