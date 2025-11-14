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
// FUNCIÓN PARA EXPORTAR SBMP-005 A EXCEL CON 2 HOJAS
// ============================================

async exportarExcelCompleto(req, res) {
  try {
    const { id } = req.params;
    
    // Obtener el formulario con todos los datos poblados
    const formulario = await sbmp_005Service.obtenerPorIdTarea(id);
    
    if (!formulario) {
      return res.status(404).json({ error: "Formulario no encontrado" });
    }

    // Crear nuevo workbook
    const workbook = new ExcelJS.Workbook();

    // ============================================
    // HOJA 1: CHECKLIST PRINCIPAL
    // ============================================
    const worksheet1 = workbook.addWorksheet('SBMP-005 Hoja 1');

    // Configurar ancho de columnas
    worksheet1.columns = [
      { width: 60 },  // Columna A (descripción)
      { width: 15 },  // Columna B (respuesta)
      { width: 25 },  // Columna C (nivel/extra)
    ];

    // ============================================
    // AGREGAR LOGO HOJA 1
    // ============================================
    try {
      const logoPath = path.join(__dirname, '..', '..', 'logo', 'LogoChiconi.webp');
      
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        
        const logoId = workbook.addImage({
          buffer: logoBuffer,
          extension: 'png',
        });

        worksheet1.addImage(logoId, {
          tl: { col: 1, row: 0 },
          br: { col: 3, row: 6 },
          editAs: 'oneCell'
        });
        
        console.log('✅ Logo agregado exitosamente en Hoja 1');
      }
    } catch (logoError) {
      console.warn('❌ Error al cargar el logo:', logoError.message);
    }

    // ============================================
    // ENCABEZADO HOJA 1
    // ============================================
    let currentRow = 1;
    worksheet1.getRow(1).height = 30;

    // Título principal
    worksheet1.mergeCells('A1:A1');
    const titleCell = worksheet1.getCell('A1');
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
        worksheet1.getCell(`${col}${row}`).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
          bottom: { style: 'thin' }
        };
      });
    }

    currentRow = 2;
    
    const addInfoRow = (label, value) => {
      const labelCell = worksheet1.getCell(`A${currentRow}`);
      labelCell.value = `${label} ${value || ''}`;
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

    addInfoRow('SECTOR:', formulario.id_tarea?.id_sector?.nombre_sector);
    addInfoRow('INSPECTOR:', formulario.id_tarea?.responsable?.nombre_usuario);
    addInfoRow('DURACIÓN DE LA TAREA:', formulario.id_tarea?.id_hh);
    addInfoRow('FECHA:', new Date(formulario.fecha_inspeccion).toLocaleDateString('es-ES'));
    
    // Calcular hora desde ultima_modificacion de la tarea
    const fechaTarea = new Date(formulario.id_tarea?.ultima_modificacion || formulario.fecha_inspeccion);
    const hora = `${fechaTarea.getHours().toString().padStart(2, '0')}:${fechaTarea.getMinutes().toString().padStart(2, '0')}`;
    addInfoRow('HORA:', hora);
    addInfoRow('FIRMA INSPECTOR', '');
    
    worksheet1.getRow(7).height = 30;
    currentRow = 8;

    // Instrucciones
    worksheet1.mergeCells(`A${currentRow}:C${currentRow}`);
    const instruccionesCell = worksheet1.getCell(`A${currentRow}`);
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
    worksheet1.getRow(currentRow).height = 25;
    currentRow++;

    const checklist = formulario.checklist?.[0] || {};

    const addSeccionHeader = (titulo) => {
      worksheet1.mergeCells(`A${currentRow}:C${currentRow}`);
      const headerCell = worksheet1.getCell(`A${currentRow}`);
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
      const labelCell = worksheet1.getCell(`A${currentRow}`);
      labelCell.value = label;
      labelCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
      labelCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      const valorCell = worksheet1.getCell(`B${currentRow}`);
      valorCell.value = valor || '';
      valorCell.alignment = { horizontal: 'center', vertical: 'middle' };
      valorCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      const nivelCell = worksheet1.getCell(`C${currentRow}`);
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

    // CUBA CONTENEDORA DE AGUA
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

    // VÁLVULA DE ASPIRACIÓN
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

    // VÁLVULAS DE DESCARGA
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

    // Continuar con las demás secciones...
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

    addSeccionHeader('ORDEN Y LIMPIEZA');
    addCheckItem(
      'REALIZO ORDEN Y LIMPIEZA DE SALA',
      checklist.orden_limpieza?.realizo_orden_limpieza_sala?.estado
    );
    addCheckItem(
      'REALIZO ELIMINACION DE OBTACULOS DEL ENTORNO',
      checklist.orden_limpieza?.realizo_eliminacion_obstaculos?.estado
    );

    // NORMA BASADA
    worksheet1.mergeCells(`A${currentRow}:C${currentRow}`);
    const normaCell = worksheet1.getCell(`A${currentRow}`);
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
    worksheet1.getRow(currentRow).height = 25;
    currentRow++;

    // COMENTARIOS
    worksheet1.mergeCells(`A${currentRow}:C${currentRow}`);
    const comentarioHeader = worksheet1.getCell(`A${currentRow}`);
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

    worksheet1.mergeCells(`A${currentRow}:C${currentRow + 4}`);
    const comentarioCell = worksheet1.getCell(`A${currentRow}`);
    comentarioCell.value = formulario.comentarios || '';
    comentarioCell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
    comentarioCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet1.getRow(currentRow).height = 100;
    currentRow += 5;

    // FIRMAS
    const firmaRow = currentRow;
    
    worksheet1.getCell(`A${firmaRow}`).value = 'FIRMA SUPERVISOR';
    worksheet1.getCell(`A${firmaRow}`).font = { bold: true, italic: true };
    worksheet1.getCell(`A${firmaRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet1.getCell(`A${firmaRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFFFF' }
    };
    worksheet1.getCell(`A${firmaRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet1.getCell(`B${firmaRow}`).value = 'FIRMA SUPERVISOR AREA';
    worksheet1.getCell(`B${firmaRow}`).font = { bold: true, italic: true };
    worksheet1.getCell(`B${firmaRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet1.getCell(`B${firmaRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFFFF' }
    };
    worksheet1.getCell(`B${firmaRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet1.getCell(`C${firmaRow}`).value = 'FIRMA BRIGADA';
    worksheet1.getCell(`C${firmaRow}`).font = { bold: true, italic: true };
    worksheet1.getCell(`C${firmaRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet1.getCell(`C${firmaRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFFFF' }
    };
    worksheet1.getCell(`C${firmaRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet1.getRow(firmaRow).height = 25;

    currentRow++;
    ['A', 'B', 'C'].forEach(col => {
      worksheet1.getCell(`${col}${currentRow}`).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };
    });
    worksheet1.getRow(currentRow).height = 40;

    currentRow++;
    if (formulario.firmas?.supervisor) {
      worksheet1.getCell(`A${currentRow}`).value = formulario.firmas.supervisor.nombre_usuario;
      worksheet1.getCell(`A${currentRow}`).alignment = { horizontal: 'center' };
    }
    if (formulario.firmas?.supervisor_area) {
      worksheet1.getCell(`B${currentRow}`).value = formulario.firmas.supervisor_area.nombre_usuario;
      worksheet1.getCell(`B${currentRow}`).alignment = { horizontal: 'center' };
    }
    if (formulario.firmas?.brigada) {
      worksheet1.getCell(`C${currentRow}`).value = formulario.firmas.brigada.nombre_usuario;
      worksheet1.getCell(`C${currentRow}`).alignment = { horizontal: 'center' };
    }

    // ============================================
    // HOJA 2: ITEMS A CONTROLAR
    // ============================================
    const worksheet2 = workbook.addWorksheet('SBMP-005 Hoja 2');

    worksheet2.columns = [
      { width: 60 },  // Columna A
      { width: 15 },  // Columna B
      { width: 25 },  // Columna C
    ];

    let row2 = 1;

    // Logo Hoja 2
    try {
      const logoPath = path.join(__dirname, '..', '..', 'logo', 'LogoChiconi.webp');
      
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        
        const logoId2 = workbook.addImage({
          buffer: logoBuffer,
          extension: 'png',
        });

        worksheet2.addImage(logoId2, {
          tl: { col: 1, row: 0 },
          br: { col: 3, row: 6 },
          editAs: 'oneCell'
        });
      }
    } catch (logoError) {
      console.warn('❌ Error al cargar el logo en Hoja 2:', logoError.message);
    }

    // Encabezado Hoja 2
    worksheet2.getRow(1).height = 30;
    worksheet2.mergeCells('A1:A1');
    const titleCell2 = worksheet2.getCell('A1');
    titleCell2.value = 'ITEMS A CONTROLAR - SBMP-005';
    titleCell2.font = { bold: true, size: 16, italic: true };
    titleCell2.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell2.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFFFF' }
    };
    titleCell2.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    for (let r = 1; r <= 6; r++) {
      ['B', 'C'].forEach(col => {
        worksheet2.getCell(`${col}${r}`).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
          bottom: { style: 'thin' }
        };
      });
    }

    row2 = 2;

    const addInfoRow2 = (label, value) => {
      const labelCell = worksheet2.getCell(`A${row2}`);
      labelCell.value = `${label} ${value || ''}`;
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
      
      // Agregar bordes a las demás celdas de la fila (para el logo)
      ['B', 'C'].forEach(col => {
        const cell = worksheet2.getCell(`${col}${row2}`);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
          bottom: { style: 'thin' }
        };
      });
      
      row2++;
    };

    addInfoRow2('SECTOR:', formulario.id_tarea?.id_sector?.nombre_sector);
    addInfoRow2('INSPECTOR:', formulario.id_tarea?.responsable?.nombre_usuario);
    addInfoRow2('DURACIÓN DE LA TAREA:', formulario.id_tarea?.id_hh);
    addInfoRow2('FECHA:', new Date(formulario.fecha_inspeccion).toLocaleDateString('es-ES'));
    
    // Calcular hora desde ultima_modificacion de la tarea
    const fechaTarea2 = new Date(formulario.id_tarea?.ultima_modificacion || formulario.fecha_inspeccion);
    const hora2 = `${fechaTarea2.getHours().toString().padStart(2, '0')}:${fechaTarea2.getMinutes().toString().padStart(2, '0')}`;
    addInfoRow2('HORA:', hora2);
    addInfoRow2('FIRMA INSPECTOR', '');
    
    worksheet2.getRow(7).height = 30;
    row2 = 8;

    // Instrucciones
    worksheet2.mergeCells(`A${row2}:C${row2}`);
    const instrCell2 = worksheet2.getCell(`A${row2}`);
    instrCell2.value = 'INDICAR SI/NO SI REALIZO LA TAREA INDICADA - N/A=NO APLICA-OP=OPERATIVO-NOP=NO OPERATIVO-OB=OBSERVACIÓN';
    instrCell2.font = { bold: true, size: 9 };
    instrCell2.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    instrCell2.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFFFF' }
    };
    instrCell2.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet2.getRow(row2).height = 25;
    row2++;

    const items = checklist.items_a_controlar || {};

    const addSeccionHeader2 = (titulo) => {
      worksheet2.mergeCells(`A${row2}:C${row2}`);
      const headerCell = worksheet2.getCell(`A${row2}`);
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
      row2++;
    };

    const addCheckItem2 = (label, valor, extra = null) => {
      const labelCell = worksheet2.getCell(`A${row2}`);
      labelCell.value = label;
      labelCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
      labelCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      const valorCell = worksheet2.getCell(`B${row2}`);
      valorCell.value = valor || '';
      valorCell.alignment = { horizontal: 'center', vertical: 'middle' };
      valorCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      const extraCell = worksheet2.getCell(`C${row2}`);
      if (extra !== null) {
        extraCell.value = extra || '';
        extraCell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
      extraCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      row2++;
    };

    // ============================================
    // CONTENIDO HOJA 2: ITEMS A CONTROLAR
    // ============================================
    addSeccionHeader2('ITEMS A CONTROLAR');

    addCheckItem2(
      'CONTROLÓ TEMPERATURA AMBIENTE',
      items.controlo_temperatura_ambiente?.estado
    );
    addCheckItem2(
      'TRAMPAS DE VENTILACIÓN DESPEJADAS',
      items.trampas_ventilacion_despejadas?.estado
    );
    addCheckItem2(
      'FILTRACIONES DE AGUA EN TUBERÍAS ELIMINADAS',
      items.filtraciones_agua_tuberias_eliminadas?.estado
    );
    addCheckItem2(
      'SEÑALES LUMINOSAS DEL TABLERO DE MANDO',
      items.señales_luminosas_tablero_mando?.estado
    );
    addCheckItem2(
      'PILOTOS DE PRESENCIA ELÉCTRICA FUNCIONANDO',
      items.pilotos_presencia_electrica_funcionando?.estado
    );
    addCheckItem2(
      'NIVEL DE ACEITE DEL CÁRTER',
      items.nivel_aceite_carter?.estado
    );
    addCheckItem2(
      'NIVEL TK LLENO',
      items.nivel_tk_lleno?.estado
    );
    addCheckItem2(
      'VERIFICÓ Y ELIMINÓ RESTOS DE ÓXIDOS DEL ESTADO TK',
      items.verifico_elimino_restos_oxidos_estado_tk?.estado
    );
    addCheckItem2(
      'LECTURA DE VOLTAJE DE BATERÍAS',
      items.lectura_voltaje_baterias?.estado,
      items.bat_1 && items.bat_2 ? `BAT 1: ${items.bat_1} | BAT 2: ${items.bat_2}` : null
    );
    addCheckItem2(
      'NIVEL DE AGUA DE REFRIGERACIÓN',
      items.nivel_agua_refrigeracion?.estado
    );
    addCheckItem2(
      'ELIMINÓ SULFATACIÓN DE BORNES DE BATERÍAS',
      items.elimino_sulfatacion_bornes_baterias?.estado
    );
    addCheckItem2(
      'CONTROLÓ ENERGIZACIÓN CABLE CALEFACTOR NORMAL Y EFECTIVA',
      items.controlo_energizacion_cable_calefactor_normal_efectiva?.estado
    );
    addCheckItem2(
      'COMPROBAR Y CORREGIR FUGAS DE ESCAPE',
      items.comprobar_corregir_fugas_escape?.estado
    );
    addCheckItem2(
      'COMPROBAR Y CORREGIR CARGA DE BATERÍAS',
      items.comprobar_corregir_carga_baterias?.estado
    );
    addCheckItem2(
      'ABRIÓ Y CERRÓ VÁLVULAS DE DRENAJE (QUEDÓ CERRADA)',
      items.abrio_cerro_valvulas_drenaje_quedo_cerrada?.estado
    );
    addCheckItem2(
      'ESTADO DEL TABLERO ELÉCTRICO DE CONTROL NORMAL',
      items.estado_tablero_electrico_control_normal?.estado
    );
    addCheckItem2(
      'ABRIÓ Y CERRÓ VÁLVULA DE ASPIRACIÓN (QUEDÓ ABIERTA)',
      items.abrio_cerro_valvula_aspiracion_quedo_abierta?.estado
    );
    addCheckItem2(
      'ABRIÓ Y CERRÓ VÁLVULA DE DESCARGA (QUEDÓ ABIERTA)',
      items.abrio_cerro_valvula_descarga_quedo_abierta?.estado
    );
    addCheckItem2(
      'ABRIÓ Y CERRÓ VÁLVULA DE RECIRCULACIÓN (QUEDÓ CERRADA)',
      items.abrio_cerro_valvula_recirculacion_quedo_cerrada?.estado
    );
    addCheckItem2(
      'ARRANQUE DE BOMBA JOCKEY NORMAL',
      items.arranque_bomba_jockey_normal?.estado,
      items.psi_arranque ? `PSI ARRANQUE: ${items.psi_arranque}` : null
    );
    addCheckItem2(
      'PARADA DE BOMBA JOCKEY NORMAL',
      items.parada_bomba_jockey_normal?.estado,
      items.psi_parada ? `PSI PARADA: ${items.psi_parada}` : null
    );
    addCheckItem2(
      'ESTADO FÍSICO Y LECTURA DE MANÓMETRO CORRECTA',
      items.estado_fisico_lectura_manometro_correcta?.estado
    );
    addCheckItem2(
      'ESTADO FÍSICO DE VÁLVULA DE ASPIRACIÓN NORMAL',
      items.estado_fisico_valvula_aspiracion_normal?.estado
    );
    addCheckItem2(
      'ESTADO FÍSICO DE VÁLVULA DE DESCARGA NORMAL',
      items.estado_fisico_valvula_descarga_normal?.estado
    );
    addCheckItem2(
      'ESTADO FÍSICO DE VÁLVULA DE RECIRCULACIÓN NORMAL',
      items.estado_fisico_valvula_recirculacion_normal?.estado
    );
    addCheckItem2(
      'ESTADO DE VÁLVULA DE ALIVIO NORMAL',
      items.estado_valvula_alivio_normal?.estado
    );
    addCheckItem2(
      'INTERRUPTOR DE COMANDO DE BOMBAS EN POSICIÓN AUTOMÁTICO',
      items.interruptor_comando_bombas_posicion_automatico?.estado
    );
    addCheckItem2(
      'NIVEL DE ACEITE DEL CÁRTER NORMAL',
      items.nivel_aceite_carter_normal?.estado
    );
    addCheckItem2(
      'INSPECCIÓN DE DISYUNTORES',
      items.inspeccion_disyuntores?.estado
    );
    addCheckItem2(
      'ESTADO FÍSICO DEL MANÓMETRO NORMAL',
      items.estado_fisico_manometro_normal?.estado
    );
    addCheckItem2(
      'AJUSTE DE TUERCAS DE PRENSAESTOPAS NECESARIO',
      items.ajuste_tuercas_prensaestopas_necesario?.estado
    );
    addCheckItem2(
      'RED ESTÁ PRESURIZADA',
      items.red_esta_presurizada?.estado
    );

    // NORMA BASADA
    worksheet2.mergeCells(`A${row2}:C${row2}`);
    const normaCell2 = worksheet2.getCell(`A${row2}`);
    normaCell2.value = 'NOTA : PAUTA BASADA NORMA NFPA-25: "Norma para la Inspección, Prueba, y Mantenimiento de Sistemas de Protección contra Incendios a Base de Agua"';
    normaCell2.font = { bold: true, size: 9 };
    normaCell2.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    normaCell2.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFFFF' }
    };
    normaCell2.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet2.getRow(row2).height = 25;
    row2++;

    // COMENTARIOS
    worksheet2.mergeCells(`A${row2}:C${row2}`);
    const comentarioHeader2 = worksheet2.getCell(`A${row2}`);
    comentarioHeader2.value = 'COMENTARIOS:';
    comentarioHeader2.font = { bold: true, italic: true };
    comentarioHeader2.alignment = { horizontal: 'left', vertical: 'middle' };
    comentarioHeader2.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFFFF' }
    };
    comentarioHeader2.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    row2++;

    worksheet2.mergeCells(`A${row2}:C${row2 + 4}`);
    const comentarioCell2 = worksheet2.getCell(`A${row2}`);
    comentarioCell2.value = formulario.comentarios || '';
    comentarioCell2.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
    comentarioCell2.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    worksheet2.getRow(row2).height = 100;
    row2 += 5;

    // FIRMAS HOJA 2
    const firmaRow2 = row2;
    
    worksheet2.getCell(`A${firmaRow2}`).value = 'FIRMA SUPERVISOR';
    worksheet2.getCell(`A${firmaRow2}`).font = { bold: true, italic: true };
    worksheet2.getCell(`A${firmaRow2}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet2.getCell(`A${firmaRow2}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFFFF' }
    };
    worksheet2.getCell(`A${firmaRow2}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet2.getCell(`B${firmaRow2}`).value = 'FIRMA SUPERVISOR AREA';
    worksheet2.getCell(`B${firmaRow2}`).font = { bold: true, italic: true };
    worksheet2.getCell(`B${firmaRow2}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet2.getCell(`B${firmaRow2}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFFFF' }
    };
    worksheet2.getCell(`B${firmaRow2}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet2.getCell(`C${firmaRow2}`).value = 'FIRMA BRIGADA';
    worksheet2.getCell(`C${firmaRow2}`).font = { bold: true, italic: true };
    worksheet2.getCell(`C${firmaRow2}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet2.getCell(`C${firmaRow2}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFFFF' }
    };
    worksheet2.getCell(`C${firmaRow2}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    worksheet2.getRow(firmaRow2).height = 25;

    row2++;
    ['A', 'B', 'C'].forEach(col => {
      worksheet2.getCell(`${col}${row2}`).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };
    });
    worksheet2.getRow(row2).height = 40;

    row2++;
    if (formulario.firmas?.supervisor) {
      worksheet2.getCell(`A${row2}`).value = formulario.firmas.supervisor.nombre_usuario;
      worksheet2.getCell(`A${row2}`).alignment = { horizontal: 'center' };
    }
    if (formulario.firmas?.supervisor_area) {
      worksheet2.getCell(`B${row2}`).value = formulario.firmas.supervisor_area.nombre_usuario;
      worksheet2.getCell(`B${row2}`).alignment = { horizontal: 'center' };
    }
    if (formulario.firmas?.brigada) {
      worksheet2.getCell(`C${row2}`).value = formulario.firmas.brigada.nombre_usuario;
      worksheet2.getCell(`C${row2}`).alignment = { horizontal: 'center' };
    }

    // ============================================
    // GENERAR Y ENVIAR ARCHIVO CON 2 HOJAS
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