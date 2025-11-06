import mongoose from "mongoose";


const checkItemSchema = new mongoose.Schema(
  {
    estado: {
      type: String,
      enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"],
      default: "N/A"
    }
  },
  { _id: false }
);

const pinRackInspeccionSchema = new mongoose.Schema(
  {
    numero_pin_rack: { type: String, required: true }, // 

    // SECCIÓN: GABINETE
    gabinete: {
      señalizacion: checkItemSchema,
      vidrio: checkItemSchema,
      llave_apriete_manguera: checkItemSchema,
      apertura_cierre_normal_puerta: checkItemSchema,
      lubricacion_bisagras_cerraduras: checkItemSchema,
      observo_puntos_oxidacion_corrigio: checkItemSchema,
      limpieza_gabinete_vidrios: checkItemSchema,
      limpieza_eliminacion_obstaculo: checkItemSchema,
      reparo_cambio_gabinete: checkItemSchema,
      lanza: checkItemSchema,
      chiflon: checkItemSchema
    },

    // SECCIÓN: MANGUERAS Y LÍNEAS/FIERROS
    mangueras_dimension: {
      manguera: checkItemSchema,
      tipo_racorado: checkItemSchema,
      tendido_manguera_racorado: checkItemSchema,
      estado_roscas_uniones: checkItemSchema,
      descontaminacion_polvo_limpieza_lanza_chiflon: checkItemSchema,
      diametro_manguera: checkItemSchema,
      acopla_manguera_valvula_teatro: checkItemSchema,
      acopla_manguera_lanza: checkItemSchema,
      reemplazo_manguera: checkItemSchema,
      manguera_tela_goma: checkItemSchema,
      longitud_manguera: checkItemSchema
    },

    // SECCIÓN: HIDRANTE
    pin_racks_valvulas_teatro_dimensiones: {
      observo_puntos_oxidacion_corrigio: checkItemSchema,
      limpieza_pin_racks: checkItemSchema,
      limpieza_roscas_uniones: checkItemSchema,
      recorrido_mecanismo_apertura_cierre_valvulas: checkItemSchema,
      lubricacion_partes_moviles: checkItemSchema,
      reemplazo_asiento_valvula: checkItemSchema,
      diametro_valvula_ingreso: checkItemSchema,
      diametro_valvula_salida: checkItemSchema
    }
  },
  { _id: false }
);

const empmp_002Schema = new mongoose.Schema(
  {
    id_tarea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tarea",
      required: true
    },

    codigo_formulario: {
      type: String,
      default: "EMPMP-002"
    },

    nombre_formulario: {
      type: String,
      default: "ESTACIÓN DE MANGUERAS (PIN RACKS)"
    },

    fecha_inspeccion: { type: Date, default: Date.now },

    // ARRAY de hidrantes inspeccionados
    pinRacks: [pinRackInspeccionSchema],

    // Comentarios generales
    comentarios: { type: String },


    imagenes: [
      {
        url: { type: String },
        nombre_imagen: { type: String },
        fecha_subida: { type: Date, default: Date.now },
        tamaño: { type: Number },
        tipo_mime: { type: String },
        numero_hidrante: { type: String } 
      }
    ],

    observaciones: {
      type: String,
      enum: ["SI", "NO"]
    },

    observaciones_generales: { type: String },
    observacion_leida: { type: Boolean, default: false },

    firmas: {
      supervisor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
      supervisor_area: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
      brigada: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }
    }
  },
  {
    timestamps: true
  }
);

export const empmp_002Model = mongoose.model("empmp_002", empmp_002Schema);
