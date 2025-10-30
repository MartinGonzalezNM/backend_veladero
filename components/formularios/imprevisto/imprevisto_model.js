import mongoose from "mongoose";

const imprevistoSchema = new mongoose.Schema({
  codigo_formulario: { type: String, default: "imp-01" },
  nombre_formulario: { type: String, default: "IMPREVISTO" },
  fecha_inspeccion: { type: Date, default: Date.now },

  ubicacion: { type: String },
  sistema_afectado: { type: String },
  componente_afectado: { type: String },
  detalle_tarea: { type: String },
  participantes: { type: String },
  hh: { type: String },
  tipo: { type: String, enum: ["emergencia", "urgencia"] },



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