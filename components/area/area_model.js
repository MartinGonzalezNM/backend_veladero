
import e from "express";
import mongoose from "mongoose";

const AreaSchema = new mongoose.Schema({
    nombre_area: { type: String, required: true },
//  id_usuario_creo:{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario"},
//  id_usuario_modifico:{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
    id_empresa: { type: mongoose.Schema.Types.ObjectId, ref: "Empresa", required: true },
    estado: { type: String, enum: ["activo", "inactivo"], default: "activo" }
});

export const AreaModel = mongoose.model("Area", AreaSchema);
