// services/imagenService.js
import { bucket } from "../config/firebaseAdmin.js";
import multer from "multer";
import path from "path";

// Configuración de multer para manejar archivos en memoria
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB límite
  },
  fileFilter: (req, file, cb) => {
    // Solo permitir imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

export const imagenService = {
  /**
   * Sube una imagen a Firebase Storage
   * @param {Buffer} buffer - Buffer de la imagen
   * @param {string} originalName - Nombre original del archivo
   * @param {string} carpeta - Carpeta donde guardar (ej: 'formularios', 'firmas')
   * @param {string} idTarea - ID de la tarea para organizar archivos
   * @returns {Promise<string>} URL pública de la imagen
   */
  async subirImagen(buffer, originalName, carpeta = 'formularios', idTarea = '') {
    try {
      // Generar nombre único para el archivo
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const extension = path.extname(originalName);
      const nombreArchivo = `${carpeta}/${idTarea ? idTarea + '/' : ''}${timestamp}${extension}`;

      const file = bucket.file(nombreArchivo);

      // Detectar tipo de contenido basado en la extensión
      const contentType = this.getContentType(extension);

      await file.save(buffer, {
        metadata: {
          contentType: contentType,
          metadata: {
            uploadedAt: new Date().toISOString(),
            uploadedBy: "formulario-system",
            originalName: originalName,
            idTarea: idTarea
          }
        },
        public: true,
        validation: "md5",
      });

      await file.makePublic();

      // Pequeña pausa para Firebase
      await new Promise(resolve => setTimeout(resolve, 500));

      return `https://storage.googleapis.com/${bucket.name}/${nombreArchivo}`;
    } catch (error) {
      console.error("Error subiendo imagen a Firebase:", error);
      throw new Error(`Error subiendo imagen a Firebase: ${error.message}`);
    }
  },

  /**
   * Sube múltiples imágenes
   * @param {Array} files - Array de archivos de multer
   * @param {string} carpeta - Carpeta donde guardar
   * @param {string} idTarea - ID de la tarea
   * @returns {Promise<Array<string>>} Array de URLs públicas
   */
  async subirMultiplesImagenes(files, carpeta = 'formularios', idTarea = '') {
    try {
      const promesas = files.map(file => 
        this.subirImagen(file.buffer, file.originalname, carpeta, idTarea)
      );
      
      return await Promise.all(promesas);
    } catch (error) {
      console.error("Error subiendo múltiples imágenes:", error);
      throw new Error("Error subiendo múltiples imágenes a Firebase");
    }
  },

  /**
   * Elimina una imagen de Firebase Storage
   * @param {string} url - URL de la imagen a eliminar
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  async eliminarImagen(url) {
    try {
      // Extraer el nombre del archivo de la URL
      const baseUrl = `https://storage.googleapis.com/${bucket.name}/`;
      if (!url.startsWith(baseUrl)) {
        throw new Error("URL no válida para este bucket");
      }
      
      const nombreArchivo = url.replace(baseUrl, '');
      const file = bucket.file(nombreArchivo);
      
      await file.delete();
      console.log(`Imagen eliminada: ${nombreArchivo}`);
      return true;
    } catch (error) {
      console.error("Error eliminando imagen:", error);
      // No lanzar error si el archivo no existe
      if (error.code === 404) {
        console.log("El archivo ya no existe");
        return true;
      }
      throw new Error(`Error eliminando imagen: ${error.message}`);
    }
  },

  /**
   * Obtiene el tipo de contenido basado en la extensión
   * @param {string} extension - Extensión del archivo
   * @returns {string} Tipo MIME
   */
  getContentType(extension) {
    const tipos = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.bmp': 'image/bmp'
    };
    
    return tipos[extension.toLowerCase()] || 'image/jpeg';
  },

  /**
   * Valida que el archivo sea una imagen válida
   * @param {Object} file - Archivo de multer
   * @returns {boolean} true si es válido
   */
  validarImagen(file) {
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const tamañoMaximo = 5 * 1024 * 1024; // 5MB
    
    if (!tiposPermitidos.includes(file.mimetype)) {
      throw new Error('Tipo de archivo no permitido. Use: JPG, PNG, GIF, WEBP');
    }
    
    if (file.size > tamañoMaximo) {
      throw new Error('El archivo es demasiado grande. Máximo 5MB');
    }
    
    return true;
  }
};