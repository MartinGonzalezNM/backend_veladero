// controllers/prueba_controller.js
import { pruebaService } from "./prueba_service.js";
import { imagenService, upload } from "../../services/imagenService.js";

export const pruebaController = {
  async crear(req, res) {
    try {
      console.log("Datos recibidos:", req.body);
      console.log("Archivos recibidos:", req.files);
      console.log("Archivo único recibido:", req.file);
      
      let datosFormulario = { ...req.body };
      
      // Manejar la imagen de firma si existe
      if (req.file) {
        try {
          console.log("Procesando archivo:", req.file);
          console.log("Nombre original:", req.file.originalname);
          console.log("Tipo MIME:", req.file.mimetype);
          console.log("Tamaño:", req.file.size);
          
          // Validar la imagen
          imagenService.validarImagen(req.file);
          
          // Subir imagen a Firebase
          const urlImagen = await imagenService.subirImagen(
            req.file.buffer, 
            req.file.originalname, 
            'formularios/firmas', 
            req.body.id_tarea
          );
          
          datosFormulario.firma_imagen = urlImagen;
          console.log("Imagen de firma subida correctamente:", urlImagen);
        } catch (imagenError) {
          console.error("Error procesando imagen:", imagenError);
          return res.status(400).json({ 
            success: false,
            error: `Error procesando imagen: ${imagenError.message}` 
          });
        }
      } else {
        console.log("No se recibió ningún archivo");
        // Si no hay archivo, no establecer firma_imagen o ponerla como null
        datosFormulario.firma_imagen = null;
      }
      
      // Limpiar valores vacíos y convertir a null si es necesario
      const limpiarValor = (valor) => {
        if (valor === '' || valor === 'null' || valor === 'undefined') {
          return null;
        }
        return valor;
      };
      
      // Reestructurar datos para el modelo
      const datosParaGuardar = {
        id_tarea: datosFormulario.id_tarea,
        fecha_inspeccion: datosFormulario.fecha_inspeccion,
        checklist: {
          red_seca: limpiarValor(datosFormulario.red_seca),
          red_humeda: limpiarValor(datosFormulario.red_humeda)
        },
        comentario: limpiarValor(datosFormulario.comentario),
        firma_imagen: datosFormulario.firma_imagen,
        firmas: {
          supervisor: limpiarValor(datosFormulario.firma_supervisor),
          supervisor_area: limpiarValor(datosFormulario.firma_supervisor_area),
          brigada: limpiarValor(datosFormulario.firma_brigada)
        }
      };
      
      console.log("Datos estructurados para guardar:", datosParaGuardar);
      
      const registro = await pruebaService.crearPrueba(datosParaGuardar);
      
      res.status(201).json({
        success: true,
        message: "Formulario creado exitosamente",
        data: registro,
        imagen_url: datosFormulario.firma_imagen
      });
      
    } catch (error) {
      console.error("Error en crear:", error);
      res.status(400).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  async obtenerTodos(req, res) {
    try {
      const registros = await pruebaService.obtenerTodos();
      res.json({
        success: true,
        data: registros
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const registro = await pruebaService.obtenerPorId(id);
      
      if (!registro) {
        return res.status(404).json({
          success: false,
          error: "Registro no encontrado"
        });
      }
      
      res.json({
        success: true,
        data: registro
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async obtenerPorTarea(req, res) {
    try {
      const { id_tarea } = req.params;
      const registros = await pruebaService.obtenerPorTarea(id_tarea);
      
      res.json({
        success: true,
        data: registros
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async obtenerPorFiltros(req, res) {
    try {
      const registros = await pruebaService.obtenerPorFiltros(req.query);
      
      res.json({
        success: true,
        data: registros
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      let datosActualizacion = { ...req.body };
      
      // Manejar nueva imagen si existe
      if (req.file) {
        try {
          imagenService.validarImagen(req.file);
          
          // Obtener registro actual para eliminar imagen anterior
          const registroActual = await pruebaService.obtenerPorId(id);
          
          // Subir nueva imagen
          const urlImagen = await imagenService.subirImagen(
            req.file.buffer, 
            req.file.originalname, 
            'formularios/firmas', 
            req.body.id_tarea
          );
          
          datosActualizacion.firma_imagen = urlImagen;
          
          // Eliminar imagen anterior si existe
          if (registroActual?.firma_imagen) {
            try {
              await imagenService.eliminarImagen(registroActual.firma_imagen);
            } catch (eliminarError) {
              console.log("No se pudo eliminar imagen anterior:", eliminarError.message);
            }
          }
          
        } catch (imagenError) {
          return res.status(400).json({ 
            success: false,
            error: `Error procesando imagen: ${imagenError.message}` 
          });
        }
      }
      
      const registroActualizado = await pruebaService.actualizar(id, datosActualizacion);
      
      if (!registroActualizado) {
        return res.status(404).json({
          success: false,
          error: "Registro no encontrado"
        });
      }
      
      res.json({
        success: true,
        message: "Registro actualizado exitosamente",
        data: registroActualizado
      });
      
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      
      // Obtener registro para eliminar imagen asociada
      const registro = await pruebaService.obtenerPorId(id);
      
      if (!registro) {
        return res.status(404).json({
          success: false,
          error: "Registro no encontrado"
        });
      }
      
      // Eliminar imagen si existe
      if (registro.firma_imagen) {
        try {
          await imagenService.eliminarImagen(registro.firma_imagen);
        } catch (imagenError) {
          console.log("No se pudo eliminar imagen:", imagenError.message);
        }
      }
      
      await pruebaService.eliminar(id);
      
      res.json({
        success: true,
        message: "Registro eliminado exitosamente"
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};