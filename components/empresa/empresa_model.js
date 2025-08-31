
import e from "express";
import mongoose from "mongoose";

const EmpresaSchema = new mongoose.Schema({
    nombre_empresa: { type: String, required: true },
    rubro: { type: String, required: true },
    logo_url: { type: String },
    configuracion: { type: Object },
    estado: { type: String, enum: ["activo", "inactivo"], default: "activo" }
});

export const EmpresaModel = mongoose.model("Empresa", EmpresaSchema);
