import { emhmp_001Service } from "./emhmp_001_service.js";
import { procesarImagenBase64 } from "../imagenes/imageProcessor.js";
import ExcelJS from "exceljs";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const emhmp_001Controller = {
  async crear(req, res) {
    try {
      const carpeta = 'emhmp_001';
      let datosFormulario = await procesarImagenBase64(req.body, carpeta);
      
      const registro = await emhmp_001Service.crearEmhmp001(datosFormulario);
      res.status(201).json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.error('Error en crear emhmp_001:', error);
    }
  },

  async obtenerTodos(req, res) {
    try {
      const registros = await emhmp_001Service.obtenerTodos();
      res.json(registros);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

 

  async actualizar(req, res) {
    try {
      const registro = await emhmp_001Service.actualizar(req.params.id, req.body);
      if (!registro) return res.status(404).json({ error: "Registro emhmp_001no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const registro = await emhmp_001Service.eliminar(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro emhmp_001 no encontrado" });
      res.json({ message: "Registro emhmp_001 eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async obtenerPorId(req, res) {
  try {
    const registro = await emhmp_001Service.obtenerPorId(req.params.id);
    if (!registro) return res.status(404).json({ error: "Registro no encontrado" });
    res.json(registro);
    console.log('Registro encontrado:', registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

async obtenerPorIdTarea(req, res) {
  try {
    const registro = await emhmp_001Service.obtenerPorIdTarea(req.params.id);
    if (!registro) return res.status(404).json({ error: "Registro no encontrado" });
    res.json(registro);
    console.log('Registro encontrado:', registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},


// ============================================
// FUNCIÓN PARA EXPORTAR A EXCEL CON LOGO - EMHMP-001
// ============================================

async exportarExcel(req, res) {
  try {
    const { id } = req.params;
    
    // Obtener el formulario con todos los datos poblados
    const formulario = await emhmp_001Service.obtenerPorIdTarea(id);
    
    if (!formulario) {
      return res.status(404).json({ error: "Formulario no encontrado" });
    }

    // Crear nuevo workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('EMHMP-001');

    // Obtener número de hidrantes
    const numHidrantes = formulario.hidrantes?.length || 0;
    const totalColumns = numHidrantes + 1; // +1 para la columna de descripciones

    // Configurar ancho de columnas
    worksheet.getColumn(1).width = 50; // Columna A (descripción)
    for (let i = 0; i < numHidrantes; i++) {
      worksheet.getColumn(i + 2).width = 12; // Columnas B, C, D, etc.
    }

    let currentRow = 1;

    // ============================================
    // ENCABEZADO PRINCIPAL
    // ============================================
    const lastCol = String.fromCharCode(65 + numHidrantes);
    worksheet.mergeCells(`A${currentRow}:${lastCol}${currentRow}`);
    const titleCell = worksheet.getCell(`A${currentRow}`);
    titleCell.value = 'ESTACIÓN DE MANGUERA (HIDRANTES) EMHMP-001';
    titleCell.font = { bold: true, size: 14, italic: true };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFFFF' }
    };
    titleCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.getRow(currentRow).height = 25;
    currentRow++;

    // ============================================
    // INFORMACIÓN GENERAL (LADO IZQUIERDO)
    // ============================================
    const infoStartRow = currentRow;
    
    const addInfoRowLeft = (label, value) => {
      const cell = worksheet.getCell(`A${currentRow}`);
      cell.value = `${label} ${value || ''}`;
      cell.font = { bold: true, italic: true, size: 10 };
      cell.alignment = { horizontal: 'left', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };
      
      // Agregar bordes a las demás celdas de la fila (SIN COLOR DE FONDO)
      for (let i = 1; i <= numHidrantes; i++) {
        const col = String.fromCharCode(65 + i);
        const logoCell = worksheet.getCell(`${col}${currentRow}`);
        logoCell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
          bottom: { style: 'thin' }
        };
        // Se eliminó el logoCell.fill para que no tenga color de fondo
      }
      
      worksheet.getRow(currentRow).height = 20;
      currentRow++;
    };

    addInfoRowLeft('SECTOR:', formulario.id_tarea?.id_sector?.nombre_sector);
    addInfoRowLeft('INSPECTOR:', formulario.id_tarea?.responsable?.nombre_usuario);
    
    const fecha = new Date(formulario.id_tarea?.ultima_modificacion || formulario.fecha_inspeccion);
    const hora = `${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}`;
    addInfoRowLeft('HORA DE INICIO:', hora);
    addInfoRowLeft('FECHA:', fecha.toLocaleDateString('es-ES'));
    addInfoRowLeft('DURACIÓN DE LA TAREA:', formulario.id_tarea?.id_hh);

    // ============================================
    // AGREGAR LOGO (LIMITADO HASTA COLUMNA G)
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

        // Posicionar logo - MÁXIMO hasta columna G (índice 6)
        const logoStartCol = Math.max(2, Math.ceil(numHidrantes * 0.3)); // Comienza alrededor del 30%
        const logoEndCol = Math.min(6, numHidrantes); // Máximo columna G (índice 6)
        const logoStartRow = infoStartRow - 1; 
        const logoEndRow = currentRow - 1; 

        worksheet.addImage(logoId, {
          tl: { col: logoStartCol, row: logoStartRow },
          br: { col: logoEndCol + 1, row: logoEndRow },
          editAs: 'oneCell'
        });
        
        console.log('✅ Logo agregado exitosamente en columnas', logoStartCol, 'a', logoEndCol);
      } else {
        console.warn('⚠️ Logo no encontrado en:', logoPath);
      }
    } catch (logoError) {
      console.warn('❌ Error al cargar el logo:', logoError.message);
    }

    // ============================================
    // ENCABEZADOS DE HIDRANTES
    // ============================================
    currentRow++;
    
    // Primera columna vacía
    worksheet.getCell(`A${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    // Encabezados de hidrantes con texto rotado
    if (formulario.hidrantes && formulario.hidrantes.length > 0) {
      formulario.hidrantes.forEach((hidrante, index) => {
        const col = String.fromCharCode(66 + index); // B, C, D, etc.
        const cell = worksheet.getCell(`${col}${currentRow}`);
        cell.value = hidrante.numero_hidrante;
        cell.font = { bold: true, size: 9 };
        cell.alignment = { horizontal: 'center', vertical: 'middle', textRotation: 90 };
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
    }
    worksheet.getRow(currentRow).height = 80;
    currentRow++;

    // ============================================
    // TÍTULO DE INSTRUCCIONES
    // ============================================
    worksheet.mergeCells(`A${currentRow}:${lastCol}${currentRow}`);
    const instrCell = worksheet.getCell(`A${currentRow}`);
    instrCell.value = 'INDICAR SI/NO SI REALIZÓ LA TAREA INDICADA - N/A=NO APLICA-OP=OPERATIVO-NOP=NO OPERATIVO';
    instrCell.font = { bold: true, size: 9 };
    instrCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    instrCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFFFF' }
    };
    instrCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.getRow(currentRow).height = 20;
    currentRow++;

    // ============================================
    // FUNCIÓN AUXILIAR PARA AGREGAR SECCIONES
    // ============================================
    const addSectionHeader = (title) => {
      worksheet.mergeCells(`A${currentRow}:${lastCol}${currentRow}`);
      const headerCell = worksheet.getCell(`A${currentRow}`);
      headerCell.value = title;
      headerCell.font = { bold: true, size: 10, italic: true };
      headerCell.alignment = { horizontal: 'left', vertical: 'middle' };
      headerCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' }
      };
      headerCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };
      worksheet.getRow(currentRow).height = 18;
      currentRow++;
    };

    const addChecklistItem = (label, fieldPath) => {
      const labelCell = worksheet.getCell(`A${currentRow}`);
      labelCell.value = label;
      labelCell.font = { size: 9 };
      labelCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
      labelCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      // Agregar valores para cada hidrante
      if (formulario.hidrantes) {
        formulario.hidrantes.forEach((hidrante, index) => {
          const col = String.fromCharCode(66 + index);
          const valueCell = worksheet.getCell(`${col}${currentRow}`);
          
          // Navegar por el path del campo (ej: "armario.lanza.estado")
          const parts = fieldPath.split('.');
          let value = hidrante;
          for (const part of parts) {
            value = value?.[part];
          }
          
          valueCell.value = value || '';
          valueCell.alignment = { horizontal: 'center', vertical: 'middle' };
          valueCell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
            bottom: { style: 'thin' }
          };
        });
      }

      worksheet.getRow(currentRow).height = 15;
      currentRow++;
    };

    // ============================================
    // SECCIÓN: ARMARIO
    // ============================================
    addSectionHeader('ARMARIO:');
    addChecklistItem('APERTURA/CIERRE NORMAL PUERTA', 'armario.apertura_cierre_normal_puerta.estado');
    addChecklistItem('LUBRICACIÓN BISAGRAS/CERRADURAS', 'armario.lubricacion_bisagras_cerraduras.estado');
    addChecklistItem('OBSERVÓ PUNTOS DE OXIDACIÓN (CORRIGIÓ)', 'armario.observo_puntos_oxidacion_corrigio.estado');
    addChecklistItem('LIMPIEZA GABINETE', 'armario.limpieza_gabinete.estado');
    addChecklistItem('LIMPIEZA/ELIMINACIÓN OBSTÁCULOS', 'armario.limpieza_eliminacion_obstaculo.estado');
    addChecklistItem('LANZA', 'armario.lanza.estado');
    addChecklistItem('LUBRICACIÓN PARTES MÓVILES LANZA', 'armario.lubricacion_partes_moviles_lanza.estado');
    addChecklistItem('SEÑALIZACIÓN', 'armario.señalizacion.estado');

    // ============================================
    // SECCIÓN: MANGUERAS Y LÍNEAS/FIERROS
    // ============================================
    addSectionHeader('MANGUERAS Y LÍNEAS/FIERROS');
    addChecklistItem('MANGUERAS X 2', 'mangueras_lineas.mangueras_x_2.estado');
    addChecklistItem('TENDIDO MANGUERAS RACORADO', 'mangueras_lineas.tendido_mangueras_racorado.estado');
    addChecklistItem('ESTADO ROSCAS/UNIONES LIMPIAS (CEPILLO)', 'mangueras_lineas.estado_roscas_uniones_limpias_cepillo.estado');
    addChecklistItem('DIÁMETRO MANGUERAS', 'mangueras_lineas.diametro_mangueras.estado');
    addChecklistItem('LONGITUD MANGUERAS', 'mangueras_lineas.longitud_mangueras.estado');
    addChecklistItem('MANGUERA TELA/GOMA', 'mangueras_lineas.manguera_tela_goma.estado');
    addChecklistItem('LLAVE STORZ', 'mangueras_lineas.llave_storz.estado');
    addChecklistItem('ACOPLA MANGUERA', 'mangueras_lineas.acopla_manguera.estado');

    // ============================================
    // SECCIÓN: HIDRANTE
    // ============================================
    addSectionHeader('HIDRANTE');
    addChecklistItem('DIÁMETRO ACOPLE', 'hidrante.diametro_acople.estado');
    addChecklistItem('TIPO ACOPLE', 'hidrante.tipo_acople.estado');
    addChecklistItem('OBSERVÓ PUNTOS DE OXIDACIÓN (CORRIGIÓ)', 'hidrante.observo_puntos_oxidacion_corrigio.estado');
    addChecklistItem('LIMPIEZA HIDRANTE', 'hidrante.limpieza_hidrante.estado');
    addChecklistItem('LIMPIEZA ROSCAS/UNIONES', 'hidrante.limpieza_roscas_uniones.estado');
    addChecklistItem('RECORRIDO MECANISMO APERTURA/CIERRE VÁLVULAS', 'hidrante.recorrido_mecanismo_apertura_cierre_valvulas.estado');
    addChecklistItem('LUBRICACIÓN PARTES MÓVILES', 'hidrante.lubricacion_partes_moviles.estado');
    addChecklistItem('DIÁMETRO HIDRANTE', 'hidrante.diametro_hidrante.estado');
    addChecklistItem('LLAVE HIDRANTE', 'hidrante.llave_hidrante.estado');
    addChecklistItem('ACOPLE CORRECTO LLAVE HIDRANTE', 'hidrante.acople_correcto_llave_hidrante.estado');

    // ============================================
    // SECCIÓN: VÁLVULAS PIV
    // ============================================
    addSectionHeader('VÁLVULAS PIV');
    addChecklistItem('OBSERVÓ PUNTOS DE OXIDACIÓN (CORRIGIÓ)', 'valvulas_piv.observo_puntos_oxidacion_corrigio.estado');
    addChecklistItem('LIMPIEZA VÁLVULA PIV', 'valvulas_piv.limpieza_valvula_piv.estado');
    addChecklistItem('RECORRIDO MECANISMO APERTURA/CIERRE', 'valvulas_piv.recorrido_mecanismo_apertura_cierre.estado');
    addChecklistItem('LUBRICACIÓN PARTES MÓVILES', 'valvulas_piv.lubricacion_partes_moviles.estado');
    addChecklistItem('LLAVE PIV', 'valvulas_piv.llave_piv.estado');
    addChecklistItem('ACOPLE CORRECTO LLAVE PIV', 'valvulas_piv.acople_correcto_llave_piv.estado');

    // ============================================
    // NORMA BASADA
    // ============================================
    worksheet.mergeCells(`A${currentRow}:${lastCol}${currentRow}`);
    const normaCell = worksheet.getCell(`A${currentRow}`);
    normaCell.value = 'BASADA NORMA NFPA-25 "Norma para la Inspección, Prueba, y Mantenimiento de Sistemas de Protección contra Incendios a Base de Agua"';
    normaCell.font = { bold: true, size: 8 };
    normaCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
    normaCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.getRow(currentRow).height = 18;
    currentRow++;

    // ============================================
    // COMENTARIOS
    // ============================================
    worksheet.mergeCells(`A${currentRow}:${lastCol}${currentRow}`);
    const comentarioHeader = worksheet.getCell(`A${currentRow}`);
    comentarioHeader.value = 'COMENTARIOS:';
    comentarioHeader.font = { bold: true, italic: true, size: 10 };
    comentarioHeader.alignment = { horizontal: 'left', vertical: 'middle' };
    comentarioHeader.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.getRow(currentRow).height = 18;
    currentRow++;

    worksheet.mergeCells(`A${currentRow}:${lastCol}${currentRow + 2}`);
    const comentarioCell = worksheet.getCell(`A${currentRow}`);
    comentarioCell.value = formulario.comentarios || '';
    comentarioCell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
    comentarioCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.getRow(currentRow).height = 60;
    currentRow += 3;

    // ============================================
    // FIRMAS (SIN LÍNEAS INTERNAS)
    // ============================================
    const firmaLabelRow = currentRow;
    const firmaEspacioRow = currentRow + 1;
    const firmaNombreRow = currentRow + 2;
    
    // Calcular tercios de columnas
    const tercio = Math.floor(totalColumns / 3);
    const col1Start = 0;
    const col1End = tercio - 1;
    const col2Start = tercio;
    const col2End = (tercio * 2) - 1;
    const col3Start = tercio * 2;
    const col3End = numHidrantes;

    // ETIQUETAS DE FIRMAS
    // FIRMA SUPERVISOR
    const supervisorEndCol = String.fromCharCode(65 + col1End);
    worksheet.mergeCells(`A${firmaLabelRow}:${supervisorEndCol}${firmaLabelRow}`);
    worksheet.getCell(`A${firmaLabelRow}`).value = 'FIRMA SUPERVISOR';
    worksheet.getCell(`A${firmaLabelRow}`).font = { bold: true, italic: true };
    worksheet.getCell(`A${firmaLabelRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`A${firmaLabelRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F0F0' }
    };
    worksheet.getCell(`A${firmaLabelRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    // FIRMA SUPERVISOR AREA
    const areaStartCol = String.fromCharCode(65 + col2Start);
    const areaEndCol = String.fromCharCode(65 + col2End);
    worksheet.mergeCells(`${areaStartCol}${firmaLabelRow}:${areaEndCol}${firmaLabelRow}`);
    worksheet.getCell(`${areaStartCol}${firmaLabelRow}`).value = 'SUPERVISOR AREA';
    worksheet.getCell(`${areaStartCol}${firmaLabelRow}`).font = { bold: true, italic: true };
    worksheet.getCell(`${areaStartCol}${firmaLabelRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`${areaStartCol}${firmaLabelRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F0F0' }
    };
    worksheet.getCell(`${areaStartCol}${firmaLabelRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    // FIRMA BRIGADA
    const brigadaStartCol = String.fromCharCode(65 + col3Start);
    worksheet.mergeCells(`${brigadaStartCol}${firmaLabelRow}:${lastCol}${firmaLabelRow}`);
    worksheet.getCell(`${brigadaStartCol}${firmaLabelRow}`).value = 'FIRMA BRIGADA';
    worksheet.getCell(`${brigadaStartCol}${firmaLabelRow}`).font = { bold: true, italic: true };
    worksheet.getCell(`${brigadaStartCol}${firmaLabelRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`${brigadaStartCol}${firmaLabelRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F0F0' }
    };
    worksheet.getCell(`${brigadaStartCol}${firmaLabelRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet.getRow(firmaLabelRow).height = 25;

    // ESPACIOS PARA FIRMAR - MERGE POR SECCIÓN (SIN LÍNEAS INTERNAS)
    // Sección 1: Supervisor
    worksheet.mergeCells(`A${firmaEspacioRow}:${supervisorEndCol}${firmaEspacioRow}`);
    worksheet.getCell(`A${firmaEspacioRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    // Sección 2: Supervisor Área
    worksheet.mergeCells(`${areaStartCol}${firmaEspacioRow}:${areaEndCol}${firmaEspacioRow}`);
    worksheet.getCell(`${areaStartCol}${firmaEspacioRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    // Sección 3: Brigada
    worksheet.mergeCells(`${brigadaStartCol}${firmaEspacioRow}:${lastCol}${firmaEspacioRow}`);
    worksheet.getCell(`${brigadaStartCol}${firmaEspacioRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet.getRow(firmaEspacioRow).height = 40;

    // NOMBRES DE QUIENES FIRMARON
    if (formulario.firmas?.supervisor) {
      worksheet.mergeCells(`A${firmaNombreRow}:${supervisorEndCol}${firmaNombreRow}`);
      worksheet.getCell(`A${firmaNombreRow}`).value = formulario.firmas.supervisor.nombre_usuario;
      worksheet.getCell(`A${firmaNombreRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell(`A${firmaNombreRow}`).font = { size: 9 };
    }

    if (formulario.firmas?.supervisor_area) {
      worksheet.mergeCells(`${areaStartCol}${firmaNombreRow}:${areaEndCol}${firmaNombreRow}`);
      worksheet.getCell(`${areaStartCol}${firmaNombreRow}`).value = formulario.firmas.supervisor_area.nombre_usuario;
      worksheet.getCell(`${areaStartCol}${firmaNombreRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell(`${areaStartCol}${firmaNombreRow}`).font = { size: 9 };
    }

    if (formulario.firmas?.brigada) {
      worksheet.mergeCells(`${brigadaStartCol}${firmaNombreRow}:${lastCol}${firmaNombreRow}`);
      worksheet.getCell(`${brigadaStartCol}${firmaNombreRow}`).value = formulario.firmas.brigada.nombre_usuario;
      worksheet.getCell(`${brigadaStartCol}${firmaNombreRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell(`${brigadaStartCol}${firmaNombreRow}`).font = { size: 9 };
    }

    worksheet.getRow(firmaNombreRow).height = 20;

    // ============================================
    // GENERAR Y ENVIAR ARCHIVO
    // ============================================
    const buffer = await workbook.xlsx.writeBuffer();
    
    const filename = `EMHMP-001_${formulario.id_tarea?.id_sector?.nombre_sector || 'formulario'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);

  } catch (error) {
    console.error('Error al generar Excel:', error);
    res.status(500).json({ error: 'Error al generar el archivo Excel' });
  }
}
}