
import e from "express";
import mongoose from "mongoose";

const HhSchema = new mongoose.Schema({
    duracion_hh: { type: Number},
    estado: { type: String, enum: ["activo", "inactivo"], default: "activo" }

});

export const HhModel = mongoose.model("Hh", HhSchema);
