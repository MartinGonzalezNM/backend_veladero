import mongoose from "mongoose";

const checkItemSchema = new mongoose.Schema({
  estado: { 
    type: String, 
    enum: ["SI", "NO", "N/A", "OP", "NOP", "OB"],
    default: "N/A"
  }
}, { _id: false });

const lineaSchema = new mongoose.Schema({

  nombre:{type:String},
  drenaje: {type:checkItemSchema},
  recirculacion: {type:checkItemSchema},
  presurizacion: {type:checkItemSchema},
  corrigio: {type:checkItemSchema}

}, { _id: false });

const lcmp_006Schema = new mongoose.Schema({
  id_tarea: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Tarea", 
    required: true 
  },
  codigo_formulario: { type: String, default: "LCMP-006" },
  nombre_formulario: { type: String, default: "LAVADO DE CAÑERIAS Y RECIRCULACION DE AGUA" },
  
  fecha_inspeccion: { type: Date, default: Date.now },

  
  checklist: [lineaSchema],


  comentarios: { type: String },


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
  }

}, {
  timestamps: true
});

export const lcmp_006Model = mongoose.model("lcmp_006", lcmp_006Schema);