import { chevp_002Service } from "./chevp_002_service.js";
import { imageService } from "../imagenes/imageService.js";
import ExcelJS from "exceljs";
import { procesarImagenBase64 } from "../imagenes/imageProcessor.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const chevp_002Controller = {

  async crear(req, res) {
    try {
      const carpeta = 'chevp_002';
      let datosFormulario = await procesarImagenBase64(req.body, carpeta);
      
      const registro = await chevp_002Service.crearChevp002(datosFormulario);
      res.status(201).json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.error('Error en crear chevp002:', error);
    }
  },

  async obtenerTodos(req, res) {
    try {
      const registros = await chevp_002Service.obtenerTodos();
      res.json(registros);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const registro = await chevp_002Service.obtenerPorId(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro chevp002 no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  //obtener por id de tarea
  async obtenerPorIdTarea(req, res) {
    try {
      const registro = await chevp_002Service.obtenerPorIdTarea(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro chevp002 no encontrado" });
      res.json(registro);
      console.log('Registro encontrado:', registro);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const registro = await chevp_002Service.actualizar(req.params.id, req.body);
      if (!registro) return res.status(404).json({ error: "Registro chevp002 no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const registro = await chevp_002Service.eliminar(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro chevp002 no encontrado" });
      res.json({ message: "Registro chevp002  eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // ============================================
// FUNCIÓN PARA EXPORTAR A EXCEL CON LOGO - CHEVP-002
// ============================================
async exportarExcel(req, res) {
  try {
    const { id } = req.params;
    
    // Obtener el formulario con todos los datos poblados
    const formulario = await chevp_002Service.obtenerPorIdTarea(id);
    
    if (!formulario) {
      return res.status(404).json({ error: "Formulario no encontrado" });
    }

    // Crear nuevo workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('CHEVP-002');

    // Configurar ancho de columnas
    worksheet.columns = [
      { width: 35 },  // Columna A - UBICACIÓN
      { width: 15 },  // Columna B - AGUA ARRIBA (valor)
      { width: 20 },  // Columna C - AGUA ARRIBA PIN RACK
      { width: 15 },  // Columna D - AGUA ABAJO (valor)
      { width: 20 },  // Columna E - AGUA ABAJO PIN RACK
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

        // Insertar logo en las celdas D1:E3 (DERECHA)
        worksheet.addImage(logoId, {
          tl: { col: 3, row: 0 },
          br: { col: 5, row: 3 },
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
    titleCell.value = 'CONTROL DE PRESIÓN\nCHEVP-002';
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
    ['D1', 'D2', 'D3', 'E1', 'E2', 'E3'].forEach(cell => {
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

      worksheet.mergeCells(`B${currentRow}:E${currentRow}`);
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
    
    worksheet.mergeCells(`B${currentRow}:E${currentRow}`);
    worksheet.getCell(`B${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.getRow(currentRow).height = 30;
    currentRow++;

    // ============================================
    // ENCABEZADO DE TABLA
    // ============================================


    // Título de la sección
    worksheet.mergeCells(`A${currentRow}:E${currentRow}`);
    const tituloSeccionCell = worksheet.getCell(`A${currentRow}`);
    tituloSeccionCell.value = 'CUADROS DE VALVULAS UBICACION';
    tituloSeccionCell.font = { bold: true, size: 11 };
    tituloSeccionCell.alignment = { horizontal: 'center', vertical: 'middle' };
    tituloSeccionCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    tituloSeccionCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.getRow(currentRow).height = 25;
    currentRow++;

    // Fila de encabezado principal (AGUA ARRIBA / AGUA ABAJO)
    const encabezadoRow = currentRow;
    
    // Columna vacía para ubicación
    worksheet.getCell(`A${encabezadoRow}`).value = '';
    worksheet.getCell(`A${encabezadoRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE8E8E8' }
    };
    worksheet.getCell(`A${encabezadoRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    // AGUA ARRIBA (merge B-C)
    worksheet.mergeCells(`B${encabezadoRow}:C${encabezadoRow}`);
    const aguaArribaCell = worksheet.getCell(`B${encabezadoRow}`);
    aguaArribaCell.value = 'PIN RACK';
    aguaArribaCell.font = { bold: true, size: 11 };
    aguaArribaCell.alignment = { horizontal: 'center', vertical: 'middle' };
    aguaArribaCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    aguaArribaCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    // AGUA ABAJO (merge D-E)
    worksheet.mergeCells(`D${encabezadoRow}:E${encabezadoRow}`);
    const aguaAbajoCell = worksheet.getCell(`D${encabezadoRow}`);
    aguaAbajoCell.value = 'SPRINKLER';
    aguaAbajoCell.font = { bold: true, size: 11 };
    aguaAbajoCell.alignment = { horizontal: 'center', vertical: 'middle' };
    aguaAbajoCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    aguaAbajoCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet.getRow(encabezadoRow).height = 25;
    currentRow++;

    // Fila de subencabezados
    const subHeaders = [
      '',
      'AGUA ARRIBA',
      'AGUA ABAJO',
      'AGUA ARRIBA',
      'AGUA ABAJO'
    ];

    subHeaders.forEach((header, index) => {
      const col = String.fromCharCode(65 + index); // A, B, C, D, E
      const cell = worksheet.getCell(`${col}${currentRow}`);
      cell.value = header;
      cell.font = { bold: true, size: 9 };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE8E8E8' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };
    });
    worksheet.getRow(currentRow).height = 30;
    currentRow++;

    // ============================================
    // FILAS DE DATOS (CUADROS DE VÁLVULAS)
    // ============================================
    const parseValores = (valor) => {
      if (!valor) return { agua_arriba: '', agua_arriba_pin: '', agua_abajo: '', agua_abajo_pin: '' };
      
      const parts = valor.trim().split(/\s+/);
      return {
        agua_arriba: parts[0] || '',
        agua_abajo: parts[1] || '',
        agua_arriba_pin: parts[2] || '',
        agua_abajo_pin: parts[3] || ''
      };
    };

    const cuadrosValvulas = [
      { nombre: 'TRUCK SHOP', valor: formulario.checklist?.truck_shop },
      { nombre: 'ALMACEN', valor: formulario.checklist?.almacen },
      { nombre: 'VALVULA REDUCTORA DE PRESION', valor: formulario.checklist?.valvula_reductora_presion },
      { nombre: 'SECUNDARIO VIEJO', valor: formulario.checklist?.secundario_viejo },
      { nombre: 'PRIMARIO NUEVO', valor: formulario.checklist?.primario_nuevo },
      { nombre: 'PUYRREDON MINA', valor: formulario.checklist?.puyrredon_mina },
      { nombre: 'PLANTA DE PROCESO', valor: formulario.checklist?.planta_proceso }
    ];

    cuadrosValvulas.forEach((cuadro) => {
      const valores = parseValores(cuadro.valor);

      // Columna A - Nombre del cuadro
      const nombreCell = worksheet.getCell(`A${currentRow}`);
      nombreCell.value = cuadro.nombre;
      nombreCell.font = { bold: true, size: 10 };
      nombreCell.alignment = { horizontal: 'left', vertical: 'middle' };
      nombreCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      // Columna B - AGUA ARRIBA (valor)
      const aguaArribaValorCell = worksheet.getCell(`B${currentRow}`);
      aguaArribaValorCell.value = valores.agua_arriba;
      aguaArribaValorCell.alignment = { horizontal: 'center', vertical: 'middle' };
      aguaArribaValorCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      // Columna C - AGUA ARRIBA PIN RACK
      const aguaArribaPinCell = worksheet.getCell(`C${currentRow}`);
      aguaArribaPinCell.value = valores.agua_arriba_pin;
      aguaArribaPinCell.alignment = { horizontal: 'center', vertical: 'middle' };
      aguaArribaPinCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      // Columna D - AGUA ABAJO (valor)
      const aguaAbajoValorCell = worksheet.getCell(`D${currentRow}`);
      aguaAbajoValorCell.value = valores.agua_abajo;
      aguaAbajoValorCell.alignment = { horizontal: 'center', vertical: 'middle' };
      aguaAbajoValorCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      // Columna E - AGUA ABAJO PIN RACK
      const aguaAbajoPinCell = worksheet.getCell(`E${currentRow}`);
      aguaAbajoPinCell.value = valores.agua_abajo_pin;
      aguaAbajoPinCell.alignment = { horizontal: 'center', vertical: 'middle' };
      aguaAbajoPinCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      worksheet.getRow(currentRow).height = 25;
      currentRow++;
    });

    // Agregar filas vacías hasta completar al menos 10 filas
    const minRows = 10;
    const currentLines = cuadrosValvulas.length;
    const emptyRowsNeeded = Math.max(0, minRows - currentLines);

    for (let i = 0; i < emptyRowsNeeded; i++) {
      ['A', 'B', 'C', 'D', 'E'].forEach(col => {
        const cell = worksheet.getCell(`${col}${currentRow}`);
        cell.value = '';
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
          bottom: { style: 'thin' }
        };
      });
      worksheet.getRow(currentRow).height = 25;
      currentRow++;
    }

    // ============================================
    // COMENTARIOS
    // ============================================
    worksheet.mergeCells(`A${currentRow}:E${currentRow}`);
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

    worksheet.mergeCells(`A${currentRow}:E${currentRow + 3}`);
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
    // OBSERVACIONES
    // ============================================
    worksheet.mergeCells(`A${currentRow}:E${currentRow}`);
    const observacionesHeader = worksheet.getCell(`A${currentRow}`);
    observacionesHeader.value = '¿TIENE OBSERVACIONES?';
    observacionesHeader.font = { bold: true, italic: true };
    observacionesHeader.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F0F0' }
    };
    observacionesHeader.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    currentRow++;

    worksheet.mergeCells(`A${currentRow}:E${currentRow}`);
    const observacionesCell = worksheet.getCell(`A${currentRow}`);
    observacionesCell.value = formulario.observaciones || '';
    observacionesCell.alignment = { horizontal: 'center', vertical: 'middle' };
    observacionesCell.font = { bold: true, size: 12 };
    observacionesCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.getRow(currentRow).height = 25;
    currentRow++;

    // Si hay observaciones generales
    if (formulario.observaciones_generales) {
      worksheet.mergeCells(`A${currentRow}:E${currentRow}`);
      const obsGeneralesHeader = worksheet.getCell(`A${currentRow}`);
      obsGeneralesHeader.value = 'OBSERVACIONES GENERALES:';
      obsGeneralesHeader.font = { bold: true, italic: true };
      obsGeneralesHeader.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF0F0F0' }
      };
      obsGeneralesHeader.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };
      currentRow++;

      worksheet.mergeCells(`A${currentRow}:E${currentRow + 2}`);
      const obsGeneralesCell = worksheet.getCell(`A${currentRow}`);
      obsGeneralesCell.value = formulario.observaciones_generales;
      obsGeneralesCell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
      obsGeneralesCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };
      worksheet.getRow(currentRow).height = 60;
      currentRow += 3;
    }

    // ============================================
    // FIRMAS (3 FIRMAS)
    // ============================================
    const firmaRow = currentRow;
    
    // FIRMA SUPERVISOR
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

    // FIRMA SUPERVISOR AREA
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

    // FIRMA BRIGADA
    worksheet.mergeCells(`D${firmaRow}:E${firmaRow}`);
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
    ['A', 'B', 'C', 'D', 'E'].forEach(col => {
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
      worksheet.getCell(`C${currentRow}`).value = formulario.firmas.supervisor_area.nombre_usuario;
      worksheet.getCell(`C${currentRow}`).alignment = { horizontal: 'center' };
    }
    if (formulario.firmas?.brigada) {
      worksheet.mergeCells(`D${currentRow}:E${currentRow}`);
      worksheet.getCell(`D${currentRow}`).value = formulario.firmas.brigada.nombre_usuario;
      worksheet.getCell(`D${currentRow}`).alignment = { horizontal: 'center' };
    }

    // ============================================
    // GENERAR Y ENVIAR ARCHIVO
    // ============================================
    const buffer = await workbook.xlsx.writeBuffer();
    
    const filename = `CHEVP-002_${formulario.id_tarea?.id_sector?.nombre_sector || 'formulario'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);

  } catch (error) {
    console.error('Error al generar Excel:', error);
    res.status(500).json({ error: 'Error al generar el archivo Excel' });
  }
}
}