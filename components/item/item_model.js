
import e from "express";
import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
    codigo_item: { type: String, required: true, unique: true },
    nombre_item: { type: String},
    estado: { type: String, enum: ["activo", "inactivo"], default: "activo" }

});

export const ItemModel = mongoose.model("Item", ItemSchema);
