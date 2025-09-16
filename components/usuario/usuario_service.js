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

 async verifyToken(token) {
    try {
      // ✅ Verificar que el token existe
      if (!token) {
        return { valido: false, error: "Token no proporcionado" };
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET );
      
      // Buscar el usuario en la base de datos para obtener datos actualizados
      const usuario = await UsuarioModel.findById(decoded.id).select('-contrasena');
      
      if (!usuario) {
        return { valido: false, error: "Usuario no encontrado" };
      }

      return { 
        valido: true, 
        usuario: {
          id: usuario._id,
          email: usuario.email,
          nombre: usuario.nombre_usuario,
          rol: usuario.rol
        }
      };
    } catch (error) {
      console.error("Error verificando token:", error);
      
      // Manejar diferentes tipos de errores JWT
      if (error.name === 'TokenExpiredError') {
        return { valido: false, error: "Token expirado" };
      }
      if (error.name === 'JsonWebTokenError') {
        return { valido: false, error: "Token inválido" };
      }
      
      return { valido: false, error: "Error verificando token" };
    }
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

    // ✅ INCLUIR EL ROL EN EL TOKEN
    const token = jwt.sign(
      { 
        id: usuario._id, 
        email: usuario.email,
        rol: usuario.rol 
      },
      process.env.JWT_SECRET,
      { expiresIn: "14d" }
    );

    return {
      token,
      usuario: {
        id: usuario._id,
        email: usuario.email,
        nombre: usuario.nombre_usuario,
        rol: usuario.rol  // ✅ También devolver el rol en la respuesta
      },
    };
  },
};