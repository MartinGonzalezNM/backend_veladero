import { imageService } from "./imageService.js";

/**
 * Procesa y sube una imagen en base64 si está presente en el body
 * @param {Object} datosFormulario - Datos del formulario (req.body)
 * @param {string} carpeta - Nombre de la carpeta donde guardar la imagen
 * @returns {Object} Datos del formulario procesados
 */
export async function procesarImagenBase64(datosFormulario, carpeta) {
  if (!datosFormulario.imagen_base64) {
    return datosFormulario;
  }

  console.log('Procesando imagen...');
  
  const imagenData = await imageService.subirImagen(
    datosFormulario.imagen_base64,
    datosFormulario.nombre_imagen || 'imagen.jpg',
    carpeta
  );
  
  datosFormulario.imagen = {
    url: imagenData.url,
    nombre_imagen: imagenData.nombre_imagen,
    tamaño: imagenData.tamaño,
    tipo_mime: imagenData.tipo_mime
  };
  
  // Limpiar el base64 del objeto (no guardarlo en BD)
  delete datosFormulario.imagen_base64;
  delete datosFormulario.nombre_imagen;
  
  return datosFormulario;
}