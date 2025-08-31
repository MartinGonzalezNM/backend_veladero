import { UsuarioModel } from "./usuario_model.js";

export const UsuarioService = {
  async crearUsuario(data) {
    const usuario = new UsuarioModel(data);
    return await usuario.save();
  },

  async obtenerUsuarios() {
    return await UsuarioModel.find().populate("id_empresa id_usuario_creo id_usuario_modifico");
  },

  async obtenerUsuarioPorId(id) {
    return await UsuarioModel.findById(id).populate("id_empresa id_usuario_creo id_usuario_modifico");
  },

  async actualizarUsuario(id, data) {
    return await UsuarioModel.findByIdAndUpdate(id, data, { new: true });
  },

  async eliminarUsuario(id) {
    return await UsuarioModel.findByIdAndDelete(id);
  }
};
