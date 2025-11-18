import { pfsbmp_007Service } from "./pfsbmp_007_service.js";
import { procesarImagenBase64 } from "../imagenes/imageProcessor.js";
import ExcelJS from 'exceljs';

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const pfsbmp_007Controller = {
  async crear(req, res) {
    try {
      const carpeta = 'pfsbmp_007';
      let datosFormulario = await procesarImagenBase64(req.body, carpeta);
      
      const registro = await pfsbmp_007Service.crearPfsbmp007(datosFormulario);
      res.status(201).json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.error('Error en crear pfsbmp_007:', error);
    }
  },

  async obtenerTodos(req, res) {
    try {
      const registros = await pfsbmp_007Service.obtenerTodos();
      res.json(registros);
    } catch (error) {
      console.error('Error en obtener pfsbmp_007:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const registro = await pfsbmp_007Service.actualizar(req.params.id, req.body);
      if (!registro) return res.status(404).json({ error: "Registro pfsbmp_007 no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const registro = await pfsbmp_007Service.eliminar(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro pfsbmp_007 no encontrado" });
      res.json({ message: "Registro pfsbmp_007 eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
  try {
    const registro = await pfsbmp_007Service.obtenerPorId(req.params.id);
    if (!registro) return res.status(404).json({ error: "Registro pfsbmp_007 no encontrado" });
    res.json(registro);
    console.log('Registro encontrado:', registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

async obtenerPorIdTarea(req, res) {
  try {
    const registro = await pfsbmp_007Service.obtenerPorIdTarea(req.params.id);
    if (!registro) return res.status(404).json({ error: "Registro pfsbmp_007 no encontrado" });
    res.json(registro);
    console.log('Registro encontrado:', registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},
// ============================================
// FUNCIÓN PARA EXPORTAR A EXCEL CON LOGO - PFSBMP-007
// ============================================
async exportarExcel(req, res) {
  try {
    const { id } = req.params;
    
    // Obtener el formulario con todos los datos poblados
    const formulario = await pfsbmp_007Service.obtenerPorIdTarea(id);
    
    if (!formulario) {
      return res.status(404).json({ error: "Formulario no encontrado" });
    }

    // Crear nuevo workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('PFSBMP-007');

    // Configurar ancho de columnas
    worksheet.columns = [
      { width: 15 },  // Columna A (para logo)
      { width: 15 },  // Columna B
      { width: 50 },  // Columna C
      { width: 20 },  // Columna D
    ];

    // ============================================
    // AGREGAR LOGO
    // ============================================
    try {
      // Ruta al logo (desde el controlador hacia la carpeta logo)
      const logoPath = path.join(__dirname, '..', '..', 'logo', 'LogoChiconi.webp');
      
      console.log('Buscando logo en:', logoPath);
      
      // Verificar si el archivo existe
      if (fs.existsSync(logoPath)) {
        // Leer el archivo como buffer
        const logoBuffer = fs.readFileSync(logoPath);
        
        // Agregar imagen al workbook
        const logoId = workbook.addImage({
          buffer: logoBuffer,
          extension: 'png',
        });

        // Insertar logo en las celdas C1:D3 (DERECHA)
        worksheet.addImage(logoId, {
          tl: { col: 3, row: 0 },
          br: { col: 4, row: 3 },
          editAs: 'oneCell'
        });
        
        console.log('✅ Logo agregado exitosamente');
      } else {
        console.warn('⚠️ Logo no encontrado en:', logoPath);
      }
    } catch (logoError) {
      console.warn('❌ Error al cargar el logo:', logoError.message);
    }

    // ============================================
    // ENCABEZADO CON LOGO
    // ============================================
    worksheet.getRow(1).height = 20;
    worksheet.getRow(2).height = 20;
    worksheet.getRow(3).height = 20;

    // Título principal (a la IZQUIERDA)
    worksheet.mergeCells('A1:C3');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'PRUEBA FUNCIONAL DE\nSISTEMA DE BOMBAS\nPFSBMP-007';
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
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

    // Bordes para las celdas del logo (DERECHA)
    ['C1', 'C2', 'C3', 'D1', 'D2', 'D3'].forEach(cell => {
      worksheet.getCell(cell).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };
    });

    // ============================================
    // INFORMACIÓN DE LA TAREA
    // ============================================
    let currentRow = 4;
    
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

      worksheet.mergeCells(`B${currentRow}:D${currentRow}`);
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
    const fecha = new Date(formulario.id_tarea?.ultima_modificacion || formulario.fecha_inspeccion);
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
    
    worksheet.mergeCells(`B${currentRow}:D${currentRow}`);
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
    worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
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
    // SECCIÓN: MOTO BOMBA
    // ============================================
    worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
    const mbTitle = worksheet.getCell(`A${currentRow}`);
    mbTitle.value = 'MOTO BOMBA';
    mbTitle.font = { bold: true, size: 12 };
    mbTitle.alignment = { horizontal: 'center', vertical: 'middle' };
    mbTitle.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB0B0B0' }
    };
    mbTitle.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.getRow(currentRow).height = 25;
    currentRow++;

    const motoBombaItems = [
      { label: 'PRUEBA FUNCIONAL CON FLUJO', field: 'mb_prueba_funcional_con_flujo' },
      { label: 'PRUEBA FUNCIONAL EN VACÍO', field: 'mb_prueba_funcional_en_vacio' },
      { label: 'LECTURA DE PRESIÓN DE MANÓMETRO EN LA ASPIRACIÓN (PSI)', field: 'mb_lectura_presion_manometro_aspiracion' },
      { label: 'LECTURA DE PRESIÓN DE MANÓMETRO EN LA IMPULSIÓN (PSI)', field: 'mb_lectura_presion_manometro_impulsion' },
      { label: 'COMPROBAR RUIDOS Y VIBRACIONES INUSUALES', field: 'mb_comprobar_ruidos_vibraciones_inusuales' },
      { label: 'EMPAQUETADURAS, COJINETES Y CUERPO DE BOMBA. DETECTA SOBRECALENTAMIENTO', field: 'mb_empaquetaduras_cojinetes_cuerpo_bomba_detecta_sobrecalentamiento' },
      { label: 'ANOTAR LA PRESIÓN DE ARRANQUE DE BOMBA', field: 'mb_anotar_presion_arranque_bomba' },
      { label: 'ANOTAR TIEMPO DE FUNCIONAMIENTO DE LA BOMBA', field: 'mb_anotar_tiempo_funcionamiento_bomba' },
      { label: 'LA PARADA DE EMERGENCIA ESTA INSTALADA ?', field: 'mb_parada_emergencia_esta_instalado' },
      { label: 'CONTROLÓ FUGAS EN EL ESCAPE', field: 'mb_controlo_fugas_en_escape' },
      { label: 'LAS VÁLVULAS QUEDAN ABIERTAS', field: 'mb_valvulas_quedan_abiertas' },
      { label: 'LA VÁLVULA ANTI RETORNO ESTÁ INSTALADA ?', field: 'mb_valvula_anti_retorno_esta_instalada' }
    ];

    motoBombaItems.forEach(item => {
      worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
      const labelCell = worksheet.getCell(`A${currentRow}`);
      labelCell.value = item.label;
      labelCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
      labelCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      const valueCell = worksheet.getCell(`D${currentRow}`);
      valueCell.value = formulario.checklist?.[item.field]?.estado || '';
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
    // SECCIÓN: ELECTROBOMBA
    // ============================================
    worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
    const ebTitle = worksheet.getCell(`A${currentRow}`);
    ebTitle.value = 'ELECTROBOMBA';
    ebTitle.font = { bold: true, size: 12 };
    ebTitle.alignment = { horizontal: 'center', vertical: 'middle' };
    ebTitle.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB0B0B0' }
    };
    ebTitle.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.getRow(currentRow).height = 25;
    currentRow++;

    const electroBombaItems = [
      { label: 'PRUEBA FUNCIONAL CON FLUJO', field: 'eb_prueba_funcional_con_flujo' },
      { label: 'PRUEBA FUNCIONAL EN VACÍO', field: 'eb_prueba_funcional_en_vacio' },
      { label: 'LECTURA DE PRESIÓN DE MANÓMETRO EN LA ASPIRACIÓN (PSI)', field: 'eb_lectura_presion_manometro_aspiracion' },
      { label: 'LECTURA DE PRESIÓN DE MANÓMETRO EN LA IMPULSIÓN (PSI)', field: 'eb_lectura_presion_manometro_impulsion' },
      { label: 'COMPROBAR RUIDOS Y VIBRACIONES INUSUALES', field: 'eb_comprobar_ruidos_vibraciones_inusuales' },
      { label: 'EMPAQUETADURAS, COJINETES Y CUERPO DE BOMBA. DETECTA SOBRECALENTAMIENTO', field: 'eb_empaquetaduras_cojinetes_cuerpo_bomba_detecta_sobrecalentamiento' },
      { label: 'ANOTAR LA PRESIÓN DE ARRANQUE DE BOMBA', field: 'eb_anotar_presion_arranque_bomba' },
      { label: 'ANOTAR TIEMPO DE FUNCIONAMIENTO DE LA BOMBA', field: 'eb_anotar_tiempo_funcionamiento_bomba' },
      { label: 'LA PARADA DE EMERGENCIA ESTA INSTALADA ?', field: 'eb_parada_emergencia_esta_instalado' },
      { label: 'EL ARRANQUE SUAVE DE LA BOMBA ESTA INSTALADO ?', field: 'eb_arranque_suave_bomba_esta_instalado' },
      { label: 'LAS VÁLVULAS QUEDAN ABIERTAS ?', field: 'eb_valvulas_quedan_abiertas' },
      { label: 'VÁLVULA ANTI RETORNO ESTÁ INSTALADA ?', field: 'eb_valvula_anti_retorno_esta_instalada' }
    ];

    electroBombaItems.forEach(item => {
      worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
      const labelCell = worksheet.getCell(`A${currentRow}`);
      labelCell.value = item.label;
      labelCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
      labelCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      const valueCell = worksheet.getCell(`D${currentRow}`);
      valueCell.value = formulario.checklist?.[item.field]?.estado || '';
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
    // SECCIÓN: BOMBA JOCKEY
    // ============================================
    worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
    const bjTitle = worksheet.getCell(`A${currentRow}`);
    bjTitle.value = 'BOMBA JOCKEY';
    bjTitle.font = { bold: true, size: 12 };
    bjTitle.alignment = { horizontal: 'center', vertical: 'middle' };
    bjTitle.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB0B0B0' }
    };
    bjTitle.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.getRow(currentRow).height = 25;
    currentRow++;

    const bombaJockeyItems = [
      { label: 'COMPROBAR RUIDOS Y VIBRACIONES INUSUALES ?', field: 'bj_comprobar_ruidos_vibraciones_inusuales' },
      { label: 'EMPAQUETADURAS, COJINETES Y CUERPO DE BOMBA. DETECTA SOBRECALENTAMIENTO', field: 'bj_empaquetaduras_cojinetes_cuerpo_bomba_detecta_sobrecalentamiento' },
      { label: 'ANOTAR LA PRESIÓN DE ARRANQUE DE BOMBA', field: 'bj_anotar_presion_arranque_bomba' },
      { label: 'ANOTAR LA PRESIÓN DE CORTE DE BOMBA', field: 'bj_anotar_presion_corte_bomba' },
      { label: 'LA PARADA DE EMERGENCIA ESTA INSTALADA ?', field: 'bj_parada_emergencia_esta_instalado' },
      { label: 'LAS VÁLVULAS QUEDAN ABIERTAS ?', field: 'bj_valvulas_quedan_abiertas' },
      { label: 'VÁLVULA ANTI RETORNO ESTÁ INSTALADA ?', field: 'bj_valvula_anti_retorno_esta_instalada' }
    ];

    bombaJockeyItems.forEach(item => {
      worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
      const labelCell = worksheet.getCell(`A${currentRow}`);
      labelCell.value = item.label;
      labelCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
      labelCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      const valueCell = worksheet.getCell(`D${currentRow}`);
      valueCell.value = formulario.checklist?.[item.field]?.estado || '';
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
    // NOTA AL PIE
    // ============================================
    worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
    const notaCell = worksheet.getCell(`A${currentRow}`);
    notaCell.value = 'NOTA : PAUTA BASADA NORMA NFPA-25: "Norma para la Inspección, Prueba, s Mantenimiento de Sistemas de Protección contra Incendios a Base de Agua"';
    notaCell.font = { bold: true, size: 9 };
    notaCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    notaCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.getRow(currentRow).height = 30;
    currentRow++;

    // ============================================
    // COMENTARIOS
    // ============================================
    worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
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

    worksheet.mergeCells(`A${currentRow}:D${currentRow + 3}`);
    const comentarioCell = worksheet.getCell(`A${currentRow}`);
    comentarioCell.value = formulario.comentarios || '';
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
    // FIRMAS (3 FIRMAS)
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
    worksheet.mergeCells(`B${firmaRow}:C${firmaRow}`);
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
    worksheet.getCell(`D${firmaRow}`).value = 'FIRMA BRIGADA';
    worksheet.getCell(`D${firmaRow}`).font = { bold: true, italic: true };
    worksheet.getCell(`D${firmaRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`D${firmaRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F0F0' }
    };
    worksheet.getCell(`D${firmaRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet.getRow(firmaRow).height = 25;

    // Espacios para firmas (vacíos)
    currentRow++;
    ['A', 'B', 'C', 'D'].forEach(col => {
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
      worksheet.mergeCells(`B${currentRow}:C${currentRow}`);
      worksheet.getCell(`B${currentRow}`).value = formulario.firmas.supervisor_area.nombre_usuario;
      worksheet.getCell(`B${currentRow}`).alignment = { horizontal: 'center' };
    }
    if (formulario.firmas?.brigada) {
      worksheet.getCell(`D${currentRow}`).value = formulario.firmas.brigada.nombre_usuario;
      worksheet.getCell(`D${currentRow}`).alignment = { horizontal: 'center' };
    }

    // ============================================
    // GENERAR Y ENVIAR ARCHIVO
    // ============================================
    const buffer = await workbook.xlsx.writeBuffer();
    
    const filename = `PFSBMP-007_${formulario.id_tarea?.id_sector?.nombre_sector || 'formulario'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);

  } catch (error) {
    console.error('Error al generar Excel:', error);
    res.status(500).json({ error: 'Error al generar el archivo Excel' });
  }
}
};