import { imprevistoModel } from "./imprevisto_model.js";

export const imprevistoService = {
  async crearImprevisto(data) {
    const nuevoRegistro = new imprevistoModel(data);
    return await nuevoRegistro.save();
  },

  async obtenerTodos() {
    return await imprevistoModel.find().sort({ fecha_inspeccion: -1 });
  },

  async obtenerPorId(id) {
    return await imprevistoModel.findById(id);
  },

  async actualizar(id, data) {
    return await imprevistoModel.findByIdAndUpdate(id, data, { 
      new: true,
      runValidators: true 
    });
  },

  async eliminar(id) {
    return await imprevistoModel.findByIdAndDelete(id);
  },

 // ⭐ NUEVA FUNCIÓN PARA REPORTES
  async obtenerPorRangoFechas(fechaInicio, fechaFin) {
    try {
      const imprevistos = await imprevistoModel
        .find({
          fecha_inspeccion: {
            $gte: new Date(fechaInicio),
            $lte: new Date(fechaFin)
          }
        })
        .sort({ fecha_inspeccion: 1 });

      return imprevistos;
    } catch (error) {
      throw new Error(`Error al obtener imprevistos para reporte: ${error.message}`);
    }
  }
};

// ⭐ EXPORTACIÓN ADICIONAL (AGREGAR ESTO AL FINAL)
export const obtenerImprevistosParaReporte = async (fechaInicio, fechaFin) => {
  return await imprevistoService.obtenerPorRangoFechas(fechaInicio, fechaFin);
};