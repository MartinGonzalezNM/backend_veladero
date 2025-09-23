import { bucket } from "../../config/firebaseAdmin.js";
import { v4 as uuidv4 } from 'uuid';

export const imageService = {
  async subirImagen(base64Imagen, nombreOriginal = 'imagen.jpg', carpeta) {
    try {
      // Extraer el tipo de imagen y convertir base64 a buffer
      const matches = base64Imagen.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!matches) {
        throw new Error('Formato de imagen base64 inválido');
      }
      
      const extension = matches[1]; // jpg, png, etc.
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");
      
      // Generar nombre único para el archivo
      const nombreUnico = `${carpeta}/${uuidv4()}.${extension}`;
      
      // Crear archivo en Firebase Storage
      const file = bucket.file(nombreUnico);
      
      await file.save(buffer, {
        metadata: {
          contentType: `image/${extension}`,
          metadata: {
            originalName: nombreOriginal,
            uploadedAt: new Date().toISOString(),
            uploadedBy: "prueba-system"
          }
        },
        public: true,
        validation: "md5",
      });

      await file.makePublic();

      // Pequeña pausa para Firebase
      await new Promise(resolve => setTimeout(resolve, 500));

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${nombreUnico}`;

      return {
        url: publicUrl,
        nombre_archivo: nombreUnico,
        tamaño: buffer.length,
        tipo_mime: `image/${extension}`
      };
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      throw new Error(`Error al subir imagen: ${error.message}`);
    }
  },

  async eliminarImagen(nombreArchivo) {
    try {
      const file = bucket.file(nombreArchivo);
      await file.delete();
      return true;
    } catch (error) {
      console.error('Error eliminando imagen:', error);
      // No lanzamos error porque puede ser que el archivo ya no exista
      return false;
    }
  }
};