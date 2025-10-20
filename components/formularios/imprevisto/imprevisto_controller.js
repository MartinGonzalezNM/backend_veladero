import { imprevistoService } from "./imprevisto_service.js";
import { imageService } from "../imagenes/imageService.js";

export const imprevistoController = {
  async crear(req, res) {
    try {
      let datosFormulario = req.body;
      
      // Si hay imagen en base64, procesarla
      if (req.body.imagen_base64) {
        console.log('Procesando imagen...');
        
        const imagenData = await imageService.subirImagen(
          req.body.imagen_base64,
          req.body.nombre_imagen || 'imagen.jpg',
          prueba
        );
        
        datosFormulario.imagen = {
          url: imagenData.url,
          nombre_archivo: imagenData.nombre_archivo,
          tamaño: imagenData.tamaño,
          tipo_mime: imagenData.tipo_mime
        };
        
        // Limpiar el base64 del objeto (no guardarlo en BD)
        delete datosFormulario.imagen_base64;
        delete datosFormulario.nombre_imagen;
      }
      
      const registro = await imprevistoService.crearImprevisto(datosFormulario);
      res.status(201).json(registro);
    } catch (error) {
      console.error('Error en crear:', error);
      res.status(400).json({ error: error.message });
    }
  },

  async obtenerTodos(req, res) {
    try {
      const registros = await imprevistoService.obtenerTodos();
      res.json(registros);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const registro = await imprevistoService.obtenerPorId(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      let datosActualizacion = req.body;
      
      // Si hay nueva imagen en base64, procesarla
      if (req.body.imagen_base64) {
        console.log('Procesando imagen nueva...');
        
        // Obtener registro actual para eliminar imagen anterior si existe
        const registroActual = await pruebaService.obtenerPorId(req.params.id);
        if (registroActual?.imagen?.nombre_archivo) {
          await imageService.eliminarImagen(registroActual.imagen.nombre_archivo);
        }
        
        const imagenData = await imageService.subirImagen(
          req.body.imagen_base64,
          req.body.nombre_imagen || 'imagen.jpg'
        );
        
        datosActualizacion.imagen = {
          url: imagenData.url,
          nombre_archivo: imagenData.nombre_archivo,
          tamaño: imagenData.tamaño,
          tipo_mime: imagenData.tipo_mime
        };
        
        // Limpiar el base64 del objeto
        delete datosActualizacion.imagen_base64;
        delete datosActualizacion.nombre_imagen;
      }
      
      const registro = await imprevistoService.actualizar(req.params.id, datosActualizacion);
      if (!registro) return res.status(404).json({ error: "Registro no encontrado" });
      res.json(registro);
    } catch (error) {
      console.error('Error en actualizar:', error);
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      // Obtener registro antes de eliminarlo para limpiar imagen
      const registro = await imprevistoService.obtenerPorId(req.params.id);
      
      if (registro?.imagen?.nombre_archivo) {
        console.log('Eliminando imagen de Firebase...');
        await imageService.eliminarImagen(registro.imagen.nombre_archivo);
      }
      
      const registroEliminado = await imprevistoService.eliminar(req.params.id);
      if (!registroEliminado) return res.status(404).json({ error: "Registro no encontrado" });
      
      res.json({ message: "Registro e imagen eliminados correctamente" });
    } catch (error) {
      console.error('Error en eliminar:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async eliminarImagen(req, res) {
    try {
      const { id } = req.params;

      const registro = await imprevistoService.obtenerPorId(id);
      if (!registro) return res.status(404).json({ error: "Registro no encontrado" });
      
      if (!registro.imagen?.nombre_archivo) {
        return res.status(404).json({ error: "No hay imagen para eliminar" });
      }
      
      // Eliminar de Firebase
      await imageService.eliminarImagen(registro.imagen.nombre_archivo);
      
      // Limpiar el campo imagen usando el service
      const registroActualizado = await imprevistoService.actualizar(id, { imagen: null });
      
      res.json({ message: "Imagen eliminada correctamente" });
    } catch (error) {
      console.error('Error eliminando imagen:', error);
      res.status(500).json({ error: error.message });
    }
  },


};