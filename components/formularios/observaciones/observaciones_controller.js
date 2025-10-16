import { ObservacionesService } from "./observaciones_service.js";

export const ObservacionesController = {
  // Obtener todas las observaciones pendientes de todos los formularios
  async obtenerTodasObservacionesPendientes(req, res) {
    try {
      const observaciones = await ObservacionesService.obtenerTodasObservacionesPendientes();
      res.json(observaciones);
    } catch (error) {
      console.error("Error al obtener observaciones pendientes:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Marcar una observación como leída
  async marcarObservacionLeida(req, res) {
    try {
      const { tipo_formulario, id } = req.params;
      
      const resultado = await ObservacionesService.marcarObservacionLeida(tipo_formulario, id);
      
      if (!resultado) {
        return res.status(404).json({ error: "Observación no encontrada" });
      }
      
      res.json({ 
        message: "Observación marcada como leída correctamente",
        registro: resultado 
      });
    } catch (error) {
      console.error("Error al marcar observación como leída:", error);
      res.status(400).json({ error: error.message });
    }
  },

  // Obtener el conteo de observaciones pendientes (opcional, útil para dashboards)
  async obtenerConteoObservacionesPendientes(req, res) {
    try {
      const conteo = await ObservacionesService.obtenerConteoObservacionesPendientes();
      res.json(conteo);
    } catch (error) {
      console.error("Error al obtener conteo de observaciones:", error);
      res.status(500).json({ error: error.message });
    }
  }
};