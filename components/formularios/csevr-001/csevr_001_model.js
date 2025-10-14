import mongoose from "mongoose";
import e from "express";

const csevr_001Schema = new mongoose.Schema({
  id_tarea: { type: mongoose.Schema.Types.ObjectId, ref: "Tarea", required: true },
  codigo_formulario: { type: String, default: "CSEVR-001" },
  nombre_formulario: { type: String, default: "CONTROL DE SPRINKLERS" },

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

  // Campo para una sola imagen
  imagen: {
    url: { type: String },
    nombre_imagen: { type: String },
    fecha_subida: { type: Date, default: Date.now },
    tamaño: { type: Number }, // en bytes
    tipo_mime: { type: String }
  },

  observaciones: { type: String, enum: ["SI", "NO"] },
  observaciones_generales: { type: String },

 
  firmas: {
    supervisor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
    supervisor_area: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
    brigada: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }
  },


}, {
  timestamps: true
});

export const csevr_001Model = mongoose.model("csevr_001", csevr_001Schema);
