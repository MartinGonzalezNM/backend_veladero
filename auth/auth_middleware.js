import jwt from "jsonwebtoken";
import { UsuarioModel } from "../components/usuario/usuario_model.js";

export const verificarToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ 
        error: "Acceso denegado. Token requerido." 
      });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto_dev");
    
    // Opcional: Verificar si el usuario aún existe en la base de datos
    const usuario = await UsuarioModel.findById(decoded.id);
    if (!usuario) {
      return res.status(401).json({ 
        error: "Token inválido. Usuario no encontrado." 
      });
    }

    // Agregar la información del usuario al request
    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        error: "Token expirado." 
      });
    }
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        error: "Token inválido." 
      });
    }

    console.error("Error en middleware de autenticación:", error);
    return res.status(500).json({ 
      error: "Error interno del servidor." 
    });
  }
};