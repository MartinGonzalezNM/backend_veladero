import mongoose from "mongoose";
import e from "express";

const ItemASchema = new mongoose.Schema({
  id_area: { type: mongoose.Schema.Types.ObjectId, ref: "Area", required: true },
  id_sector: { type: mongoose.Schema.Types.ObjectId, ref: "Sector", required: true },
  id_empresa: { type: mongoose.Schema.Types.ObjectId, ref: "Empresa", required: true },

  fecha_inspeccion: { type: Date, default: Date.now },

  checklist: {
    red_seca: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    red_humeda: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    observo_filtraciones: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    observo_pintura_componentes: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    observo_sulfatacion: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    observo_deformacion: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    temperatura_ruptura: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    sprinkler_lateral: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    sprinkler_pendiente: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    sprinkler_montante: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    valvula_fin_linea: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    movimiento_agua: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    valvula_deterioro: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
  },

  comentario: { type: String },

  firmas: {
    supervisor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
    supervisor_area: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
    brigada: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }
  }
}, {
  timestamps: true
});

export const ItemAModel = mongoose.model("cpevp002", ItemASchema);
