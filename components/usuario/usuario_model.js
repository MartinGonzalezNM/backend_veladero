import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
  nombre_usuario: { type: String, required: true },
  contrasena: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rol: { type: String, enum: ["admin", "usuario"], default: "usuario" },
  estado: { type: String, enum: ["activo", "inactivo"], default: "activo" },
  firmaUrl: { type: String, default: null }, // 👈 acá guardamos la firma
});

export const UsuarioModel = mongoose.model("Usuario", UsuarioSchema);
