import { ddmp_004Service } from "./ddmp_004_service.js";
import { procesarImagenBase64 } from "../imagenes/imageProcessor.js";
import ExcelJS from "exceljs";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ddmp_004Controller = {
  async crear(req, res) {
    try {
      const carpeta = 'ddmp_004';
      let datosFormulario = await procesarImagenBase64(req.body, carpeta);

      const registro = await ddmp_004Service.crearDdmp004(datosFormulario);
      res.status(201).json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.error('Error en crear ddmp_004:', error);
    }
  },

  async obtenerTodos(req, res) {
    try {
      const registros = await ddmp_004Service.obtenerTodos();
      res.json(registros);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const registro = await ddmp_004Service.obtenerPorId(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro ddmp_004 no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const registro = await ddmp_004Service.actualizar(req.params.id, req.body);
      if (!registro) return res.status(404).json({ error: "Registro ddmp_004 no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const registro = await ddmp_004Service.eliminar(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro ddmp_004 no encontrado" });
      res.json({ message: "Registro ddmp_004 eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

    async obtenerPorIdTarea(req, res) {
      try {
        const registro = await ddmp_004Service.obtenerPorIdTarea(req.params.id);
        if (!registro) return res.status(404).json({ error: "Registro no encontrado" });
        res.json(registro);
        console.log('Registro encontrado:', registro);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },


    // ============================================
// FUNCIÓN PARA EXPORTAR A EXCEL CON LOGO - DDMP-004
// ============================================

async exportarExcel(req, res) {
  try {
    const { id } = req.params;
    
    // Obtener el formulario con todos los datos poblados
    const formulario = await ddmp_004Service.obtenerPorIdTarea(id);
    
    if (!formulario) {
      return res.status(404).json({ error: "Formulario no encontrado" });
    }

    // Crear nuevo workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('DDMP-004');

    // Configurar ancho de columnas
    worksheet.columns = [
      { width: 15 },  // Columna A (N° DETEC)
      { width: 15 },  // Columna B (TIPO)
      { width: 30 },  // Columna C (APARTADO)
      { width: 15 },  // Columna D (NIVEL)
      { width: 15 },  // Columna E (N° DETEC)
      { width: 15 },  // Columna F (TIPO)
      { width: 30 },  // Columna G (APARTADO)
      { width: 15 },  // Columna H (NIVEL)
    ];

    // ============================================
    // AGREGAR LOGO
    // ============================================
    try {
      const logoPath = path.join(__dirname, '..', '..', 'logo', 'LogoChiconi.webp');
      
      console.log('Buscando logo en:', logoPath);
      
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        
        const logoId = workbook.addImage({
          buffer: logoBuffer,
          extension: 'png',
        });

        // Insertar logo en las celdas G1:H3 (DERECHA)
        worksheet.addImage(logoId, {
          tl: { col: 6, row: 0 }, // Top-left: columna G, fila 1
          br: { col: 8, row: 3 }, // Bottom-right: columna I, fila 4
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
    worksheet.mergeCells('A1:F3');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'DESCONTAMINACIÓN DE DETECTORES\nDDMP-004';
    titleCell.font = { bold: true, size: 16 };
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
    ['G1', 'G2', 'G3', 'H1', 'H2', 'H3'].forEach(cell => {
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

      worksheet.mergeCells(`B${currentRow}:H${currentRow}`);
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

    addInfoRow('SECTOR:', formulario.id_tarea?.id_sector?.nombre_sector || formulario.sector);
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
    
    worksheet.mergeCells(`B${currentRow}:H${currentRow}`);
    worksheet.getCell(`B${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.getRow(currentRow).height = 30;
    currentRow++;

    // ============================================
    // TABLA DE DETECTORES
    // ============================================
    // Encabezados de la tabla (doble columna)
    const headerRow = currentRow;
    
    // Primera columna de headers
    worksheet.getCell(`A${headerRow}`).value = 'N° DETEC';
    worksheet.getCell(`B${headerRow}`).value = 'TIPO';
    worksheet.getCell(`C${headerRow}`).value = 'APARTADO';
    worksheet.getCell(`D${headerRow}`).value = 'NIVEL';
    
    // Segunda columna de headers
    worksheet.getCell(`E${headerRow}`).value = 'N° DETEC';
    worksheet.getCell(`F${headerRow}`).value = 'TIPO';
    worksheet.getCell(`G${headerRow}`).value = 'APARTADO';
    worksheet.getCell(`H${headerRow}`).value = 'NIVEL';
    
    // Estilo para headers
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach(col => {
      const cell = worksheet.getCell(`${col}${headerRow}`);
      cell.font = { bold: true, size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };
    });
    
    currentRow++;

    // ============================================
    // FILAS DE DETECTORES (2 detectores por fila)
    // ============================================
    const detectores = formulario.detectores || [];
    const totalFilas = Math.max(20, Math.ceil(detectores.length / 2)); // Mínimo 20 filas
    
    for (let i = 0; i < totalFilas; i++) {
      const detector1 = detectores[i * 2]; // Detector izquierdo
      const detector2 = detectores[i * 2 + 1]; // Detector derecho
      
      // Primera columna (detector izquierdo)
      worksheet.getCell(`A${currentRow}`).value = detector1?.numero_detector || '';
      worksheet.getCell(`B${currentRow}`).value = detector1?.tipo || '';
      worksheet.getCell(`C${currentRow}`).value = detector1?.apartado || '';
      worksheet.getCell(`D${currentRow}`).value = detector1?.nivel || '';
      
      // Segunda columna (detector derecho)
      worksheet.getCell(`E${currentRow}`).value = detector2?.numero_detector || '';
      worksheet.getCell(`F${currentRow}`).value = detector2?.tipo || '';
      worksheet.getCell(`G${currentRow}`).value = detector2?.apartado || '';
      worksheet.getCell(`H${currentRow}`).value = detector2?.nivel || '';
      
      // Aplicar bordes y alineación a todas las celdas
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach(col => {
        const cell = worksheet.getCell(`${col}${currentRow}`);
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
          bottom: { style: 'thin' }
        };
      });
      
      currentRow++;
    }

    // ============================================
    // NORMA BASADA
    // ============================================
    worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
    const normaCell = worksheet.getCell(`A${currentRow}`);
    normaCell.value = 'NOTA: PAUTA BASADA NORMA NFPA-72: "Código Nacional de Alarmas de Incendios y Señalización"';
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
    worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
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

    worksheet.mergeCells(`A${currentRow}:H${currentRow + 3}`);
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
    // FIRMAS
    // ============================================
    const firmaRow = currentRow;
    
    // FIRMA SUPERVISOR (columnas A-B)
    worksheet.mergeCells(`A${firmaRow}:B${firmaRow}`);
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

    // FIRMA SUPERVISOR AREA (columnas C-E)
    worksheet.mergeCells(`C${firmaRow}:E${firmaRow}`);
    worksheet.getCell(`C${firmaRow}`).value = 'FIRMA SUPERVISOR AREA';
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

    // FIRMA BRIGADA (columnas F-H)
    worksheet.mergeCells(`F${firmaRow}:H${firmaRow}`);
    worksheet.getCell(`F${firmaRow}`).value = 'FIRMA BRIGADA';
    worksheet.getCell(`F${firmaRow}`).font = { bold: true, italic: true };
    worksheet.getCell(`F${firmaRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`F${firmaRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F0F0' }
    };
    worksheet.getCell(`F${firmaRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet.getRow(firmaRow).height = 25;

    // Espacios para firmas (vacíos)
    currentRow++;
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach(col => {
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
      worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
      worksheet.getCell(`A${currentRow}`).value = formulario.firmas.supervisor.nombre_usuario;
      worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center' };
    }
    if (formulario.firmas?.supervisor_area) {
      worksheet.mergeCells(`C${currentRow}:E${currentRow}`);
      worksheet.getCell(`C${currentRow}`).value = formulario.firmas.supervisor_area.nombre_usuario;
      worksheet.getCell(`C${currentRow}`).alignment = { horizontal: 'center' };
    }
    if (formulario.firmas?.brigada) {
      worksheet.mergeCells(`F${currentRow}:H${currentRow}`);
      worksheet.getCell(`F${currentRow}`).value = formulario.firmas.brigada.nombre_usuario;
      worksheet.getCell(`F${currentRow}`).alignment = { horizontal: 'center' };
    }

    // ============================================
    // GENERAR Y ENVIAR ARCHIVO
    // ============================================
    const buffer = await workbook.xlsx.writeBuffer();
    
    const filename = `DDMP-004_${formulario.id_tarea?.id_sector?.nombre_sector || formulario.sector || 'formulario'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);

  } catch (error) {
    console.error('Error al generar Excel:', error);
    res.status(500).json({ error: 'Error al generar el archivo Excel' });
  }
}
};