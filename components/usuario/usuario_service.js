import { UsuarioModel } from "./usuario_model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const UsuarioService = {
  // Crear usuario con contraseña hasheada
  async crearUsuario(data) {
    const salt = await bcrypt.genSalt(10);
    data.contrasena = await bcrypt.hash(data.contrasena, salt);
    const usuario = new UsuarioModel(data);
    return await usuario.save();
  },

  async obtenerUsuarios() {
    return await UsuarioModel.find();
  },

  async obtenerUsuariosPorRol() {
    return await UsuarioModel.find({ rol: "usuario" });
  },

  async obtenerUsuarioPorId(id) {
    return await UsuarioModel.findById(id);
  },

  async actualizarUsuario(id, data) {
    if (data.contrasena) {
      const salt = await bcrypt.genSalt(10);
      data.contrasena = await bcrypt.hash(data.contrasena, salt);
    }
    return await UsuarioModel.findByIdAndUpdate(id, data, { new: true });
  },

  async eliminarUsuario(id) {
    return await UsuarioModel.findByIdAndDelete(id);
  },

  async obtenerUsuarioPorEmail(email) {
    return await UsuarioModel.findOne({ email });
  },

  // 🔹 Login: validar usuario, contraseña y generar token
  async login(email, contrasena) {
    const usuario = await this.obtenerUsuarioPorEmail(email);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordValida) {
      throw new Error("Contraseña incorrecta");
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET || "secreto_dev",
      { expiresIn: "2h" }
    );

    return {
      token,
      usuario: {
        id: usuario._id,
        email: usuario.email,
        nombre: usuario.nombre_usuario,
      },
    };
  },
};
