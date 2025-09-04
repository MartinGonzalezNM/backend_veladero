import { cpevp002Model } from "./cpevp002_model.js";

export const Cpevp002Service = {
  async crearCpevp002(data) {
    const nuevoRegistro = new cpevp002Model(data);
    return await nuevoRegistro.save();
  },

  async obtenerTodos() {
    return await cpevp002Model.find()
      .populate("id_area")
      .populate("id_sector")
      .populate("id_empresa")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async obtenerPorId(id) {
    return await cpevp002Model.findById(id)
      .populate("id_area")
      .populate("id_sector")
      .populate("id_empresa")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  },

  async actualizar(id, data) {
    return await cpevp002Model.findByIdAndUpdate(id, data, { 
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
    return await cpevp002Model.findByIdAndDelete(id);
  },

  async obtenerPorFiltros(filtros) {
    return await cpevp002Model.find(filtros)
      .populate("id_area")
      .populate("id_sector")
      .populate("id_empresa")
      .populate("firmas.supervisor")
      .populate("firmas.supervisor_area")
      .populate("firmas.brigada");
  }
};