import { RolModel } from "./rol_model.js";

export const RolService = {
  async crearRol(data) {
    const nuevoRol = new RolModel(data);
    return await nuevoRol.save();
  },

  async obtenerRoles() {
    return await RolModel.find();
  },

  async obtenerRolPorId(id) {
    return await RolModel.findById(id);
  },

  async actualizarRol(id, data) {
    return await RolModel.findByIdAndUpdate(id, data, { new: true });
  },

  async eliminarRol(id) {
    return await RolModel.findByIdAndDelete(id);
  }
};
