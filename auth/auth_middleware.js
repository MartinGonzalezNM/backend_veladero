// auth_middleware.js
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. Token requerido.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto_dev");
    
    // Busca el usuario en la base de datos y añádelo a req.user
    const usuario = await UsuarioModel.findById(decoded.id).select('-contrasena');
    
    if (!usuario) {
      return res.status(401).json({ message: 'Token inválido. Usuario no encontrado.' });
    }

    req.user = usuario; // ← Esto es crucial
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido.' });
  }
};