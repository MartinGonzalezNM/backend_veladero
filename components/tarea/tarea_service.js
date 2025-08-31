import { TareaModel } from "./tarea_model.js";

export const TareaService = {
  async crearTarea(data) {
    const tarea = new TareaModel(data);
    return await tarea.save();
  },

  async obtenerTareas() {
    return await TareaModel.find()
      .populate("id_area", "nombre_area")
      .populate("id_sector", "nombre_sector")
      .populate("id_empresa", "nombre_empresa")
      .populate("id_descripcion", "nombre_descripcion")
      .populate("id_item", "nombre_item")
      .populate("responsable", "nombre_usuario email");
  },

  async obtenerTareaPorId(id) {
    return await TareaModel.findById(id)
      .populate("id_area")
      .populate("id_sector")
      .populate("id_empresa")
      .populate("responsable", "nombre_usuario email");
  },

  async actualizarTarea(id, data) {
    return await TareaModel.findByIdAndUpdate(id, data, { new: true });
  },

  async eliminarTarea(id) {
    return await TareaModel.findByIdAndDelete(id);
  }
};
