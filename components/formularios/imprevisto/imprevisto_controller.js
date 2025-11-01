import { imprevistoService } from "./imprevisto_service.js";
import { imageService } from "../imagenes/imageService.js";
import { procesarImagenBase64 } from "../imagenes/imageProcessor.js";
import ExcelJS from "exceljs";

export const imprevistoController = {
  async crear(req, res) {
    try {
      let datosFormulario = req.body;
      const carpeta = 'imprevisto';

      // Procesar imagen en base64
      datosFormulario = await procesarImagenBase64(datosFormulario, carpeta);
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
        const registroActual = await imprevistoService.obtenerPorId(req.params.id);
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

  // ⭐ NUEVA FUNCIÓN PARA OBTENER IMPREVISTOS PARA REPORTE
  async obtenerParaReporte(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;

      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ 
          error: 'Se requieren las fechas de inicio y fin' 
        });
      }

      const imprevistos = await imprevistoService.obtenerPorRangoFechas(fechaInicio, fechaFin);
      
      res.json(imprevistos);
    } catch (error) {
      console.error('Error al obtener imprevistos para reporte:', error);
      res.status(500).json({ 
        error: 'Error al obtener imprevistos',
        detalle: error.message 
      });
    }
  },

  // ⭐ NUEVA FUNCIÓN PARA EXPORTAR IMPREVISTO INDIVIDUAL A EXCEL
  async exportarImprevistoExcel(req, res) {
    try {
      const { id } = req.params;
      
      const imprevisto = await imprevistoService.obtenerPorId(id);
      if (!imprevisto) {
        return res.status(404).json({ error: "Imprevisto no encontrado" });
      }

      // Crear workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Imprevisto');

      // Configurar título
      worksheet.mergeCells('A1:D1');
      const tituloCell = worksheet.getCell('A1');
      tituloCell.value = 'REPORTE DE IMPREVISTO';
      tituloCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
      tituloCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFDC3545' } // Rojo para imprevistos
      };
      tituloCell.alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.getRow(1).height = 30;

      // Información general
      let rowNum = 3;
      
      const agregarCampo = (label, value) => {
        worksheet.getCell(`A${rowNum}`).value = label;
        worksheet.getCell(`A${rowNum}`).font = { bold: true };
        worksheet.getCell(`A${rowNum}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF0F0F0' }
        };
        worksheet.mergeCells(`B${rowNum}:D${rowNum}`);
        worksheet.getCell(`B${rowNum}`).value = value || 'N/A';
        rowNum++;
      };

      agregarCampo('Código:', imprevisto.codigo_formulario);
      agregarCampo('Tipo:', imprevisto.tipo.toUpperCase());
      agregarCampo('Fecha Inspección:', new Date(imprevisto.fecha_inspeccion).toLocaleDateString('es-ES'));
      
      rowNum++; // Espacio
      
      agregarCampo('Ubicación:', imprevisto.ubicacion);
      agregarCampo('Sistema Afectado:', imprevisto.sistema_afectado);
      agregarCampo('Componente Afectado:', imprevisto.componente_afectado);
      
      rowNum++; // Espacio
      
      agregarCampo('Detalle de la Tarea:', imprevisto.detalle_tarea);
      agregarCampo('Participantes:', imprevisto.participantes);
      agregarCampo('Horas Hombre (HH):', imprevisto.hh);
      
      rowNum++; // Espacio
      
      // Firmas
      worksheet.mergeCells(`A${rowNum}:D${rowNum}`);
      worksheet.getCell(`A${rowNum}`).value = 'FIRMAS';
      worksheet.getCell(`A${rowNum}`).font = { bold: true, size: 12 };
      worksheet.getCell(`A${rowNum}`).alignment = { horizontal: 'center' };
      rowNum++;
      
      agregarCampo('Supervisor:', imprevisto.firmas?.supervisor ? 'Firmado' : 'Pendiente');
      agregarCampo('Supervisor de Área:', imprevisto.firmas?.supervisor_area ? 'Firmado' : 'Pendiente');
      agregarCampo('Brigada:', imprevisto.firmas?.brigada ? 'Firmado' : 'Pendiente');

      // Ajustar anchos de columnas
      worksheet.getColumn('A').width = 25;
      worksheet.getColumn('B').width = 20;
      worksheet.getColumn('C').width = 20;
      worksheet.getColumn('D').width = 20;

      // Aplicar bordes a todas las celdas con contenido
      for (let i = 1; i <= rowNum; i++) {
        ['A', 'B', 'C', 'D'].forEach(col => {
          const cell = worksheet.getCell(`${col}${i}`);
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      }

      // Configurar respuesta
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=imprevisto_${imprevisto.codigo_formulario}.xlsx`
      );

      // Enviar archivo
      await workbook.xlsx.write(res);
      res.end();

    } catch (error) {
      console.error('Error al exportar imprevisto a Excel:', error);
      res.status(500).json({ 
        error: 'Error al generar el archivo Excel',
        detalle: error.message 
      });
    }
  },



  // Función simplificada para exportar formulario de imprevisto a Excel
async exportarImprevistoExcel(req, res) {
  try {
    const { id } = req.params;
    
    // Obtener el imprevisto con todos los datos
    const imprevisto = await imprevistoService.obtenerPorId(id);
    
    if (!imprevisto) {
      return res.status(404).json({ error: "Formulario no encontrado" });
    }

    // Crear nuevo workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('IMP-01');

    // Configurar ancho de columnas
    worksheet.columns = [
      { width: 25 },  // Columna A
      { width: 35 },  // Columna B
      { width: 20 },  // Columna C
      { width: 20 },  // Columna D
    ];

    let currentRow = 1;
    
    // ============================================
    // ENCABEZADO
    // ============================================
    worksheet.mergeCells('A1:B2');
    const logoCell = worksheet.getCell('A1');
    logoCell.value = 'CHICONI S.R.L';
    logoCell.font = { bold: true, size: 16 };
    logoCell.alignment = { horizontal: 'center', vertical: 'middle' };
    logoCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet.mergeCells('C1:D1');
    const titleCell = worksheet.getCell('C1');
    titleCell.value = 'REPORTE DE SERVICIO';
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet.getCell('C2').value = 'N°. CERRADA';
    worksheet.getCell('C2').font = { bold: true, size: 10 };
    worksheet.getCell('C2').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('C2').border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet.getCell('D2').value = '';
    worksheet.getCell('D2').border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet.getRow(1).height = 25;
    worksheet.getRow(2).height = 20;

    currentRow = 3;

    // ============================================
    // INFORMACIÓN GENERAL
    // ============================================
    worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value = 'MANTENIMIENTO S.C.I';
    worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 10 };
    worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`A${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    worksheet.getCell(`A${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet.getCell(`C${currentRow}`).value = 'FECHA';
    worksheet.getCell(`C${currentRow}`).font = { bold: true, size: 10 };
    worksheet.getCell(`C${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`C${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    worksheet.getCell(`C${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet.getCell(`D${currentRow}`).value = 'TIPO';
    worksheet.getCell(`D${currentRow}`).font = { bold: true, size: 10 };
    worksheet.getCell(`D${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`D${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    worksheet.getCell(`D${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    currentRow++;

    // UBICACIÓN
    worksheet.getCell(`A${currentRow}`).value = 'UBICACIÓN';
    worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 9 };
    worksheet.getCell(`A${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet.getCell(`B${currentRow}`).value = imprevisto.ubicacion || '';
    worksheet.getCell(`B${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`B${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    const fechaInspeccion = new Date(imprevisto.fecha_inspeccion);
    worksheet.getCell(`C${currentRow}`).value = fechaInspeccion.toLocaleDateString('es-ES');
    worksheet.getCell(`C${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`C${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet.getCell(`D${currentRow}`).value = (imprevisto.tipo || '').toUpperCase();
    worksheet.getCell(`D${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`D${currentRow}`).font = { bold: true, size: 10 };
    worksheet.getCell(`D${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    currentRow++;

    // ============================================
    // SISTEMA Y COMPONENTE
    // ============================================
    worksheet.getCell(`A${currentRow}`).value = 'SISTEMA AFECTADO';
    worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 9 };
    worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`A${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    worksheet.getCell(`A${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet.mergeCells(`B${currentRow}:D${currentRow}`);
    worksheet.getCell(`B${currentRow}`).value = 'COMPONENTE AFECTADO - REEMPLAZADO';
    worksheet.getCell(`B${currentRow}`).font = { bold: true, size: 9 };
    worksheet.getCell(`B${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`B${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    worksheet.getCell(`B${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    currentRow++;

    worksheet.getCell(`A${currentRow}`).value = imprevisto.sistema_afectado || '';
    worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`A${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet.mergeCells(`B${currentRow}:D${currentRow}`);
    worksheet.getCell(`B${currentRow}`).value = imprevisto.componente_afectado || '';
    worksheet.getCell(`B${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`B${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    currentRow++;

    // ============================================
    // DETALLE DE TRABAJOS
    // ============================================
    worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value = 'DETALLE DE LOS TRABAJOS REALIZADOS';
    worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 10 };
    worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`A${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    worksheet.getCell(`A${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet.getCell(`C${currentRow}`).value = 'TÉCNICOS';
    worksheet.getCell(`C${currentRow}`).font = { bold: true, size: 9 };
    worksheet.getCell(`C${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`C${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    worksheet.getCell(`C${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet.getCell(`D${currentRow}`).value = 'HH';
    worksheet.getCell(`D${currentRow}`).font = { bold: true, size: 9 };
    worksheet.getCell(`D${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`D${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    worksheet.getCell(`D${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    currentRow++;

    // Calcular cuántas filas necesitamos
    const participantes = imprevisto.participantes ? imprevisto.participantes.split(',') : [];
    const numFilas = Math.max(5, participantes.length);

    // Área de detalle
    worksheet.mergeCells(`A${currentRow}:B${currentRow + numFilas - 1}`);
    const detalleCell = worksheet.getCell(`A${currentRow}`);
    detalleCell.value = imprevisto.detalle_tarea || '';
    detalleCell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
    detalleCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    // Participantes y HH
    for (let i = 0; i < numFilas; i++) {
      worksheet.getCell(`C${currentRow + i}`).value = participantes[i]?.trim() || '';
      worksheet.getCell(`C${currentRow + i}`).alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell(`C${currentRow + i}`).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      // HH solo en la primera fila
      worksheet.getCell(`D${currentRow + i}`).value = i === 0 ? (imprevisto.hh || '') : '';
      worksheet.getCell(`D${currentRow + i}`).alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell(`D${currentRow + i}`).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };
    }

    currentRow += numFilas;
    currentRow++;

    // ============================================
    // FIRMAS
    // ============================================
    worksheet.getCell(`A${currentRow}`).value = "V°B° TEC. ENCARGADO";
    worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 9 };
    worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`A${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F0F0' }
    };
    worksheet.getCell(`A${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet.mergeCells(`B${currentRow}:C${currentRow}`);
    worksheet.getCell(`B${currentRow}`).value = "V°B° SUPERVISOR MTTO.";
    worksheet.getCell(`B${currentRow}`).font = { bold: true, size: 9 };
    worksheet.getCell(`B${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`B${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F0F0' }
    };
    worksheet.getCell(`B${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet.getCell(`D${currentRow}`).value = "V°B° PLANIFICADOR";
    worksheet.getCell(`D${currentRow}`).font = { bold: true, size: 9 };
    worksheet.getCell(`D${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`D${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F0F0' }
    };
    worksheet.getCell(`D${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    currentRow++;

    // Espacio para firmas
    worksheet.getCell(`A${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.mergeCells(`B${currentRow}:C${currentRow}`);
    worksheet.getCell(`B${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.getCell(`D${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.getRow(currentRow).height = 40;

    currentRow++;

    // Nombres de firmantes
    worksheet.getCell(`A${currentRow}`).value = imprevisto.firmas?.supervisor || '';
    worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`A${currentRow}`).font = { size: 9 };

    worksheet.mergeCells(`B${currentRow}:C${currentRow}`);
    worksheet.getCell(`B${currentRow}`).value = imprevisto.firmas?.supervisor_area || '';
    worksheet.getCell(`B${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`B${currentRow}`).font = { size: 9 };

    worksheet.getCell(`D${currentRow}`).value = imprevisto.firmas?.brigada || '';
    worksheet.getCell(`D${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`D${currentRow}`).font = { size: 9 };

    // ============================================
    // GENERAR Y ENVIAR ARCHIVO
    // ============================================
    const buffer = await workbook.xlsx.writeBuffer();
    
    const filename = `IMP-01_${imprevisto.ubicacion || 'imprevisto'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);

  } catch (error) {
    console.error('Error al generar Excel:', error);
    res.status(500).json({ error: 'Error al generar el archivo Excel' });
  }
}

// ============================================
// AGREGAR EN EL ROUTER (SIN AUTENTICACIÓN)
// ============================================
// router.get('/:id/excel', imprevistoController.exportarImprevistoExcel);

};