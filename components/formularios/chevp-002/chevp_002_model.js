import mongoose from "mongoose";
import e from "express";

const chevp_002Schema = new mongoose.Schema({
  id_tarea: { type: mongoose.Schema.Types.ObjectId, ref: "Tarea", required: true },
  codigo_formulario: { type: String, default: "CHEVP-002" },
  nombre_formulario: { type: String, default: "CONTROL DE PRESION" },

  fecha_inspeccion: { type: Date, default: Date.now },

  checklist: {
    truck_shop: { 
      agua_arriba_pin_rack:{type: String},
      agua_abajo_pin_rack:{type: String},
      agua_arriba_sprinkler:{type: String},
      agua_abajo_sprinkler:{type: String},
    },
    almacen: { 
      agua_arriba_pin_rack:{type: String},
      agua_abajo_pin_rack:{type: String},
      agua_arriba_sprinkler:{type: String},
      agua_abajo_sprinkler:{type: String},
    },
    valvula_reductora_presion: { 
      agua_arriba_pin_rack:{type: String},
      agua_abajo_pin_rack:{type: String},
      agua_arriba_sprinkler:{type: String},
      agua_abajo_sprinkler:{type: String},
    },
    secundario_viejo: { 
      agua_arriba_pin_rack:{type: String},
      agua_abajo_pin_rack:{type: String},
      agua_arriba_sprinkler:{type: String},
      agua_abajo_sprinkler:{type: String},
    },
    primario_nuevo: {
      agua_arriba_pin_rack:{type: String},
      agua_abajo_pin_rack:{type: String},
      agua_arriba_sprinkler:{type: String},
      agua_abajo_sprinkler:{type: String},      
    },
    puyrredon_mina: {
      agua_arriba_pin_rack:{type: String},
      agua_abajo_pin_rack:{type: String},
      agua_arriba_sprinkler:{type: String},
      agua_abajo_sprinkler:{type: String},
    },
    planta_proceso: {
      agua_arriba_pin_rack:{type: String},
      agua_abajo_pin_rack:{type: String},
      agua_arriba_sprinkler:{type: String},
      agua_abajo_sprinkler:{type: String},
    }
  },

  comentario: { type: String },

  // Campo para una sola imagen
  imagen: {
    url: { type: String },
    nombre_imagen: { type: String },
    fecha_subida: { type: Date, default: Date.now },
    tamaño: { type: Number }, 
    tipo_mime: { type: String }
  },

  observaciones: { type: String, enum: ["SI", "NO"] },
  observaciones_generales: { type: String },
  observacion_leida: { type: Boolean, default: false },

 
  firmas: {
    supervisor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
    supervisor_area: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
    brigada: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }
  },


}, {
  timestamps: true
});

export const chevp_002Model = mongoose.model("chevp_002", chevp_002Schema);
