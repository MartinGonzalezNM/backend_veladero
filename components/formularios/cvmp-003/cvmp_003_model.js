import mongoose from "mongoose";

const checkItemSchema = new mongoose.Schema({
  estado: { 
    type: String, 
    enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"],
    default: "N/A"
  }
}, { _id: false });

const cuadroValvulasInspeccionSchema = new mongoose.Schema({
  numero_cuadro_valvula: { type: String, required: true }, 

  tipo_sistema_estado_integridad: {
    red_seca: checkItemSchema,
    red_humeda: checkItemSchema,
    limpieza_cuadro_componentes: checkItemSchema,
    limpieza_sala_eliminacion_obstaculos: checkItemSchema,
    observo_puntos_oxidacion_corrigio: checkItemSchema,
    libre_de_obstaculos: checkItemSchema,
    temperatura_ambiente_normal: checkItemSchema
  },


  sistema_tracing: {
    tracing_posee_temp: checkItemSchema,
    tracing_posee_recubrimiento_termico: checkItemSchema,
    tracing_posee_recubrimiento_mecanico: checkItemSchema,
    tracing_cubre_critica_cañeria: checkItemSchema,
    chequear_hay_tension: checkItemSchema,
    posee_piloto_luminoso: checkItemSchema,
    posee_alimentacion_independiente: checkItemSchema,
  },


  estado_valvulas: {
    valvulas_abiertas: checkItemSchema,
    estado_valvula_control_alarmas: checkItemSchema,
    valvula_control_conectada_a_central: checkItemSchema,
    estado_valvula_anti_retorno: checkItemSchema,
    estado_valvulas_principales: checkItemSchema,
    estado_valvulas_auxiliares: checkItemSchema,
    valvula_purga_carrada: checkItemSchema,
    comprobo_apertura_cierre_valvulas_aplique: checkItemSchema,
    detector_flujo: checkItemSchema,
    lubrico_partes_moviles_valvulas: checkItemSchema
  },


  estado_componentes_integridad: {
    estado_monturas: checkItemSchema,
    estado_tuberias: checkItemSchema,
    estado_fisico_compresor_aire: checkItemSchema,
    estado_manguera_aire_componentes: checkItemSchema,
    cambio_agrego_aceite_compresores: checkItemSchema,
    estado_bridas_ranuradas: checkItemSchema,
    estado_tee: checkItemSchema,
    estado_reducciones: checkItemSchema,
    estado_manometros: checkItemSchema,
    estado_conexion_acometida: checkItemSchema,
    purga_agua_compresores: checkItemSchema,
    estado_campana_hidraulica: checkItemSchema,
    estado_codos_curvas: checkItemSchema
  },
}, { _id: false });

const cvmp_003Schema = new mongoose.Schema({
  id_tarea: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Tarea", 
    required: true 
  },
  codigo_formulario: { type: String, default: "CVMP-003" },
  nombre_formulario: { type: String, default: "INSPECCION CUADRO DE VALVULAS" },
  
  fecha_inspeccion: { type: Date, default: Date.now },

  
  cuadros: [cuadroValvulasInspeccionSchema],


  comentarios: { type: String },


  imagenes: [{
    url: { type: String },
    nombre_imagen: { type: String },
    fecha_subida: { type: Date, default: Date.now },
    tamaño: { type: Number },
    tipo_mime: { type: String },
    numero_hidrante: { type: String } 
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

export const cvmp_003Model = mongoose.model("cvmp_003", cvmp_003Schema);