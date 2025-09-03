// controllers/health_controller.js
import { HealthService } from "./health_service.js";

export const HealthController = {
  async checkHealth(req, res) {
    try {
      const healthStatus = await HealthService.checkHealth();
      res.status(200).json(healthStatus);
    } catch (error) {
      res.status(500).json({ 
        status: 'ERROR', 
        message: 'Error en el servidor',
        timestamp: new Date().toISOString(),
        error: error.message 
      });
    }
  },

  // Opcional: endpoint más simple para solo verificar estado
  async simpleCheck(req, res) {
    res.status(200).json({ status: 'OK' });
  }
};