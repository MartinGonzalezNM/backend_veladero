import { csevr_001Model } from "./csevr_001_model.js";

export const csevr_001Service = {
  async crearCsevr001(data) {
    const nuevoRegistro = new csevr_001Model(data);
    return await nuevoRegistro.save();
  },

  async obtenerTodos() {
    return await csevr_001Model.find()
      .populate("id_area")
      .populate("id_sector")
      .populate("id_empresa")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async obtenerPorId(id) {
    return await csevr_001Model.findById(id)
      .populate("id_area")
      .populate("id_sector")
      .populate("id_empresa")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async actualizar(id, data) {
    return await csevr_001Model.findByIdAndUpdate(id, data, { 
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
    return await csevr_001Model.findByIdAndDelete(id);
  },

  async obtenerPorFiltros(filtros) {
    return await csevr_001Model.find(filtros)
      .populate("id_area")
      .populate("id_sector")
      .populate("id_empresa")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  }
};