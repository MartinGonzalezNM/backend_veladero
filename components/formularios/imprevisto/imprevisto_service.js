import { imprevistoModel } from "./imprevisto_model.js";

export const imprevistoService = {
  async crearImprevisto(data) {
    const nuevoRegistro = new imprevistoModel(data);
    return await nuevoRegistro.save();
  },

  async obtenerTodos() {
    return await imprevistoModel.find()
  },

  async obtenerPorId(id) {
    return await imprevistoModel.findById(id)
  },

  async actualizar(id, data) {
    return await imprevistoModel.findByIdAndUpdate(id, data, { 
      new: true,
      runValidators: true 
    });
  },

  async eliminar(id) {
    return await imprevistoModel.findByIdAndDelete(id);
  },



};