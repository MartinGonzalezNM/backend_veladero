import { sdscmp_008Service } from "./sdscmp_008_service.js";
import { imageService } from "../imagenes/imageService.js";
import ExcelJS from "exceljs";
import { procesarImagenBase64 } from "../imagenes/imageProcessor.js";

export const sdscmp_008Controller = {
  async crear(req, res) {
    try {
      const carpeta = 'sdscmp_008';
      let datosFormulario = await procesarImagenBase64(req.body, carpeta);
      
      const registro = await sdscmp_008Service.crearSdscmp008(datosFormulario);
      res.status(201).json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.error('Error en crear:', error);
    }
  },

  async obtenerTodos(req, res) {
    try {
      const registros = await sdscmp_008Service.obtenerTodos();
      res.json(registros);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const registro = await sdscmp_008Service.obtenerPorId(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  

  async obtenerPorIdTarea(req, res) {
    try {
      const registro = await sdscmp_008Service.obtenerPorIdTarea(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro no encontrado" });
      res.json(registro);
      console.log('Registro encontrado:', registro);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const registro = await sdscmp_008Service.actualizar(req.params.id, req.body);
      if (!registro) return res.status(404).json({ error: "Registro no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const registro = await sdscmp_008Service.eliminar(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro no encontrado" });
      res.json({ message: "Registro eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  //elimine obtener por filtros creo que no se usaba


  // ============================================
  // FUNCIÓN PARA EXPORTAR A EXCEL
  // ============================================
  async exportarExcel(req, res) {
    try {
      const { id } = req.params;
      
      // Obtener el formulario con todos los datos poblados
      const formulario = await sdscmp_008Service.obtenerPorIdTarea(id);
      
      if (!formulario) {
        return res.status(404).json({ error: "Formulario no encontrado" });
      }

      // Crear nuevo workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('SDSCMP-008');

      // Configurar ancho de columnas
      worksheet.columns = [
        { width: 60 },  // Columna A
        { width: 20 },  // Columna B
      ];

      // ============================================
      // ENCABEZADO
      // ============================================
      worksheet.mergeCells('A1:B1');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = 'CONTROL DE SISTEMA CONTRA INCENDIO - SDSCMP-008';
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
      worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
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

      // ============================================
      // CHECKLIST ITEMS
      // ============================================
      const checklistItems = [
        { label: 'EL PANEL DE ALARMA DE LA CENTRAL ESTA OPERATIVO', field: 'panel_alarma_operativo' },
        { label: 'LOS PILOTOS Y LED DE ALARMA DE INCENDIO ESTÁN OPERATIVOS', field: 'pilotos_led_operativos' },
        { label: 'DETECTORES DE TEMPERATURA ESTÁN OPERATIVO', field: 'detectores_temperatura_operativos' },
        { label: 'DETECTORES DE HUMO ESTÁN OPERATIVO', field: 'detectores_humo_operativos' },
        { label: 'ACCIONADORES MANUALES', field: 'accionadores_manuales' },
        { label: 'FUENTE DE ALIMENTACIÓN PRINCIPAL INDICAR VOLTAJE', field: 'fuente_alimentacion_principal_voltaje' },
        { label: 'FUENTE DE ALIMENTACIÓN SECUNDARIA INDICAR VOLTAJE', field: 'fuente_alimentacion_secundaria_voltaje' },
        { label: 'TENSIÓN DE BATERÍA A PLENA CARGA INDICAR VOLTAJE', field: 'tension_bateria_plena_carga_voltaje' },
        { label: 'TENSIÓN DE BATERÍA INDICAR VOLTAJE', field: 'tension_bateria_voltaje' },
        { label: 'SE HAN PROBADO DETECTORES FOTOELÉCTRICOS', field: 'probado_detectores_fotoelectricos' },
        { label: 'SE HAN PROBADO DETECTORES DE TEMPERATURAS', field: 'probado_detectores_temperatura' },
        { label: 'SENSORES DE ACCIONAMIENTO MANUAL', field: 'sensores_accionamiento_manual' },
        { label: 'VERIFIQUE CONECTORES Y DISPOSITIVO DE SEÑALES AUDIO VISUALES', field: 'verifico_conectores_senales_visuales' },
        { label: 'CONTROL DE LAZO Y LAZO ABIERTO', field: 'control_lazo_abierto' },
        { label: 'SE RETIRARON DETECTORES DE SU BASE A FIN DE CHEQUEAR CONEXIÓN', field: 'retiraron_detectores_chequear_conexion' },
        { label: 'EL ENCLAVAMIENTO DE SISTEMAS ES ADECUADO', field: 'enclavamiento_sistemas_adecuado' },
        { label: 'SE LIMPIO GABINETE DE CENTRAL, BATERÍAS Y CONEXIONES', field: 'limpio_gabinete_baterias_conexiones' }
      ];

      checklistItems.forEach(item => {
        const labelCell = worksheet.getCell(`A${currentRow}`);
        labelCell.value = item.label;
        labelCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
        labelCell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
          bottom: { style: 'thin' }
        };

        const valueCell = worksheet.getCell(`B${currentRow}`);
        valueCell.value = formulario.checklist?.[item.field] || '';
        valueCell.alignment = { horizontal: 'center', vertical: 'middle' };
        valueCell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
          bottom: { style: 'thin' }
        };

        worksheet.getRow(currentRow).height = 30;
        currentRow++;
      });

      // ============================================
      // COMENTARIOS
      // ============================================
      worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
      const comentarioHeader = worksheet.getCell(`A${currentRow}`);
      comentarioHeader.value = 'COMENTARIOS:';
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

      worksheet.mergeCells(`A${currentRow}:B${currentRow + 3}`);
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

      // FIRMA BRIGADA
      worksheet.getCell(`B${firmaRow}`).value = 'FIRMA BRIGADA';
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

      worksheet.getRow(firmaRow).height = 25;

      // Espacios para firmas (vacíos)
      currentRow++;
      ['A', 'B'].forEach(col => {
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
      if (formulario.firmas?.brigada) {
        worksheet.getCell(`B${currentRow}`).value = formulario.firmas.brigada.nombre_usuario;
        worksheet.getCell(`B${currentRow}`).alignment = { horizontal: 'center' };
      }

      // ============================================
      // GENERAR Y ENVIAR ARCHIVO
      // ============================================
      const buffer = await workbook.xlsx.writeBuffer();
      
      const filename = `SDSCMP-008_${formulario.id_tarea?.id_sector?.nombre_sector || 'formulario'}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(buffer);

    } catch (error) {
      console.error('Error al generar Excel:', error);
      res.status(500).json({ error: 'Error al generar el archivo Excel' });
    }
  }
};