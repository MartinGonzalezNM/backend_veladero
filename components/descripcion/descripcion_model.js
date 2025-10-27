
import e from "express";
import mongoose from "mongoose";

const DescripcionSchema = new mongoose.Schema({
    nombre_descripcion: { type: String},
    estado: { type: String, enum: ["activo", "inactivo"], default: "activo" },
    codigo_descripcion: { type: String}

});

export const DescripcionModel = mongoose.model("Descripcion", DescripcionSchema);
