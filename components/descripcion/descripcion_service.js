import { DescripcionModel } from "./descripcion_model.js";

export const DescripcionService = {
  async crearDescripcion(data) {
    const descripcion = new DescripcionModel(data);
    return await descripcion.save();
  },

  async obtenerDescripciones() {
    return await DescripcionModel.find();
  },

  async obtenerDescripcionPorId(id) {
    return await DescripcionModel.findById(id);
  },

  async actualizarDescripcion(id, data) {
    return await DescripcionModel.findByIdAndUpdate(id, data, { new: true });
  },

  async eliminarDescripcion(id) {
    return await DescripcionModel.findByIdAndDelete(id);
  }
};
