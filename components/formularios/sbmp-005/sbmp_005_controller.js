import { sbmp_005Service } from "./sbmp_005_service.js";
import { procesarImagenBase64 } from "../imagenes/imageProcessor.js";

import ExcelJS from "exceljs";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const sbmp_005Controller = {
  async crear(req, res) {
    try {
      const carpeta = 'sbmp_005';
      let datosFormulario = await procesarImagenBase64(req.body, carpeta);
      
      const registro = await sbmp_005Service.crearSbmp005(datosFormulario);
      res.status(201).json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.error('Error en crear sbmp_005:', error);
    }
  },

  async obtenerTodos(req, res) {
    try {
      const registros = await sbmp_005Service.obtenerTodos();
      res.json(registros);
    } catch (error) {
      console.error('Error en obtener sbmp_005:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const registro = await sbmp_005Service.actualizar(req.params.id, req.body);
      if (!registro) return res.status(404).json({ error: "Registro sbmp_005 no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const registro = await sbmp_005Service.eliminar(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro sbmp_005 no encontrado" });
      res.json({ message: "Registro sbmp_005 eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
  try {
    const registro = await sbmp_005Service.obtenerPorId(req.params.id);
    if (!registro) return res.status(404).json({ error: "Registro sbmp_005 no encontrado" });
    res.json(registro);
    console.log('Registro encontrado:', registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

async obtenerPorIdTarea(req, res) {
  try {
    const registro = await sbmp_005Service.obtenerPorIdTarea(req.params.id);
    if (!registro) return res.status(404).json({ error: "Registro sbmp_005 no encontrado" });
    res.json(registro);
    console.log('Registro encontrado:', registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

// ============================================
// FUNCIÓN PARA EXPORTAR SBMP-005 A EXCEL CON LOGO
// ============================================

async exportarExcel(req, res) {
  try {
    const { id } = req.params;
    
    // Obtener el formulario con todos los datos poblados
    const formulario = await sbmp_005Service.obtenerPorIdTarea(id);
    
    if (!formulario) {
      return res.status(404).json({ error: "Formulario no encontrado" });
    }

    // Crear nuevo workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('SBMP-005');

    // Configurar ancho de columnas
    worksheet.columns = [
      { width: 60 },  // Columna A (descripción)
      { width: 15 },  // Columna B (respuesta)
      { width: 25 },  // Columna C (nivel/extra)
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

        // Insertar logo en la parte derecha (columnas B-C, filas 1-6)
        worksheet.addImage(logoId, {
          tl: { col: 1, row: 0 },
          br: { col: 3, row: 6 },
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
    worksheet.getRow(1).height = 30;

    // Título principal
    worksheet.mergeCells('A1:A1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'SALAS DE BOMBAS - SBMP-005';
    titleCell.font = { bold: true, size: 16, italic: true };
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

    // Bordes para celdas del logo
    for (let row = 1; row <= 6; row++) {
      ['B', 'C'].forEach(col => {
        worksheet.getCell(`${col}${row}`).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
          bottom: { style: 'thin' }
        };
      });
    }

    // ============================================
    // INFORMACIÓN DE LA TAREA
    // ============================================
    let currentRow = 2;
    
    const addInfoRow = (label, value, mergeColumns = true) => {
      const labelCell = worksheet.getCell(`A${currentRow}`);
      labelCell.value = label;
      labelCell.font = { bold: true, italic: true };
      labelCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' }
      };
      labelCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      currentRow++;
    };

    addInfoRow('SECTOR:');
    addInfoRow('INSPECTOR:');
    addInfoRow('DURACIÓN DE LA TAREA:');
    addInfoRow('FECHA:');
    addInfoRow('HORA:');
    addInfoRow('FIRMA INSPECTOR');
    
    worksheet.getRow(7).height = 30;
    currentRow = 8;

    // ============================================
    // TÍTULO DE INSTRUCCIONES
    // ============================================
    worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
    const instruccionesCell = worksheet.getCell(`A${currentRow}`);
    instruccionesCell.value = 'INDICAR SI/NO SI REALIZO LA TAREA INDICADA - N/A=NO APLICA-OP=OPERATIVO-NOP=NO OPERATIVO-OB=OBSERVACIÓN';
    instruccionesCell.font = { bold: true, size: 9 };
    instruccionesCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    instruccionesCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFFFF' }
    };
    instruccionesCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.getRow(currentRow).height = 25;
    currentRow++;

    // Obtener el checklist (primer elemento del array)
    const checklist = formulario.checklist?.[0] || {};

    // ============================================
    // FUNCIÓN AUXILIAR PARA AGREGAR SECCIONES
    // ============================================
    const addSeccionHeader = (titulo) => {
      worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
      const headerCell = worksheet.getCell(`A${currentRow}`);
      headerCell.value = titulo;
      headerCell.font = { bold: true, size: 11 };
      headerCell.alignment = { horizontal: 'center', vertical: 'middle' };
      headerCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      };
      headerCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };
      currentRow++;
    };

    const addCheckItem = (label, valor, nivel = null) => {
      // Columna A: Descripción
      const labelCell = worksheet.getCell(`A${currentRow}`);
      labelCell.value = label;
      labelCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
      labelCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      // Columna B: Respuesta
      const valorCell = worksheet.getCell(`B${currentRow}`);
      valorCell.value = valor || '';
      valorCell.alignment = { horizontal: 'center', vertical: 'middle' };
      valorCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      // Columna C: Nivel (si aplica)
      const nivelCell = worksheet.getCell(`C${currentRow}`);
      if (nivel !== null) {
        nivelCell.value = `NIVEL: ${nivel || ''}`;
        nivelCell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
      nivelCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      currentRow++;
    };

    // ============================================
    // CUBA CONTENEDORA DE AGUA
    // ============================================
    addSeccionHeader('CUBA CONTENEDORA DE AGUA');
    addCheckItem(
      'CONTROLAR HE INDICAR NIVEL DE AGUA',
      checklist.cuba_contenedora_agua?.controlar_indicar_nivel_agua?.estado,
      checklist.cuba_contenedora_agua?.nivel
    );
    addCheckItem(
      'OBSERVO PUNTOS DE OXIDACION Y CORRIGIO ?',
      checklist.cuba_contenedora_agua?.observo_puntos_oxidacion_corrigio?.estado
    );
    addCheckItem(
      'VERIFICAR Y ELIMINAR PUNTOS DE FILTRACIONES',
      checklist.cuba_contenedora_agua?.verificar_eliminar_puntos_filtraciones?.estado
    );

    // ============================================
    // VÁLVULA DE ASPIRACIÓN
    // ============================================
    addSeccionHeader('VALVULA DE ASPIRACION');
    addCheckItem(
      'REALIZO RECORRIDO MECANICO DE LA VALVULA APERTURA/CIERRE',
      checklist.valvula_aspiracion?.recorrido_mecanico_valvula_apertura_cierre?.estado
    );
    addCheckItem(
      'REALIZO ENGRASE O LUBRICACION DE PARTES MOVILES',
      checklist.valvula_aspiracion?.lubricacion_partes_moviles?.estado
    );
    addCheckItem(
      'OBSERVO PUNTOS DE OXIDACION Y CORRIGIO?',
      checklist.valvula_aspiracion?.observo_puntos_oxidacion_corrigio?.estado
    );
    addCheckItem(
      'ELIMINAR FILTRACIONES SULFATACION',
      checklist.valvula_aspiracion?.eliminar_filtraciones_sulfatacion?.estado
    );
    addCheckItem(
      'CONTROLAR ASIENTO Y CORTE TOTAL DE FLUIDO',
      checklist.valvula_aspiracion?.controlar_asiento_corte_total_fluido?.estado
    );
    addCheckItem(
      'RETIRAR CADENAS, LUBRICAR Y COLOCAR',
      checklist.valvula_aspiracion?.retirar_cadenas_lubricar_colocar?.estado
    );
    addCheckItem(
      'LA VALVULA DE ASPIRACION ESTA ABIERTA',
      checklist.valvula_aspiracion?.valvula_descarga_abierta?.estado
    );

    // ============================================
    // VÁLVULAS DE DESCARGA
    // ============================================
    addSeccionHeader('VALVULAS DE DESCARGA');
    addCheckItem(
      'REALIZO RECORRIDO MECANICO DE LA VALVULA APERTURA/CIERRE',
      checklist.valvulas_recirculacion?.realizo_recorrido_mecanico_valvula_recirculacion?.estado
    );
    addCheckItem(
      'REALIZO ENGRASE O LUBRICACION DE PARTES MOVILES',
      checklist.valvulas_recirculacion?.engrase_lubricacion_partes_moviles?.estado
    );
    addCheckItem(
      'OBSERVO PUNTOS DE OXIDACION Y CORRIGIO?',
      checklist.valvulas_recirculacion?.observo_puntos_oxidacion_corrigio?.estado
    );
    addCheckItem(
      'ELIMINAR FILTRACIONES SULFATACION',
      checklist.valvulas_recirculacion?.eliminar_filtraciones_sulfatacion?.estado
    );
    addCheckItem(
      'CONTROLAR ASIENTO Y CORTE TOTAL DE FLUIDO',
      checklist.valvulas_recirculacion?.controlar_asiento_corte_total_fluido?.estado
    );
    addCheckItem(
      'RETIRAR CADENAS, LUBRICAR Y COLOCAR',
      checklist.valvulas_recirculacion?.retirar_cadenas_lubricar_colocar?.estado
    );
    addCheckItem(
      'LA VALVULA DE DESCARGA ESTA ABIERTA',
      checklist.valvulas_recirculacion?.valvulas_recirculacion_queda_cerrada?.estado
    );

    // ============================================
    // VÁLVULAS DE RECIRCULACIÓN
    // ============================================
    addSeccionHeader('VALVULAS DE RECIRCULACION');
    addCheckItem(
      'REALIZO RECORRIDO MECANICO DE LA VALVULA DE RECIRCULACION',
      checklist.valvulas_recirculacion?.realizo_recorrido_mecanico_valvula_recirculacion?.estado
    );
    addCheckItem(
      'REALIZO ENGRASE O LUBRICACION DE PARTES MOVILES',
      checklist.valvulas_recirculacion?.engrase_lubricacion_partes_moviles?.estado
    );
    addCheckItem(
      'OBSERVO PUNTOS DE OXIDACION Y CORRIGIO?',
      checklist.valvulas_recirculacion?.observo_puntos_oxidacion_corrigio?.estado
    );
    addCheckItem(
      'ELIMINAR FILTRACIONES SULFATACION',
      checklist.valvulas_recirculacion?.eliminar_filtraciones_sulfatacion?.estado
    );
    addCheckItem(
      'CONTROLAR ASIENTO Y CORTE TOTAL DE FLUIDO',
      checklist.valvulas_recirculacion?.controlar_asiento_corte_total_fluido?.estado
    );
    addCheckItem(
      'RETIRAR CADENAS, LUBRICAR Y COLOCAR',
      checklist.valvulas_recirculacion?.retirar_cadenas_lubricar_colocar?.estado
    );
    addCheckItem(
      'VALVULA DE RECIRCULACION QUEDA CERRADA',
      checklist.valvulas_recirculacion?.valvulas_recirculacion_queda_cerrada?.estado
    );

    // ============================================
    // VÁLVULAS DE DESCARGA Y ALIVIO
    // ============================================
    addSeccionHeader('VALVULAS DE DESCARGA Y ALIVIO');
    addCheckItem(
      'OBSERVO PUNTOS DE OXIDACION Y CORRIGIO?',
      checklist.valvula_descarga_alivio?.observo_puntos_oxidacion_corrigio?.estado
    );
    addCheckItem(
      'ELIMINAR FILTRACIONES SULFATACION',
      checklist.valvula_descarga_alivio?.eliminar_filtraciones_sulfatacion?.estado
    );
    addCheckItem(
      'VERIFICAR SI LA VALVULA DESCARGA CORRECTAMENTE',
      checklist.valvula_descarga_alivio?.verificar_valvula_descarga_correctamente?.estado
    );

    // ============================================
    // BOMBA JOCKEY
    // ============================================
    addSeccionHeader('BOMBA JOCKEY');
    addCheckItem(
      'OBSERVO PUNTOS DE OXIDACION Y CORRIGIO',
      checklist.bomba_jockey?.observo_puntos_oxidacion_corrigio?.estado
    );
    addCheckItem(
      'COMPROBAR APERTURA Y CIERRE DE VALVULA DE ASPIRACION',
      checklist.bomba_jockey?.comprobar_apertura_cierre_valvula_aspiracion?.estado
    );
    addCheckItem(
      'COMPROBAR APERTURA Y CIERRE DE VALVULA DE DESCARGA',
      checklist.bomba_jockey?.comprobar_apertura_cierre_valvula_descarga?.estado
    );

    // ============================================
    // ELECTROBOMBA
    // ============================================
    addSeccionHeader('ELECTROBOMBA');
    addCheckItem(
      'OBSERVO PUNTOS DE OXIDACION Y CORRIGIO',
      checklist.electrobomba?.observo_puntos_oxidacion_corrigio?.estado
    );
    addCheckItem(
      'VERIFICAR GIRO LIBRE DE LA TURBINA',
      checklist.electrobomba?.verificar_giro_libre_turbina?.estado
    );
    addCheckItem(
      'COMPROBAR APERTURA Y CIERRE DE VALVULA DE ASPIRACION',
      checklist.electrobomba?.comprobar_apertura_cierre_valvula_aspiracion?.estado
    );
    addCheckItem(
      'COMPROBAR APERTURA Y CIERRE DE VALVUL DE DESCARGA',
      checklist.electrobomba?.comprobar_apertura_cierre_valvula_descarga?.estado
    );

    // ============================================
    // MOTO BOMBA
    // ============================================
    addSeccionHeader('MOTO BOMBA');
    addCheckItem(
      'VERIFICAR ESTADO FISICO DE LA BOMBA',
      checklist.moto_bomba?.verificar_estado_fisico_bomba?.estado
    );
    addCheckItem(
      'ABRIR Y CERRAR VALVULAS DE ASPIRACION',
      checklist.moto_bomba?.abrir_cerrar_valvula_aspiracion?.estado
    );
    addCheckItem(
      'OBSERVO PUNTOS DE OXIDACION Y CORRIGIO',
      checklist.moto_bomba?.observo_puntos_oxidacion_corrigio?.estado
    );
    addCheckItem(
      'ABRIR Y CERRAR VALVULAS DE DESCARGA',
      checklist.moto_bomba?.abrir_cerrar_valvula_descarga?.estado
    );

    // ============================================
    // TRACING
    // ============================================
    addSeccionHeader('TRACING');
    addCheckItem(
      'LOS TRACING ESTAN ENERGIZADOS',
      checklist.tracing?.tracing_energizados?.estado
    );
    addCheckItem(
      'LOS TRACING ESTAN RECUBIERTOS',
      checklist.tracing?.tracing_recubiertos?.estado
    );
    addCheckItem(
      'LOS TRACING CUBREN LA PARTES CRITICAS DE CANERIA',
      checklist.tracing?.tracing_cubre_parte_critica_cañeria?.estado
    );
    addCheckItem(
      'TRACING POSEE TEMP',
      checklist.tracing?.tracing_posee_temp?.estado
    );
    addCheckItem(
      'LOS TRACING SE ENCUENTRA RECUBIERTOS',
      checklist.tracing?.tracing_se_encuentra_recubierto?.estado
    );

    // ============================================
    // ORDEN Y LIMPIEZA
    // ============================================
    addSeccionHeader('ORDEN Y LIMPIEZA');
    addCheckItem(
      'REALIZO ORDEN Y LIMPIEZA DE SALA',
      checklist.orden_limpieza?.realizo_orden_limpieza_sala?.estado
    );
    addCheckItem(
      'REALIZO ELIMINACION DE OBTACULOS DEL ENTORNO',
      checklist.orden_limpieza?.realizo_eliminacion_obstaculos?.estado
    );

    // ============================================
    // NORMA BASADA
    // ============================================
    worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
    const normaCell = worksheet.getCell(`A${currentRow}`);
    normaCell.value = 'NOTA : PAUTA BASADA NORMA NFPA-25: "Norma para la Inspección, Prueba, y Mantenimiento de Sistemas de Protección contra Incendios a Base de Agua"';
    normaCell.font = { bold: true, size: 9 };
    normaCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    normaCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFFFF' }
    };
    normaCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.getRow(currentRow).height = 25;
    currentRow++;

    // ============================================
    // COMENTARIOS
    // ============================================
    worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
    const comentarioHeader = worksheet.getCell(`A${currentRow}`);
    comentarioHeader.value = 'COMETARIOS:';
    comentarioHeader.font = { bold: true, italic: true };
    comentarioHeader.alignment = { horizontal: 'left', vertical: 'middle' };
    comentarioHeader.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFFFF' }
    };
    comentarioHeader.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    currentRow++;

    worksheet.mergeCells(`A${currentRow}:C${currentRow + 4}`);
    const comentarioCell = worksheet.getCell(`A${currentRow}`);
    comentarioCell.value = formulario.comentarios || '';
    comentarioCell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
    comentarioCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet.getRow(currentRow).height = 100;
    currentRow += 5;

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
      fgColor: { argb: 'FFFFFFFF' }
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
      fgColor: { argb: 'FFFFFFFF' }
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
      fgColor: { argb: 'FFFFFFFF' }
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
    
    const filename = `SBMP-005_${formulario.id_tarea?.id_sector?.nombre_sector || 'formulario'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);

  } catch (error) {
    console.error('Error al generar Excel:', error);
    res.status(500).json({ error: 'Error al generar el archivo Excel' });
  }
}


};