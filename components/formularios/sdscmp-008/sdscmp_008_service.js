import { sdscmp_008Model } from "./sdscmp_008_model.js";
import { TareaService } from "../../tarea/tarea_service.js";

export const sdscmp_008Service = {
  async crearSdscmp008(data) {
    const nuevoRegistro = new sdscmp_008Model(data);
    
    //cambiar el estado de la tarea a 'completada'
    await TareaService.finalizarTarea(data.id_tarea);
    return await nuevoRegistro.save();
  },

  async obtenerTodos() {
    return await sdscmp_008Model.find()
      .populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async obtenerPorId(id) {
    return await sdscmp_008Model.findById(id)
      .populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async obtenerPorIdTarea(id_tarea) {
    return await sdscmp_008Model.findOne({ id_tarea })
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
    return await sdscmp_008Model.findByIdAndUpdate(id, data, { 
      new: true,
      runValidators: true 
    }).populate("id_tarea")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async eliminar(id) {
    return await sdscmp_008Model.findByIdAndDelete(id);
  },

   //elimine obtener por filtros creo que no se usaba
};