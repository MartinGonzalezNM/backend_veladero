import { SegundoModel } from "./segundo_model.js";

export const SegundoService = {
  async crearHH(data) {
    const nuevoHH = new SegundoModel(data);
    return await nuevoHH.save();
  },

  async obtenerHHs() {
    return await SegundoModel.find();
  },

  async obtenerHHPorId(id) {
    return await SegundoModel.findById(id);
  },

  async actualizarHH(id, data) {
    return await SegundoModel.findByIdAndUpdate(id, data, { new: true });
  },

  async eliminarHH(id) {
    return await SegundoModel.findByIdAndDelete(id);
  }
};
