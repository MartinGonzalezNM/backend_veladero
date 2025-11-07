import mongoose from "mongoose";

const checkItemSchema = new mongoose.Schema({
  estado: { 
    type: String, 
    enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"],
    default: "N/A"
  }
}, { _id: false });

const salaBombasInspeccionSchema = new mongoose.Schema({

  cuba_contenedora_agua: {
    controlar_indicar_nivel_agua: checkItemSchema,
    nivel:{type:String},
    observo_puntos_oxidacion_corrigio: checkItemSchema,
    verificar_eliminar_puntos_filtraciones: checkItemSchema
  },


  valvula_aspiracion: {
    recorrido_mecanico_valvula_apertura_cierre: checkItemSchema,
    lubricacion_partes_moviles: checkItemSchema,
    observo_puntos_oxidacion_corrigio: checkItemSchema,
    eliminar_filtraciones_sulfatacion: checkItemSchema,
    controlar_asiento_corte_total_fluido: checkItemSchema,
    retirar_cadenas_lubricar_colocar: checkItemSchema,
    valvula_descarga_abierta: checkItemSchema,
  },


  valvulas_recirculacion: {
    realizo_recorrido_mecanico_valvula_recirculacion: checkItemSchema,
    engrase_lubricacion_partes_moviles: checkItemSchema,
    observo_puntos_oxidacion_corrigio: checkItemSchema,
    eliminar_filtraciones_sulfatacion: checkItemSchema,
    controlar_asiento_corte_total_fluido: checkItemSchema,
    retirar_cadenas_lubricar_colocar: checkItemSchema,
    valvulas_recirculacion_queda_cerrada: checkItemSchema
  },


  valvula_descarga_alivio: {
    observo_puntos_oxidacion_corrigio: checkItemSchema,
    eliminar_filtraciones_sulfatacion: checkItemSchema,
    verificar_valvula_descarga_correctamente: checkItemSchema
  },

  bomba_jockey: {
    observo_puntos_oxidacion_corrigio: checkItemSchema,
    comprobar_apertura_cierre_valvula_aspiracion: checkItemSchema,
    comprobar_apertura_cierre_valvula_descarga: checkItemSchema
  },

  electrobomba: {
    observo_puntos_oxidacion_corrigio: checkItemSchema,
    verificar_giro_libre_turbina:checkItemSchema,
    comprobar_apertura_cierre_valvula_aspiracion: checkItemSchema,
    comprobar_apertura_cierre_valvula_descarga: checkItemSchema
  },

  moto_bomba: {
    verificar_estado_fisico_bomba: checkItemSchema,
    abrir_cerrar_valvula_aspiracion:checkItemSchema,
    observo_puntos_oxidacion_corrigio: checkItemSchema,
    abrir_cerrar_valvula_descarga: checkItemSchema
  },

  tracing: {
    tracing_energizados: checkItemSchema,
    tracing_recubiertos:checkItemSchema,
    tracing_cubre_parte_critica_cañeria: checkItemSchema,
    tracing_posee_temp: checkItemSchema,
    tracing_se_encuentra_recubierto: checkItemSchema
  },

  orden_limpieza: {
    realizo_orden_limpieza_sala: checkItemSchema,
    realizo_eliminacion_obstaculos:checkItemSchema
  },
}, { _id: false });

const sbmp_005Schema = new mongoose.Schema({
  id_tarea: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Tarea", 
    required: true 
  },
  codigo_formulario: { type: String, default: "SBMP-005" },
  nombre_formulario: { type: String, default: "SALAS DE BOMBAS" },
  
  fecha_inspeccion: { type: Date, default: Date.now },

  
  checklist: [salaBombasInspeccionSchema],


  comentarios: { type: String },


  imagenes: [{
    url: { type: String },
    nombre_imagen: { type: String },
    fecha_subida: { type: Date, default: Date.now },
    tamaño: { type: Number },
    tipo_mime: { type: String },
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

export const sbmp_005Model = mongoose.model("sbmp_005", sbmp_005Schema);