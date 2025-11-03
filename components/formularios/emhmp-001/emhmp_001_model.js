import mongoose from "mongoose";

const checkItemSchema = new mongoose.Schema({
  estado: { 
    type: String, 
    enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"],
    default: "N/A"
  }
}, { _id: false });

const hidranteInspeccionSchema = new mongoose.Schema({
  numero_hidrante: { type: String, required: true }, // "TEST 1", "TEST 2", etc.

  // SECCIÓN: ARMARIO
  armario: {
    apertura_cierre_normal_puerta: checkItemSchema,
    lubricacion_bisagras_cerraduras: checkItemSchema,
    observo_puntos_oxidacion_corrigio: checkItemSchema,
    limpieza_gabinete: checkItemSchema,
    limpieza_eliminacion_obstaculo: checkItemSchema,
    lanza: checkItemSchema,
    lubricacion_partes_moviles_lanza: checkItemSchema,
    señalizacion: checkItemSchema
  },

  // SECCIÓN: MANGUERAS Y LINEAS/FIERROS
  mangueras_lineas: {
    mangueras_x_2: checkItemSchema,
    tendido_mangueras_racorado: checkItemSchema,
    estado_roscas_uniones_limpias_cepillo: checkItemSchema,
    diametro_mangueras: checkItemSchema,
    longitud_mangueras: checkItemSchema,
    manguera_tela_goma: checkItemSchema,
    llave_storz: checkItemSchema,
    acopla_manguera: checkItemSchema,
  },

  // SECCIÓN: HIDRANTE
  hidrante: {
    diametro_acople: checkItemSchema,
    tipo_acople: checkItemSchema,
    observo_puntos_oxidacion_corrigio: checkItemSchema,
    limpieza_hidrante: checkItemSchema,
    limpieza_roscas_uniones: checkItemSchema,
    recorrido_mecanismo_apertura_cierre_valvulas: checkItemSchema,
    lubricacion_partes_moviles: checkItemSchema,
    diametro_hidrante: checkItemSchema,
    llave_hidrante: checkItemSchema,
    acople_correcto_llave_hidrante: checkItemSchema
  },

  // SECCIÓN: VALVULAS PIV
  valvulas_piv: {
    observo_puntos_oxidacion_corrigio: checkItemSchema,
    limpieza_valvula_piv: checkItemSchema,
    recorrido_mecanismo_apertura_cierre: checkItemSchema,
    lubricacion_partes_moviles: checkItemSchema,
    llave_piv: checkItemSchema,
    acople_correcto_llave_piv: checkItemSchema
  },

  // Observaciones específicas de este hidrante
  observaciones_hidrante: { type: String }
}, { _id: false });

const emhmp_001Schema = new mongoose.Schema({
  id_tarea: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Tarea", 
    required: true 
  },
  codigo_formulario: { type: String, default: "EMHMP-001" },
  nombre_formulario: { type: String, default: "ESTACIÓN DE MANGUERAS (HIDRANTES)" },
  
  sector: { type: String },
  fecha_inspeccion: { type: Date, default: Date.now },
  nombre_firma_tecnico: { type: String },

  // ARRAY de hidrantes inspeccionados
  hidrantes: [hidranteInspeccionSchema],

  // Comentarios generales
  comentarios: { type: String },

  // Imágenes generales (puedes agregar más si necesitas por hidrante)
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

export const emhmp_001Model = mongoose.model("emhmp_001", emhmp_001Schema);