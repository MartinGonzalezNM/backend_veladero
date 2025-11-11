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

  items_a_controlar:{
    controlo_temperatura_ambiente:checkItemSchema,
    trampas_ventilacion_despejadas:checkItemSchema,
    filtraciones_agua_tuberias_eliminadas:checkItemSchema,
    señales_luminosas_tablero_mando:checkItemSchema,
    pilotos_presencia_electrica_funcionando:checkItemSchema,
    nivel_aceite_carter:checkItemSchema,
    nivel_tk_lleno:checkItemSchema,
    verifico_elimino_restos_oxidos_estado_tk:checkItemSchema,
    lectura_voltaje_baterias: checkItemSchema,
    bat_1:{type:String},
    bat_2:{type:String},
    nivel_agua_refrigeracion: checkItemSchema,
    elimino_sulfatacion_bornes_baterias: checkItemSchema,
    controlo_energizacion_cable_calefactor_normal_efectiva: checkItemSchema,
    comprobar_corregir_fugas_escape: checkItemSchema,
    comprobar_corregir_carga_baterias: checkItemSchema,
    abrio_cerro_valvulas_drenaje_quedo_cerrada: checkItemSchema,
    estado_tablero_electrico_control_normal: checkItemSchema,
    abrio_cerro_valvula_aspiracion_quedo_abierta: checkItemSchema,
    abrio_cerro_valvula_descarga_quedo_abierta: checkItemSchema,
    abrio_cerro_valvula_recirculacion_quedo_cerrada: checkItemSchema,
    arranque_bomba_jockey_normal: checkItemSchema,
    psi_arranque:{type:String},
    parada_bomba_jockey_normal:checkItemSchema,
    psi_parada:{type:String},
    estado_fisico_lectura_manometro_correcta:checkItemSchema,
    estado_fisico_valvula_aspiracion_normal:checkItemSchema,
    estado_fisico_valvula_descarga_normal:checkItemSchema,
    estado_fisico_valvula_recirculacion_normal:checkItemSchema,
    estado_valvula_alivio_normal:checkItemSchema,
    interruptor_comando_bombas_posicion_automatico:checkItemSchema,
    nivel_aceite_carter_normal:checkItemSchema,
    inspeccion_disyuntores:checkItemSchema,
    estado_fisico_manometro_normal:checkItemSchema,
    ajuste_tuercas_prensaestopas_necesario:checkItemSchema,
    red_esta_presurizada:checkItemSchema,
  }
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

export const sbmp_005Model = mongoose.model("sbmp_005", sbmp_005Schema);