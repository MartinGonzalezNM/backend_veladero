import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { corsOptions } from "./cors.js";

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

// Nueva ruta de firma
//import firmaRoutes from "./components/firma/firma_Routes.js";

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

// Rutas
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
app.use("/api/formulario/csevr-001", csevr_001Routes);
app.use("/api/formulario/sdscmp-008", sdscmp_008Routes);
app.use("/api/formulario/prueba", pruebaRoutes);
app.use("/api/formulario/imprevisto", imprevistoRoutes);

//observaciones
app.use("/api/observaciones", observacionesRoutes);


// Nueva ruta de firma
//app.use("/api/firma", firmaRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
})
.then(() => {
  console.log("✅ Conectado a MongoDB Atlas");
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${process.env.PORT}`);
  });
  
  app.on('error', (err) => {
    console.error("❌ Error en el servidor:", err.message);
  });

  app.get('/', (req, res) => {
    res.send('API is running...');
  });

  // Agrega este endpoint a tu API para ver la IP del servidor
  app.get('/api/ip', (req, res) => {
    const serverIp = req.socket.localAddress;
    const clientIp = req.ip || req.connection.remoteAddress;
    res.json({ 
      serverIp, 
      clientIp,
      headers: req.headers 
    });
  });

})
.catch((err) => {
  console.error("❌ Error al conectar con MongoDB:", err.message);
});
