import { HhModel } from "./hh_model.js";

export const HHService = {
  async crearHH(data) {
    const nuevoHH = new HhModel(data);
    return await nuevoHH.save();
  },

  async obtenerHHs() {
    return await HhModel.find();
  },

  async obtenerHHPorId(id) {
    return await HhModel.findById(id);
  },

  async actualizarHH(id, data) {
    return await HhModel.findByIdAndUpdate(id, data, { new: true });
  },

  async eliminarHH(id) {
    return await HhModel.findByIdAndDelete(id);
  }
};
