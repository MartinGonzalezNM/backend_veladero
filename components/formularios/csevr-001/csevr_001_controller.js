import { csevr_001Service } from "./csevr_001_service.js";
import { imageService } from "../imagenes/imageService.js";
import ExcelJS from "exceljs";

export const csevr_001Controller = {
  async crear(req, res) {
    try {
          const carpeta = 'csevr_001';
          let datosFormulario = req.body;
          //console.log('Datos recibidos:', datosFormulario);
          // Si hay imagen en base64, procesarla
          if (req.body.imagen_base64) {
            console.log('Procesando imagen...');
            
            const imagenData = await imageService.subirImagen(
              req.body.imagen_base64,
              req.body.nombre_imagen || 'imagen.jpg',
              carpeta
            );
            
            datosFormulario.imagen = {
              url: imagenData.url,
              nombre_imagen: imagenData.nombre_imagen ,
              tamaño: imagenData.tamaño,
              tipo_mime: imagenData.tipo_mime
            };
            
            // Limpiar el base64 del objeto (no guardarlo en BD)
            delete datosFormulario.imagen_base64;
            delete datosFormulario.nombre_imagen;
          }
      const registro = await csevr_001Service.crearCsevr001(req.body);
      res.status(201).json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.error('Error en crear:', error);
    }
  },

  async obtenerTodos(req, res) {
    try {
      const registros = await csevr_001Service.obtenerTodos();
      res.json(registros);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const registro = await csevr_001Service.obtenerPorId(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  //obtener por id de tarea
  async obtenerPorIdTarea(req, res) {
    try {
      const registro = await csevr_001Service.obtenerPorIdTarea(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro no encontrado" });
      res.json(registro);
      console.log('Registro encontrado:', registro);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const registro = await csevr_001Service.actualizar(req.params.id, req.body);
      if (!registro) return res.status(404).json({ error: "Registro no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const registro = await csevr_001Service.eliminar(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro no encontrado" });
      res.json({ message: "Registro eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorFiltros(req, res) {
    try {
      const { id_area, id_sector, id_empresa, fecha_inicio, fecha_fin } = req.query;
      
      const filtros = {};
      
      if (id_area) filtros.id_area = id_area;
      if (id_sector) filtros.id_sector = id_sector;
      if (id_empresa) filtros.id_empresa = id_empresa;
      
      if (fecha_inicio || fecha_fin) {
        filtros.fecha_inspeccion = {};
        if (fecha_inicio) filtros.fecha_inspeccion.$gte = new Date(fecha_inicio);
        if (fecha_fin) filtros.fecha_inspeccion.$lte = new Date(fecha_fin);
      }

      const registros = await csevr_001Service.obtenerPorFiltros(filtros);
      res.json(registros);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
// ============================================
  // FUNCIÓN PARA EXPORTAR A EXCEL
  // ============================================
  async exportarExcel(req, res) {
  try {
    const { id } = req.params;
    
    // Obtener el formulario con todos los datos poblados
    const formulario = await csevr_001Service.obtenerPorIdTarea(id);
    
    if (!formulario) {
      return res.status(404).json({ error: "Formulario no encontrado" });
    }

    // Crear nuevo workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('CSEVR-001');

    // Configurar ancho de columnas
    worksheet.columns = [
      { width: 40 },  // Columna A
      { width: 20 },  // Columna B
      { width: 40 },  // Columna C
    ];

    // ============================================
    // ENCABEZADO
    // ============================================
    worksheet.mergeCells('A1:C1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'CONTROL DE SPRINKLER- CSEVR-001';
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    titleCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.getRow(1).height = 25;

    // ============================================
    // INFORMACIÓN DE LA TAREA
    // ============================================
    let currentRow = 2;
    
    const addInfoRow = (label, value) => {
      const labelCell = worksheet.getCell(`A${currentRow}`);
      labelCell.value = label;
      labelCell.font = { bold: true, italic: true };
      labelCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF0F0F0' }
      };
      labelCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      worksheet.mergeCells(`B${currentRow}:C${currentRow}`);
      const valueCell = worksheet.getCell(`B${currentRow}`);
      valueCell.value = value || 'N/A';
      valueCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };
      
      currentRow++;
    };

    addInfoRow('SECTOR:', formulario.id_tarea?.id_sector?.nombre_sector);
    addInfoRow('INSPECTOR:', formulario.id_tarea?.responsable?.nombre_usuario);
    addInfoRow('DURACIÓN DE LA TAREA:', formulario.id_tarea?.id_hh);
    addInfoRow('FECHA:', new Date(formulario.fecha_inspeccion).toLocaleDateString('es-ES'));
    
    // Calcular hora
    const fecha = new Date(formulario.fecha_inspeccion);
    const hora = `${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}`;
    addInfoRow('HORA:', hora);
    
    // Firma Inspector (vacío para rellenar manualmente)
    worksheet.getCell(`A${currentRow}`).value = 'FIRMA INSPECTOR';
    worksheet.getCell(`A${currentRow}`).font = { bold: true, italic: true };
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
    worksheet.getCell(`B${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.getRow(currentRow).height = 30;
    currentRow++;

    // ============================================
    // TÍTULO DE CHECKLIST
    // ============================================
    worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
    const checklistTitle = worksheet.getCell(`A${currentRow}`);
    checklistTitle.value = 'INDICAR SI/NO SI REALIZÓ LA TAREA INDICADA - N/A=NO APLICA-OP=OPERATIVO-NOP=NO OPERATIVO-OB=OBSERVACIÓN';
    checklistTitle.font = { bold: true, size: 10 };
    checklistTitle.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    checklistTitle.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    checklistTitle.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.getRow(currentRow).height = 30;
    currentRow++;

    // Encabezado SPRINKLER
    worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
    const sprinklerHeader = worksheet.getCell(`A${currentRow}`);
    sprinklerHeader.value = 'SPRINKLER';
    sprinklerHeader.font = { bold: true };
    sprinklerHeader.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    sprinklerHeader.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.getCell(`C${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    currentRow++;

    // ============================================
    // CHECKLIST ITEMS
    // ============================================
    const checklistItems = [
      { label: 'RED SECA', field: 'red_seca' },
      { label: 'RED HÚMEDA', field: 'red_humeda' },
      { label: 'OBSERVO FILTRACIONES', field: 'observo_filtraciones' },
      { label: 'OBSERVO PINTURA EN EL COMPONENTES', field: 'observo_pintura_componentes' },
      { label: 'OBSERVO SULFATACIÓN', field: 'observo_sulfatacion' },
      { label: 'OBSERVO DEFORMACIÓN', field: 'observo_deformacion' },
      { label: 'TEMPERATURA DE RUPTURA', field: 'temperatura_ruptura' },
      { label: 'SPRINKLER LATERAL', field: 'sprinkler_lateral' },
      { label: 'SPRINKLER PENDIENTE', field: 'sprinkler_pendiente' },
      { label: 'SPRINKLER MONTANTE', field: 'sprinkler_montante' },
      { label: 'VERIFIQUE QUE LA VÁLVULA INSTALADA A FIN DE LÍNEA', field: 'valvula_fin_linea' },
      { label: 'REALIZO MOVIMIENTO DE AGUA EN LÍNEA', field: 'movimiento_agua' },
      { label: 'LA VÁLVULA PRESENTA DETERIORO MECÁNICO', field: 'valvula_deterioro' }
    ];

    checklistItems.forEach(item => {
      worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
      const labelCell = worksheet.getCell(`A${currentRow}`);
      labelCell.value = item.label;
      labelCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      const valueCell = worksheet.getCell(`C${currentRow}`);
      valueCell.value = formulario.checklist?.[item.field] || '';
      valueCell.alignment = { horizontal: 'center', vertical: 'middle' };
      valueCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      currentRow++;
    });

    // ============================================
    // NORMA BASADA
    // ============================================
    worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
    const normaCell = worksheet.getCell(`A${currentRow}`);
    normaCell.value = 'BASADA NORMA NFPA-25- "Norma para la Inspección, Prueba, y Mantenimiento de Sistemas de Protección contra Incendios a';
    normaCell.font = { bold: true, size: 9 };
    normaCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
    normaCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    normaCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.getRow(currentRow).height = 20;
    currentRow++;

    // ============================================
    // COMENTARIOS
    // ============================================
    worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
    const comentarioHeader = worksheet.getCell(`A${currentRow}`);
    comentarioHeader.value = 'COMETARIOS:';
    comentarioHeader.font = { bold: true, italic: true };
    comentarioHeader.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F0F0' }
    };
    comentarioHeader.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    currentRow++;

    worksheet.mergeCells(`A${currentRow}:C${currentRow + 3}`);
    const comentarioCell = worksheet.getCell(`A${currentRow}`);
    comentarioCell.value = formulario.comentario || '';
    comentarioCell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
    comentarioCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.getRow(currentRow).height = 80;
    currentRow += 4;

    // ============================================
    // FIRMAS
    // ============================================
    const firmaRow = currentRow;
    
    // FIRMA SUPERVISOR
    worksheet.getCell(`A${firmaRow}`).value = 'FIRMA SUPERVISOR';
    worksheet.getCell(`A${firmaRow}`).font = { bold: true, italic: true };
    worksheet.getCell(`A${firmaRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`A${firmaRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F0F0' }
    };
    worksheet.getCell(`A${firmaRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    // FIRMA SUPERVISOR AREA
    worksheet.getCell(`B${firmaRow}`).value = 'FIRMA SUPERVISOR AREA';
    worksheet.getCell(`B${firmaRow}`).font = { bold: true, italic: true };
    worksheet.getCell(`B${firmaRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`B${firmaRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F0F0' }
    };
    worksheet.getCell(`B${firmaRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    // FIRMA BRIGADA
    worksheet.getCell(`C${firmaRow}`).value = 'FIRMA BRIGADA';
    worksheet.getCell(`C${firmaRow}`).font = { bold: true, italic: true };
    worksheet.getCell(`C${firmaRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`C${firmaRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F0F0' }
    };
    worksheet.getCell(`C${firmaRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet.getRow(firmaRow).height = 25;

    // Espacios para firmas (vacíos)
    currentRow++;
    ['A', 'B', 'C'].forEach(col => {
      worksheet.getCell(`${col}${currentRow}`).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };
    });
    worksheet.getRow(currentRow).height = 40;

    // Nombres de quien firmó (si están disponibles)
    currentRow++;
    if (formulario.firmas?.supervisor) {
      worksheet.getCell(`A${currentRow}`).value = formulario.firmas.supervisor.nombre_usuario;
      worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center' };
    }
    if (formulario.firmas?.supervisor_area) {
      worksheet.getCell(`B${currentRow}`).value = formulario.firmas.supervisor_area.nombre_usuario;
      worksheet.getCell(`B${currentRow}`).alignment = { horizontal: 'center' };
    }
    if (formulario.firmas?.brigada) {
      worksheet.getCell(`C${currentRow}`).value = formulario.firmas.brigada.nombre_usuario;
      worksheet.getCell(`C${currentRow}`).alignment = { horizontal: 'center' };
    }

    // ============================================
    // GENERAR Y ENVIAR ARCHIVO
    // ============================================
    const buffer = await workbook.xlsx.writeBuffer();
    
    const filename = `CSEVR-001_${formulario.id_tarea?.id_sector?.nombre_sector || 'formulario'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);

  } catch (error) {
    console.error('Error al generar Excel:', error);
    res.status(500).json({ error: 'Error al generar el archivo Excel' });
  }
}

// ============================================
// RUTA EN EL ROUTER
// ============================================
// En tu archivo de rutas (csevr_001Routes.js):
};