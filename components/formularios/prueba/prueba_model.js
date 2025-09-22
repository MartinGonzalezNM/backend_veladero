import mongoose from "mongoose";

const pruebaSchema = new mongoose.Schema({
  id_tarea: { type: mongoose.Schema.Types.ObjectId, ref: "Tarea", required: true },
  codigo_formulario: { type: String, default: "prueba" },
  nombre_formulario: { type: String, default: "CONTROL DE SPRINKLERS" },

  fecha_inspeccion: { type: Date, default: Date.now },

  checklist: {
    red_seca: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    red_humeda: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
  },

  comentario: { type: String },

  // Campo para una sola imagen
  imagen: {
    url: { type: String },
    nombre_archivo: { type: String },
    fecha_subida: { type: Date, default: Date.now },
    tamaño: { type: Number }, // en bytes
    tipo_mime: { type: String }
  },

  firmas: {
    supervisor: { type: String },
    supervisor_area: { type: String },
    brigada: { type: String }
  }
}, {
  timestamps: true
});

export const pruebaModel = mongoose.model("prueba", pruebaSchema);