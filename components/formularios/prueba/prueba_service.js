import { pruebaModel } from "./prueba_model.js";

export const pruebaService = {
  async crearPrueba(data) {
    const nuevoRegistro = new pruebaModel(data);
    return await nuevoRegistro.save();
  },

  async obtenerTodos() {
    return await pruebaModel.find()
      .populate("id_tarea");
      // Nota: Las firmas son strings, no referencias, por lo que no necesitan populate
  },

  async obtenerPorId(id) {
    return await pruebaModel.findById(id)
      .populate("id_tarea");
      // Las firmas son strings, no referencias
  },

  async actualizar(id, data) {
    return await pruebaModel.findByIdAndUpdate(id, data, { 
      new: true,
      runValidators: true 
    }).populate("id_tarea");
    // Las firmas son strings, no referencias
  },

  async eliminar(id) {
    return await pruebaModel.findByIdAndDelete(id);
  },

  async obtenerPorFiltros(filtros) {
    return await pruebaModel.find(filtros)
      .populate("id_tarea");
      // Las firmas son strings, no referencias
  },

  async obtenerPorTarea(id_tarea) {
    return await pruebaModel.find({ id_tarea })
      .populate("id_tarea");
      // Las firmas son strings, no referencias
  }
};