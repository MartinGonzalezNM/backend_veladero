
import e from "express";
import mongoose from "mongoose";

const SectorSchema = new mongoose.Schema({
    nombre_sector: { type: String, required: true },
    id_usuario_creo:{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario"},
    id_usuario_modifico:{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
    id_empresa: { type: mongoose.Schema.Types.ObjectId, ref: "Empresa", required: true },
    estado: { type: String, enum: ["activo", "inactivo"], default: "activo" }
});

export const SectorModel = mongoose.model("Sector", SectorSchema);
