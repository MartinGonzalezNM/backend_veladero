// services/prueba_service.js
import { pruebaModel } from "./prueba_model.js";

export const pruebaService = {
  async crearPrueba(data) {
    try {
      console.log("Datos recibidos para crear prueba:", data);  
      const nuevoRegistro = new pruebaModel(data);
      return await nuevoRegistro.save();
    } catch (error) {
      console.error("Error en crearPrueba:", error);
      throw new Error(`Error creando prueba: ${error.message}`);
    }
  },

  async obtenerTodos() {
    try {
      return await pruebaModel.find()
        .populate('id_tarea')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error("Error en obtenerTodos:", error);
      throw new Error(`Error obteniendo registros: ${error.message}`);
    }
  },

  async obtenerPorId(id) {
    try {
      return await pruebaModel.findById(id).populate('id_tarea');
    } catch (error) {
      console.error("Error en obtenerPorId:", error);
      throw new Error(`Error obteniendo registro: ${error.message}`);
    }
  },

  async obtenerPorTarea(id_tarea) {
    try {
      return await pruebaModel.find({ id_tarea })
        .populate('id_tarea')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error("Error en obtenerPorTarea:", error);
      throw new Error(`Error obteniendo registros por tarea: ${error.message}`);
    }
  },

  async obtenerPorFiltros(filtros) {
    try {
      const query = {};
      
      // Filtro por fecha
      if (filtros.fecha_desde || filtros.fecha_hasta) {
        query.fecha_inspeccion = {};
        if (filtros.fecha_desde) {
          query.fecha_inspeccion.$gte = new Date(filtros.fecha_desde);
        }
        if (filtros.fecha_hasta) {
          query.fecha_inspeccion.$lte = new Date(filtros.fecha_hasta);
        }
      }
      
      // Filtro por tarea
      if (filtros.id_tarea) {
        query.id_tarea = filtros.id_tarea;
      }
      
      // Filtros de checklist
      if (filtros.red_seca) {
        query['checklist.red_seca'] = filtros.red_seca;
      }
      
      if (filtros.red_humeda) {
        query['checklist.red_humeda'] = filtros.red_humeda;
      }
      
      // Filtro por comentario (búsqueda de texto)
      if (filtros.comentario) {
        query.comentario = { $regex: filtros.comentario, $options: 'i' };
      }
      
      return await pruebaModel.find(query)
        .populate('id_tarea')
        .sort({ createdAt: -1 });
        
    } catch (error) {
      console.error("Error en obtenerPorFiltros:", error);
      throw new Error(`Error aplicando filtros: ${error.message}`);
    }
  },

  async actualizar(id, data) {
    try {
      // Reestructurar datos si vienen del formulario
      if (data.red_seca || data.red_humeda) {
        data.checklist = {
          red_seca: data.red_seca,
          red_humeda: data.red_humeda
        };
        delete data.red_seca;
        delete data.red_humeda;
      }
      
      if (data.firma_supervisor || data.firma_supervisor_area || data.firma_brigada) {
        data.firmas = {
          supervisor: data.firma_supervisor,
          supervisor_area: data.firma_supervisor_area,
          brigada: data.firma_brigada
        };
        delete data.firma_supervisor;
        delete data.firma_supervisor_area;
        delete data.firma_brigada;
      }
      
      return await pruebaModel.findByIdAndUpdate(
        id, 
        data, 
        { new: true, runValidators: true }
      ).populate('id_tarea');
    } catch (error) {
      console.error("Error en actualizar:", error);
      throw new Error(`Error actualizando registro: ${error.message}`);
    }
  },

  async eliminar(id) {
    try {
      return await pruebaModel.findByIdAndDelete(id);
    } catch (error) {
      console.error("Error en eliminar:", error);
      throw new Error(`Error eliminando registro: ${error.message}`);
    }
  },

  async eliminarPorTarea(id_tarea) {
    try {
      return await pruebaModel.deleteMany({ id_tarea });
    } catch (error) {
      console.error("Error en eliminarPorTarea:", error);
      throw new Error(`Error eliminando registros por tarea: ${error.message}`);
    }
  }
};