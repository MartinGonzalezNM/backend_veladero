import mongoose from "mongoose";

const sdscmp_008Schema = new mongoose.Schema({
  id_tarea: { type: mongoose.Schema.Types.ObjectId, ref: "Tarea", required: true },
  codigo_formulario: { type: String, default: "SDSCMP-008" },
  nombre_formulario: { type: String, default: "CONTROL DE SISTEMA CONTRA INCENDIO" },

  fecha_inspeccion: { type: Date, default: Date.now },

  checklist: {
    numero_precinto_existente:{type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"]},
    numero_precinto_nuevo:{type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"]},
    panel_alarma_operativo: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    pilotos_led_operativos: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    detectores_temperatura_operativos: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    detectores_humo_operativos: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    accionadores_manuales: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    fuente_alimentacion_principal_voltaje: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    fuente_alimentacion_secundaria_voltaje: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    tension_bateria_plena_carga_voltaje: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    tension_bateria_voltaje: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    probado_detectores_fotoelectricos: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    probado_detectores_temperatura: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    sensores_accionamiento_manual: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    verifico_conectores_senales_visuales: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    control_lazo_abierto: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    retiraron_detectores_chequear_conexion: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    enclavamiento_sistemas_adecuado: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] },
    limpio_gabinete_baterias_conexiones: { type: String, enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"] }
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
  observacion_leida: { type: Boolean, default: false },

  firmas: {
    supervisor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
    supervisor_area: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
    brigada: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }
  }
}, {
  timestamps: true
});

export const sdscmp_008Model = mongoose.model("sdscmp_008", sdscmp_008Schema);