
import e from "express";
import mongoose from "mongoose";

const RolSchema = new mongoose.Schema({
    nombre_rol: { type: String, required: true },
    puede_crear: { type: Boolean, default: false },
    puede_leer: { type: Boolean, default: false },
    puede_actualizar: { type: Boolean, default: false },
    puede_eliminar: { type: Boolean, default: false },
    estado: { type: String, enum: ["activo", "inactivo"], default: "activo" }
});

export const RolModel = mongoose.model("Rol", RolSchema);
