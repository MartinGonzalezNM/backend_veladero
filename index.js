import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { corsOptions } from "./cors.js";

// Importar rate limiters
import { 
  generalLimiter, 
  uploadLimiter, 
  observacionesLimiter 
} from "./middleware/rateLimiters.js";

// Importar rutas existentes
import tareaRoutes from "./components/tarea/tarea_routes.js";
import usuarioRoutes from "./components/usuario/usuario_routes.js";
import areaRoutes from "./components/area/area_routes.js";
import sectorRoutes from "./components/sector/sector_routes.js";
import empresaRoutes from "./components/empresa/empresa_routes.js";
import rolRoutes from "./components/rol/rol_routes.js";
import hhroutes from "./components/hh/hh_routes.js";
import descripcionRoutes from "./components/descripcion/descripcion_routes.js";
import itemRoutes from "./components/item/item_routes.js";
import healthRoutes from "./components/health/health_routes.js";
import csevr_001Routes from "./components/formularios/csevr-001/csevr_001_routes.js";
import sdscmp_008Routes from "./components/formularios/sdscmp-008/sdscmp_008_routes.js";
import pruebaRoutes from "./components/formularios/prueba/prueba_routes.js";
import observacionesRoutes from "./components/formularios/observaciones/observaciones_routes.js";
import imprevistoRoutes from "./components/formularios/imprevisto/imprevisto_routes.js";
import reporteRoutes from './components/reportes/reporteRoutes.js';





// Configuración de variables de entorno
dotenv.config();

const app = express();

// ========================================
// MIDDLEWARES GLOBALES
// ========================================

app.use(cors(corsOptions));

// Límite aumentado para soportar imágenes en base64
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(morgan("dev"));

// Rate limiter general para todas las rutas API
app.use('/api/', generalLimiter);

// ========================================
// RUTAS NORMALES
// ========================================

app.use("/api/tareas", tareaRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/sectores", sectorRoutes);
app.use("/api/empresas", empresaRoutes);
app.use("/api/roles", rolRoutes);
app.use("/api/hh", hhroutes);
app.use("/api/descripciones", descripcionRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/healthcheck", healthRoutes);

// ========================================
// RUTAS CON RATE LIMITING ESPECÍFICO
// ========================================

// Formularios con imágenes - Rate limiting más estricto
app.use("/api/formulario/csevr-001", uploadLimiter, csevr_001Routes);
app.use("/api/formulario/sdscmp-008", uploadLimiter, sdscmp_008Routes);
app.use("/api/formulario/prueba", uploadLimiter, pruebaRoutes);
app.use("/api/formulario/imp-01", uploadLimiter, imprevistoRoutes);

// Observaciones - Rate limiting moderado
app.use("/api/observaciones", observacionesLimiter, observacionesRoutes);

//Reportes
app.use('/api/reportes', reporteRoutes);

// ========================================
// RUTAS PÚBLICAS (fuera de /api)
// ========================================

app.get('/', (req, res) => {
  res.json({
    message: 'API Veladero - Sistema de Gestión',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/api/ip', (req, res) => {
  const serverIp = req.socket.localAddress;
  const clientIp = req.ip || req.connection.remoteAddress;
  res.json({
    serverIp,
    clientIp,
    headers: req.headers
  });
});

// ========================================
// MANEJO DE ERRORES 404
// ========================================

app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  });
});

// ========================================
// CONEXIÓN A MONGODB Y SERVIDOR
// ========================================

mongoose.connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log("✅ Conectado a MongoDB Atlas");
    
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${process.env.PORT}`);
      console.log(`📦 Límite de payload: 10MB`);
      console.log(`🛡️  Protección DDoS activada:`);
      console.log(`   - General: 200 req/15min`);
      console.log(`   - Formularios: 50 req/15min`);
      console.log(`   - Observaciones: 100 req/15min`);
    });

    app.on('error', (err) => {
      console.error("❌ Error en el servidor:", err.message);
    });
  })
  .catch((err) => {
    console.error("❌ Error al conectar con MongoDB:", err.message);
    process.exit(1); // Salir si no hay conexión a DB
  });