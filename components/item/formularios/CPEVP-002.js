
import e from "express";
import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
    nombre_formulario: { type: String},
    estado: { type: String, enum: ["activo", "inactivo"], default: "activo" }

});

export const ItemModel = mongoose.model("Item", ItemSchema);
