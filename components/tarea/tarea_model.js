import mongoose from "mongoose";

const TareaSchema = new mongoose.Schema({
  id_area: { type: mongoose.Schema.Types.ObjectId, ref: "Area", required: true },
  id_sector: { type: mongoose.Schema.Types.ObjectId, ref: "Sector", required: true },
  id_descripcion: { type: mongoose.Schema.Types.ObjectId, ref: "Descripcion", required: true },
  id_item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  id_frecuencia: { type: mongoose.Schema.Types.ObjectId, ref: "Frecuencia", required: true },
  id_hh: { type: mongoose.Schema.Types.ObjectId, ref: "HH", required: true },
  responsable: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  creada_por: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  id_fecha_estimada_plan: { type: mongoose.Schema.Types.ObjectId, ref: "FechaEstimadaPlan", required: true },
  id_plan_sap: { type: mongoose.Schema.Types.ObjectId, ref: "PlanSAP", required: true },
  ultima_modificacion: { type: Date, default: Date.now },
  estado: { 
    type: String, 
    enum: ["activa", "demorada", "cancelada", "finalizada"], 
    default: "activa" 
  },
  tiempo_transcurrido: { type: String, required: true }, // formato HH:mm:ss
  id_empresa: { type: mongoose.Schema.Types.ObjectId, ref: "Empresa", required: true }
}, {
  timestamps: true // createdAt, updatedAt automáticos
});

export const TareaModel = mongoose.model("Tarea", TareaSchema);
