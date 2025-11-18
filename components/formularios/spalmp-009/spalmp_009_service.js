import { spalmp_009Model } from "./spalmp_009_model.js";
import { TareaService } from "../../tarea/tarea_service.js";

export const spalmp_009Service = {
  async crearSpalmp009(data) {
    const nuevoRegistro = new spalmp_009Model(data);
    
    //cambiar el estado de la tarea a 'completada'
    await TareaService.finalizarTarea(data.id_tarea);
    return await nuevoRegistro.save();
  },

  async obtenerTodos() {
    return await spalmp_009Model.find()
      .populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async obtenerPorId(id) {
    return await spalmp_009Model.findById(id)
      .populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async obtenerPorIdTarea(id_tarea) {
    return await spalmp_009Model.findOne({ id_tarea })
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
    return await spalmp_009Model.findByIdAndUpdate(id, data, { 
      new: true,
      runValidators: true 
    }).populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async eliminar(id) {
    return await spalmp_009Model.findByIdAndDelete(id);
  },

   //elimine obtener por filtros creo que no se usaba
};