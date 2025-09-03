// routes/health_routes.js
import { Router } from "express";
import { HealthController } from "./health_controller.js";


const router = Router();

// Health check completo
router.get("/", HealthController.checkHealth);

// Health check simple (solo status)
router.get("/simple", HealthController.simpleCheck);

export default router;