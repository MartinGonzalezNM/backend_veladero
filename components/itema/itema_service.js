import { ItemaModel } from "./itema_model.js";

export const ItemaService = {
  async crearCpevp002(data) {
    const nuevoRegistro = new ItemaModel(data);
    return await nuevoRegistro.save();
  },

  async obtenerTodos() {
    return await ItemaModel.find()
      .populate("id_area")
      .populate("id_sector")
      .populate("id_empresa")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async obtenerPorId(id) {
    return await ItemaModel.findById(id)
      .populate("id_area")
      .populate("id_sector")
      .populate("id_empresa")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async actualizar(id, data) {
    return await ItemaModel.findByIdAndUpdate(id, data, { 
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
    return await ItemaModel.findByIdAndDelete(id);
  },

  async obtenerPorFiltros(filtros) {
    return await ItemaModel.find(filtros)
      .populate("id_area")
      .populate("id_sector")
      .populate("id_empresa")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  }
};