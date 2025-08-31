// components/sector/sector_service.js
import { SectorModel } from "./sector.model.js";
export const SectorService = {
  async crearSector(data) {
    const sector = new SectorModel(data);
    return await sector.save();
  },

  async obtenerSectores() {
    return await SectorModel.find()
//      .populate("id_usuario_creo", "nombre_usuario email")
//      .populate("id_usuario_modifico", "nombre_usuario email")
//      .populate("id_empresa", "nombre_empresa");
  },

  async obtenerSectorPorId(id) {
    return await SectorModel.findById(id)
 //     .populate("id_usuario_creo", "nombre_usuario email")
 //     .populate("id_usuario_modifico", "nombre_usuario email")
 //     .populate("id_empresa", "nombre_empresa");
  },

  async actualizarSector(id, data) {
    return await SectorModel.findByIdAndUpdate(id, data, { new: true });
  },

  async eliminarSector(id) {
    return await SectorModel.findByIdAndDelete(id);
  },
};
