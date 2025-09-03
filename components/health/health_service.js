// services/health_service.js
// import { HealthCheckModel } from "../models/health_model.js"; // Si decides usar el modelo

export const HealthService = {
  async checkHealth() {
    // Aquí puedes agregar verificaciones adicionales:
    // - Estado de la base de datos
    // - Estado de otros microservicios
    // - Uso de memoria, etc.
    
    const healthStatus = {
      status: 'OK',
      message: 'Servidor funcionando correctamente',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      // database: await this.checkDatabaseStatus(), // Si quieres verificar BD
    };

    // Opcional: guardar en BD el health check
    // await HealthCheckModel.create(healthStatus);

    return healthStatus;
  },

  async checkDatabaseStatus() {
    try {
      // Verificar conexión a MongoDB
      const { readyState } = mongoose.connection;
      return readyState === 1 ? 'connected' : 'disconnected';
    } catch (error) {
      return 'error';
    }
  }
};