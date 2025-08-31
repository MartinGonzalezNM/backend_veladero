import e from "express";
import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
    nombre_usuario: { type: String, required: true },
    contrasena: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    id_usuario_creo:{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario"},
    id_usuario_modifico:{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
    id_empresa: { type: mongoose.Schema.Types.ObjectId, ref: "Empresa", required: true },
    estado: { type: String, enum: ["activo", "inactivo"], default: "activo" }
});

export const UsuarioModel = mongoose.model("Usuario", UsuarioSchema);
