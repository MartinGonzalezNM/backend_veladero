import mongoose from "mongoose";

const descontaminacionDetectorSchema = new mongoose.Schema({
  numero_detector: { type: String, required: true }, // "1, 2 ,3 ", etc.

  // SECCIÓN: TIPO
  tipo: {
    type: String,
  },

  // SECCIÓN: APARTADO
  apartado: {
    type: String,
  },

  // SECCIÓN: NIVEL
  nivel: {
    type: String,
  },

}, { _id: false });

const ddmp_004Schema = new mongoose.Schema({
  id_tarea: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Tarea", 
    required: true 
  },
  codigo_formulario: { type: String, default: "DDMP-004" },
  nombre_formulario: { type: String, default: "DESCONTAMINACION DE DETECTORES" },
  
  sector: { type: String },
  fecha_inspeccion: { type: Date, default: Date.now },
  nombre_firma_tecnico: { type: String },

  // ARRAY de detectores inspeccionados
  detectores: [descontaminacionDetectorSchema],

  // Comentarios generales
  comentarios: { type: String },

  // Imágenes generales (puedes agregar más si necesitas por detector)
  imagenes: [{
    url: { type: String },
    nombre_imagen: { type: String },
    fecha_subida: { type: Date, default: Date.now },
    tamaño: { type: Number },
    tipo_mime: { type: String },
    numero_hidrante: { type: String } // Para asociar imagen a hidrante específico
  }],

  observaciones: { type: String, enum: ["SI", "NO"] },
  observaciones_generales: { type: String },
  observacion_leida: { type: Boolean, default: false },

  firmas: {
    supervisor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
    supervisor_area: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
    brigada: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }
  }

}, {
  timestamps: true
});

export const ddmp_004Model = mongoose.model("ddmp_004", ddmp_004Schema);