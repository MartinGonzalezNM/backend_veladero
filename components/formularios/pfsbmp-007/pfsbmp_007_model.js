import mongoose from "mongoose";

const checkItemSchema = new mongoose.Schema({
  estado: { 
    type: String, 
    enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"],
    default: "N/A"
  }
}, { _id: false });

const pfsbmp_007Schema = new mongoose.Schema({
  id_tarea: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Tarea", 
    required: true 
  },
  codigo_formulario: { type: String, default: "PFSBMP-007" },
  nombre_formulario: { type: String, default: "PRUEBA FUNCIONAL DE SISTEMA DE BOMBAS" },
  
  checklist:{

    // ==================== MOTO BOMBA (13 campos) ====================
    mb_prueba_funcional_con_flujo: checkItemSchema,
    mb_prueba_funcional_en_vacio: checkItemSchema,
    mb_lectura_presion_manometro_aspiracion: checkItemSchema,
    mb_lectura_presion_manometro_impulsion: checkItemSchema,
    mb_comprobar_ruidos_vibraciones_inusuales: checkItemSchema,
    mb_empaquetaduras_cojinetes_cuerpo_bomba_detecta_sobrecalentamiento: checkItemSchema,
    mb_anotar_presion_arranque_bomba: checkItemSchema,
    mb_anotar_tiempo_funcionamiento_bomba: checkItemSchema,
    mb_parada_emergencia_esta_instalado: checkItemSchema,
    mb_controlo_fugas_en_escape: checkItemSchema,
    mb_valvulas_quedan_abiertas: checkItemSchema,
    mb_valvula_anti_retorno_esta_instalada: checkItemSchema,
    
    // ==================== ELECTROBOMBA (13 campos) ====================
    eb_prueba_funcional_con_flujo: checkItemSchema,
    eb_prueba_funcional_en_vacio: checkItemSchema,
    eb_lectura_presion_manometro_aspiracion: checkItemSchema,
    eb_lectura_presion_manometro_impulsion: checkItemSchema,
    eb_comprobar_ruidos_vibraciones_inusuales: checkItemSchema,
    eb_empaquetaduras_cojinetes_cuerpo_bomba_detecta_sobrecalentamiento: checkItemSchema,
    eb_anotar_presion_arranque_bomba: checkItemSchema,
    eb_anotar_tiempo_funcionamiento_bomba: checkItemSchema,
    eb_parada_emergencia_esta_instalado: checkItemSchema,
    eb_arranque_suave_bomba_esta_instalado: checkItemSchema,
    eb_valvulas_quedan_abiertas: checkItemSchema,
    eb_valvula_anti_retorno_esta_instalada: checkItemSchema,
    
    // ==================== BOMBA JOCKEY (8 campos) ====================
    bj_comprobar_ruidos_vibraciones_inusuales: checkItemSchema,
    bj_empaquetaduras_cojinetes_cuerpo_bomba_detecta_sobrecalentamiento: checkItemSchema,
    bj_anotar_presion_arranque_bomba: checkItemSchema,
    bj_anotar_presion_corte_bomba: checkItemSchema,
    bj_parada_emergencia_esta_instalado: checkItemSchema,
    bj_valvulas_quedan_abiertas: checkItemSchema,
    bj_valvula_anti_retorno_esta_instalada: checkItemSchema,
  },
  
  //sector: { type: String },
  fecha_inspeccion: { type: Date, default: Date.now },
  //nombre_firma_tecnico: { type: String },

  // Comentarios generales
  comentarios: { type: String },

  imagen:{
    url: { type: String },
    nombre_imagen: { type: String },
    fecha_subida: { type: Date, default: Date.now },
    tamaño: { type: Number },
    tipo_mime: { type: String },
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

export const pfsbmp_007Model = mongoose.model("pfsbmp_007", pfsbmp_007Schema);