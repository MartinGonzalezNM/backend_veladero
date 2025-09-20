// routes.js - Configuración mejorada de multer
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Router } from "express";
import { pruebaController } from "./prueba_controller.js";

// Asegúrate de que el directorio de uploads existe
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generar un nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'firma-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de 5MB
  },
  fileFilter: function (req, file, cb) {
    // Aceptar solo imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'), false);
    }
  }
});

// Manejo de errores de multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'El archivo es demasiado grande' });
    }
  }
  next(error);
};


const router = Router();

router.post('/', upload.single('firma_imagen'), pruebaController.crear);
router.get("/", pruebaController.obtenerTodos);
router.get("/filtros", pruebaController.obtenerPorFiltros);
router.get("/tarea/:id_tarea", pruebaController.obtenerPorTarea);
router.get("/:id", pruebaController.obtenerPorId);
router.put("/:id", pruebaController.actualizar);
router.delete("/:id", pruebaController.eliminar);

export default router;