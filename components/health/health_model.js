// models/health_model.js
// Para health check normalmente no se necesita un modelo, pero si quieres trackear estados:
import mongoose from "mongoose";

const HealthCheckSchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  responseTime: { type: Number }, // tiempo de respuesta en ms
  service: { type: String } // nombre del servicio verificado
});

export const HealthCheckModel = mongoose.model("HealthCheck", HealthCheckSchema);