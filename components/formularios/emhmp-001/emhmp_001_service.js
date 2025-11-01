import { emhmp_001Model } from "./emhmp_001_model.js";
import { TareaService } from "../../tarea/tarea_service.js";

export const emhmp_001Service = {
  async crearEmhmp001(data) {
    const nuevoRegistro = new emhmp_001Model(data);
    
    // Cambiar el estado de la tarea a 'completada'
    await TareaService.finalizarTarea(data.id_tarea);
    return await nuevoRegistro.save();
  },

  async obtenerTodos() {
    return await emhmp_001Model.find()
      .populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async obtenerPorId(id) {
    return await emhmp_001Model.findById(id)
      .populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async actualizar(id, data) {
    return await emhmp_001Model.findByIdAndUpdate(id, data, { 
      new: true,
      runValidators: true 
    }).populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async eliminar(id) {
    return await emhmp_001Model.findByIdAndDelete(id);
  }
};