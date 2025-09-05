import { ItemAModel } from "./itema_model.js";

export const ItemAService = {
  async crearCpevp002(data) {
    const nuevoRegistro = new ItemAModel(data);
    return await nuevoRegistro.save();
  },

  async obtenerTodos() {
    return await ItemAModel.find()
      .populate("id_area")
      .populate("id_sector")
      .populate("id_empresa")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async obtenerPorId(id) {
    return await ItemAModel.findById(id)
      .populate("id_area")
      .populate("id_sector")
      .populate("id_empresa")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async actualizar(id, data) {
    return await ItemAModel.findByIdAndUpdate(id, data, { 
      new: true,
      runValidators: true 
    }).populate("id_area")
      .populate("id_sector")
      .populate("id_empresa")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async eliminar(id) {
    return await ItemAModel.findByIdAndDelete(id);
  },

  async obtenerPorFiltros(filtros) {
    return await ItemAModel.find(filtros)
      .populate("id_area")
      .populate("id_sector")
      .populate("id_empresa")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  }
};