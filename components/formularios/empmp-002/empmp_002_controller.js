import { empmp_002Service } from "./empmp_002_service.js";
import { procesarImagenBase64 } from "../imagenes/imageProcessor.js";
import ExcelJS from "exceljs";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export const empmp_002Controller = {
  async crear(req, res) {
    try {
      const carpeta = 'empmp_002';
      let datosFormulario = await procesarImagenBase64(req.body, carpeta);

      const registro = await empmp_002Service.crearEmpmp002(datosFormulario);
      res.status(201).json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.error('Error en crear empmp_002:', error);
    }
  },

  async obtenerTodos(req, res) {
    try {
      const registros = await empmp_002Service.obtenerTodos();
      res.json(registros);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const registro = await empmp_002Service.obtenerPorId(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro empmp_002 no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const registro = await empmp_002Service.actualizar(req.params.id, req.body);
      if (!registro) return res.status(404).json({ error: "Registro empmp_002 no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const registro = await empmp_002Service.eliminar(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro empmp_002 no encontrado" });
      res.json({ message: "Registro empmp_002 eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorIdTarea(req, res) {
    try {
      const registro = await empmp_002Service.obtenerPorIdTarea(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro no encontrado" });
      res.json(registro);
      console.log('Registro encontrado:', registro);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // ============================================
// FUNCIÓN PARA EXPORTAR A EXCEL CON LOGO - EMPMP-002
// ============================================

async exportarExcel(req, res) {
  try {
    const { id } = req.params;
    
    // Obtener el formulario con todos los datos poblados
    const formulario = await empmp_002Service.obtenerPorIdTarea(id);
    
    if (!formulario) {
      return res.status(404).json({ error: "Formulario no encontrado" });
    }

    // Crear nuevo workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('EMPMP-002');

    // Obtener número de pin racks
    const numPinRacks = formulario.pinRacks?.length || 0;
    const totalColumns = numPinRacks + 1; // +1 para la columna de descripciones

    // Configurar ancho de columnas
    worksheet.getColumn(1).width = 50; // Columna A (descripción)
    for (let i = 0; i < numPinRacks; i++) {
      worksheet.getColumn(i + 2).width = 12; // Columnas B, C, D, etc.
    }

    let currentRow = 1;

    // ============================================
    // ENCABEZADO PRINCIPAL
    // ============================================
    const lastCol = String.fromCharCode(65 + numPinRacks);
    worksheet.mergeCells(`A${currentRow}:${lastCol}${currentRow}`);
    const titleCell = worksheet.getCell(`A${currentRow}`);
    titleCell.value = 'ESTACIÓN DE MANGUERA (PIN RACKS) EMPMP-002';
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
      for (let i = 1; i <= numPinRacks; i++) {
        const col = String.fromCharCode(65 + i);
        const logoCell = worksheet.getCell(`${col}${currentRow}`);
        logoCell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
          bottom: { style: 'thin' }
        };
      }
      
      worksheet.getRow(currentRow).height = 20;
      currentRow++;
    };

    addInfoRowLeft('SECTOR:', formulario.id_tarea?.id_sector?.nombre_sector);
    addInfoRowLeft('INSPECTOR:', formulario.id_tarea?.responsable?.nombre_usuario);
    
    const fecha = new Date(formulario.fecha_inspeccion);
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
        const logoStartCol = Math.max(2, Math.ceil(numPinRacks * 0.3)); // Comienza alrededor del 30%
        const logoEndCol = Math.min(6, numPinRacks); // Máximo columna G (índice 6)
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
    // ENCABEZADOS DE PIN RACKS
    // ============================================
    currentRow++;
    
    // Primera columna vacía
    worksheet.getCell(`A${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    // Encabezados de pin racks con texto rotado
    if (formulario.pinRacks && formulario.pinRacks.length > 0) {
      formulario.pinRacks.forEach((pinRack, index) => {
        const col = String.fromCharCode(66 + index); // B, C, D, etc.
        const cell = worksheet.getCell(`${col}${currentRow}`);
        cell.value = pinRack.numero_pin_rack;
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
    instrCell.value = 'INDICAR SI/NO SI REALIZÓ LA TAREA INDICADA - N/A=NO APLICA- OP=OPERATIVO-NOP=NO OPERATIVO-OB=OBSERVACIÓN';
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

      // Agregar valores para cada pin rack
      if (formulario.pinRacks) {
        formulario.pinRacks.forEach((pinRack, index) => {
          const col = String.fromCharCode(66 + index);
          const valueCell = worksheet.getCell(`${col}${currentRow}`);
          
          // Navegar por el path del campo (ej: "gabinete.lanza.estado")
          const parts = fieldPath.split('.');
          let value = pinRack;
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
    // SECCIÓN: GABINETE
    // ============================================
    addSectionHeader('GABINETE');
    addChecklistItem('SEÑALIZACIÓN', 'gabinete.señalizacion.estado');
    addChecklistItem('VIDRIO', 'gabinete.vidrio.estado');
    addChecklistItem('LLAVE APRIETE DE MANGUERA', 'gabinete.llave_apriete_manguera.estado');
    addChecklistItem('APERTURA Y CIERRE NORMAL DE LA PUERTA', 'gabinete.apertura_cierre_normal_puerta.estado');
    addChecklistItem('LUBRICACIÓN DE BISAGRAS Y CERRADURAS', 'gabinete.lubricacion_bisagras_cerraduras.estado');
    addChecklistItem('OBSERVÓ PUNTOS DE OXIDACIÓN Y CORRIGIÓ', 'gabinete.observo_puntos_oxidacion_corrigio.estado');
    addChecklistItem('LIMPIEZA DE GABINETE, VIDRIOS', 'gabinete.limpieza_gabinete_vidrios.estado');
    addChecklistItem('REALIZO LIMPIEZA DE SALA Y ELIMINACIÓN DE OBTÁCULOS', 'gabinete.limpieza_eliminacion_obstaculo.estado');
    addChecklistItem('SE REPARÓ O CAMBIÓ GABINETE', 'gabinete.reparo_cambio_gabinete.estado');
    addChecklistItem('LANZA', 'gabinete.lanza.estado');
    addChecklistItem('CHIFLÓN', 'gabinete.chiflon.estado');

    // ============================================
    // SECCIÓN: MANGUERAS Y DIMENSIÓN
    // ============================================
    addSectionHeader('MANGUERAS Y DIMENSIÓN');
    addChecklistItem('MANGUERA', 'mangueras_dimension.manguera.estado');
    addChecklistItem('TIPO DE RACORADO', 'mangueras_dimension.tipo_racorado.estado');
    addChecklistItem('TENDIDO DE MANGUERAS Y RACORADO DE LAS MISMAS', 'mangueras_dimension.tendido_manguera_racorado.estado');
    addChecklistItem('ESTADO DE ROSCAS Y UNIONES (LIMPIAR CON CEPILLO)', 'mangueras_dimension.estado_roscas_uniones.estado');
    addChecklistItem('DESCONTAMINACIÓN DE POLVO Y LIMPIEZA DE LANZAS, CHIFLÓN', 'mangueras_dimension.descontaminacion_polvo_limpieza_lanza_chiflon.estado');
    addChecklistItem('DIÁMETRO DE MANGUERA', 'mangueras_dimension.diametro_manguera.estado');
    addChecklistItem('ACOPLA LA MANGUERA A LA VÁLVULA TEATRO', 'mangueras_dimension.acopla_manguera_valvula_teatro.estado');
    addChecklistItem('ACOPLA LA MANGUERA A LA LANZA', 'mangueras_dimension.acopla_manguera_lanza.estado');
    addChecklistItem('REEMPLAZO DE MANGUERA', 'mangueras_dimension.reemplazo_manguera.estado');
    addChecklistItem('MANGUERA TELA/GOMA', 'mangueras_dimension.manguera_tela_goma.estado');
    addChecklistItem('LONGITUD MANGUERA', 'mangueras_dimension.longitud_manguera.estado');

    // ============================================
    // SECCIÓN: PIN RACKS (VÁLVULAS TEATRO) Y DIMENSIONES
    // ============================================
    addSectionHeader('PIN RACKS (VÁLVULAS TEATRO) Y DIMENSIONES');
    addChecklistItem('OBSERVÓ PUNTO DE OXIDACIÓN Y CORRIGIÓ', 'pin_racks_valvulas_teatro_dimensiones.observo_puntos_oxidacion_corrigio.estado');
    addChecklistItem('LIMPIEZA DE PIN RACKS', 'pin_racks_valvulas_teatro_dimensiones.limpieza_pin_racks.estado');
    addChecklistItem('LIMPIEZA DE ROSCAS Y UNIONES (LIMPIAR CON CEPILLO)', 'pin_racks_valvulas_teatro_dimensiones.limpieza_roscas_uniones.estado');
    addChecklistItem('RECORRIDO DE MECANISMO DE APERTURA Y CIERRE DE VÁLVULAS', 'pin_racks_valvulas_teatro_dimensiones.recorrido_mecanismo_apertura_cierre_valvulas.estado');
    addChecklistItem('LUBRICACIÓN DE PARTES MÓVILES', 'pin_racks_valvulas_teatro_dimensiones.lubricacion_partes_moviles.estado');
    addChecklistItem('REEMPLAZO DE ASIENTO DE VÁLVULA', 'pin_racks_valvulas_teatro_dimensiones.reemplazo_asiento_valvula.estado');
    addChecklistItem('DIÁMETRO VÁLVULA INGRESO', 'pin_racks_valvulas_teatro_dimensiones.diametro_valvula_ingreso.estado');
    addChecklistItem('DIÁMETRO VÁLVULA SALIDA', 'pin_racks_valvulas_teatro_dimensiones.diametro_valvula_salida.estado');
    addChecklistItem('PRUEBA DE FUNCIONAMIENTO', 'pin_racks_valvulas_teatro_dimensiones.prueba_funcionamiento.estado');

    // ============================================
    // NORMA BASADA
    // ============================================
    worksheet.mergeCells(`A${currentRow}:${lastCol}${currentRow}`);
    const normaCell = worksheet.getCell(`A${currentRow}`);
    normaCell.value = 'NOTA: PAUTA, NFPA-25 "Norma para la Inspección, Prueba, y Mantenimiento de Sistemas de Protección contra Incendios a Base de Agua"';
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
    comentarioHeader.value = 'COMETARIOS:';
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
    const col3End = numPinRacks;

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
    
    const filename = `EMPMP-002_${formulario.id_tarea?.id_sector?.nombre_sector || 'formulario'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);

  } catch (error) {
    console.error('Error al generar Excel:', error);
    res.status(500).json({ error: 'Error al generar el archivo Excel' });
  }
}
};