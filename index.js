
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";


// Importar rutas
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
import itemRoutes fr

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
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
app.use("/api/health", healthRoutes);


// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ Conectado a MongoDB Atlas");
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${process.env.PORT}`);
  });
})
.catch((err) => {
  console.error("❌ Error al conectar con MongoDB:", err.message);
});
