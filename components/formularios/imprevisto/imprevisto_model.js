import mongoose from "mongoose";

const imprevistoSchema = new mongoose.Schema({
  codigo_formulario: { type: String, default: "imp-01" },
  nombre_formulario: { type: String, default: "IMPREVISTO" },

  fecha_inspeccion: { type: Date, default: Date.now },
  sector: { type: String },
  hh: { type: String },
  participantes: { type: String },
  resumen_tareas: { type: String },
  descripcion_tarea: { type: String },
  tipo: { type: String },


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

export const imprevistoModel = mongoose.model("imprevisto", imprevistoSchema);