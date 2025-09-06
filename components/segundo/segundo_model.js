
import e from "express";
import mongoose from "mongoose";

const SegundoSchema = new mongoose.Schema({
    duracion_hh: { type: Number},
    estado: { type: String, enum: ["activo", "inactivo"], default: "activo" }

});

export const SegundoModel = mongoose.model("Segundo", SegundoSchema);
