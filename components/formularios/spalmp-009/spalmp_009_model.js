import mongoose from "mongoose";

//ENUM de items
const panelSchema = new mongoose.Schema(
  {
    estado: {
      type: String,
      enum: ["INTELIGENTE", "CONVENCIONAL"],
      default: "N/A"
    }
  },
  { _id: false }
);

const deteccionSchema = new mongoose.Schema(
  {
    estado: {
      type: String,
      enum: ["FOTOELECTRICO", "IONICO"],
      default: "N/A"
    }
  },
  { _id: false }
);

const activacionSchema = new mongoose.Schema(
  {
    estado: {
      type: String,
      enum: ["INICIADOR", "SOLENOIDE"],
      default: "N/A"
    }
  },
  { _id: false }
);


//////////////////////////////////////modelo//////////////

const cilindrosSchema = new mongoose.Schema(
  {
      id_cilindro:{type:String, _id:true},
      cilindro: {type:String},
      ubicacion: {type:String},
      numero_serie: {type:String},
      fecha_prueba_hidraulica: {type:String},
      carro: {type:String},
      valvula: {type:String},
      tubo_vacio: {type:String},
      carga: {type:String},
      psi: {type:String},
      testigo: {type:String},
      observacion: {type:String},
  },
  { _id: false }
);

const spalmp_009Schema = new mongoose.Schema(
  {
    id_tarea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tarea",
      required: true
    },

    codigo_formulario: {
      type: String,
      default: "SPALMP-009"
    },

    nombre_formulario: {
      type: String,
      default: "SISTEMA DE PROTECCION CON AGENTE LIMPIO"
    },

    fecha_inspeccion: { type: Date, default: Date.now },



    panel_control:panelSchema,
    panel_marca:{type:String},
    tipo_deteccion:deteccionSchema,
    temperatura_puntual:{type:String},
    tipo_activacion:activacionSchema,
    otro_tipo_activacion:{type:String},


    // ARRAY de cilindros
    cilindros: [cilindrosSchema],


    canalizacion_dispositivos: {
      estado_cajas_paso_montaje:{type:String},
      estado_montaje_limpieza:{type:String},
      verificar_dispositivo_descarga:{type:String},
      estado_general_limpieza_gabinete:{type:String},
      estado_uniones_boquillas:{type:String},
      soporte_fijacion_canalizacion:{type:String},
      estado_fisico_operacional_cilindro:{type:String},
      estado_funcionamiento_manometro:{type:String},
    },

    // Comentarios generales
    comentarios: { type: String },


    imagen: [
      {
        url: { type: String },
        nombre_imagen: { type: String },
        fecha_subida: { type: Date, default: Date.now },
        tamaño: { type: Number },
        tipo_mime: { type: String },
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

export const spalmp_009Model = mongoose.model("spalmp_009", spalmp_009Schema);
