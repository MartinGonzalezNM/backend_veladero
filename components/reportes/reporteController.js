import ExcelJS from 'exceljs';
import { obtenerTareasParaReporte } from '../tarea/tarea_service.js';
import { obtenerImprevistosParaReporte } from '../formularios/imprevisto/imprevisto_service.js';


export const generarReporteExcel = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ 
        error: 'Se requieren las fechas de inicio y fin' 
      });
    }

    console.log('Generando reporte del', fechaInicio, 'al', fechaFin);

    // Obtener tareas e imprevistos
    const [tareas, imprevistos] = await Promise.all([
      obtenerTareasParaReporte(fechaInicio, fechaFin),
      obtenerImprevistosParaReporte(fechaInicio, fechaFin)
    ]);

    console.log('Tareas encontradas:', tareas.length);
    console.log('Imprevistos encontrados:', imprevistos.length);

    // Crear workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Actividades');

    // Configurar columnas
    worksheet.columns = [
      { header: 'SEMANA', key: 'semana', width: 10 },
      { header: 'AÑO', key: 'anio', width: 10 },
      { header: 'MES', key: 'mes', width: 12 },
      { header: 'FECHA', key: 'fecha', width: 12 },
      { header: 'TIPO', key: 'tipo', width: 15 },
      { header: 'SECTOR', key: 'sector', width: 30 },
      { header: 'DESCRIPCION', key: 'descripcion', width: 50 },
      { header: 'OT', key: 'ot', width: 12 },
      { header: 'H/H', key: 'hh', width: 10 }
    ];

    // Estilo para encabezados
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).alignment = { 
      vertical: 'middle', 
      horizontal: 'center' 
    };

    // Función auxiliar para obtener número de semana
    const obtenerNumeroSemana = (fecha) => {
      const date = new Date(fecha);
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };

    // Función auxiliar para formatear fecha
    const formatearFecha = (fecha) => {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    // Función auxiliar para obtener mes en español
    const obtenerMes = (fecha) => {
      const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];
      return meses[new Date(fecha).getMonth()];
    };

    // Agregar tareas al Excel
    tareas.forEach(tarea => {
      const fecha = new Date(tarea.id_fecha_estimada_plan);
      
      worksheet.addRow({
        semana: obtenerNumeroSemana(fecha),
        anio: fecha.getFullYear(),
        mes: obtenerMes(fecha),
        fecha: formatearFecha(fecha),
        tipo: 'PROGRAMADO',
        sector: tarea.id_sector?.nombre_sector || 'N/A',
        descripcion: tarea.id_descripcion?.nombre_descripcion || 'N/A',
        ot: tarea.id_item || '',
        hh: tarea.id_hh || ''
      });
    });

    // Agregar imprevistos al Excel
    imprevistos.forEach(imprevisto => {
      const fecha = new Date(imprevisto.fecha_inspeccion);
      
      worksheet.addRow({
        semana: obtenerNumeroSemana(fecha),
        anio: fecha.getFullYear(),
        mes: obtenerMes(fecha),
        fecha: formatearFecha(fecha),
        tipo: imprevisto.tipo.toUpperCase(),
        sector: imprevisto.ubicacion || 'N/A',
        descripcion: `${imprevisto.sistema_afectado} - ${imprevisto.componente_afectado}`,
        ot: imprevisto.codigo_formulario || '',
        hh: imprevisto.hh || ''
      });
    });

    // Aplicar bordes a todas las celdas con datos
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Configurar respuesta
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reporte_${fechaInicio}_${fechaFin}.xlsx`
    );

    // Enviar archivo
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error al generar reporte:', error);
    res.status(500).json({ 
      error: 'Error al generar el reporte',
      detalle: error.message 
    });
  }
};
