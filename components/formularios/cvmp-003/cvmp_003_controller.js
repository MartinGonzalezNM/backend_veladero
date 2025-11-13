import { cvmp_003Service } from "./cvmp_003_service.js";
import { procesarImagenBase64 } from "../imagenes/imageProcessor.js";
import ExcelJS from "exceljs";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export const cvmp_003Controller = {
  async crear(req, res) {
    try {
      const carpeta = 'cvmp_003';
      let datosFormulario = await procesarImagenBase64(req.body, carpeta);
      
      const registro = await cvmp_003Service.crearCvmp003(datosFormulario);
      res.status(201).json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.error('Error en crear cvmp_003:', error);
    }
  },

  async obtenerTodos(req, res) {
    try {
      const registros = await cvmp_003Service.obtenerTodos();
      res.json(registros);
    } catch (error) {
      console.error('Error en obtener cvmp_003:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const registro = await cvmp_003Service.actualizar(req.params.id, req.body);
      if (!registro) return res.status(404).json({ error: "Registro cvmp_003 no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const registro = await cvmp_003Service.eliminar(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro cvmp_003 no encontrado" });
      res.json({ message: "Registro cvmp_003 eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
  try {
    const registro = await cvmp_003Service.obtenerPorId(req.params.id);
    if (!registro) return res.status(404).json({ error: "Registro cvmp_003 no encontrado" });
    res.json(registro);
    console.log('Registro encontrado:', registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

async obtenerPorIdTarea(req, res) {
  try {
    const registro = await cvmp_003Service.obtenerPorIdTarea(req.params.id);
    if (!registro) return res.status(404).json({ error: "Registro cvmp_003 no encontrado" });
    res.json(registro);
    console.log('Registro encontrado:', registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},
// ============================================
// FUNCIÓN PARA EXPORTAR A EXCEL CON LOGO - CVMP-003
// ============================================

async exportarExcel(req, res) {
  try {
    const { id } = req.params;
    
    // Obtener el formulario con todos los datos poblados
    const formulario = await cvmp_003Service.obtenerPorIdTarea(id);
    
    if (!formulario) {
      return res.status(404).json({ error: "Formulario no encontrado" });
    }

    // Crear nuevo workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('CVMP-003');

    // Obtener número de cuadros
    const numCuadros = formulario.cuadros?.length || 0;
    const totalColumns = numCuadros + 1; // +1 para la columna de descripciones

    // Configurar ancho de columnas
    worksheet.getColumn(1).width = 50; // Columna A (descripción)
    for (let i = 0; i < numCuadros; i++) {
      worksheet.getColumn(i + 2).width = 12; // Columnas B, C, D, etc.
    }

    let currentRow = 1;

    // ============================================
    // ENCABEZADO PRINCIPAL
    // ============================================
    const lastCol = String.fromCharCode(65 + numCuadros);
    worksheet.mergeCells(`A${currentRow}:${lastCol}${currentRow}`);
    const titleCell = worksheet.getCell(`A${currentRow}`);
    titleCell.value = 'INSPECCION CUADRO DE VALVULAS :CVMP-003(1-2)';
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
      for (let i = 1; i <= numCuadros; i++) {
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
    
    const fecha = new Date(formulario.id_tarea?.ultima_modificacion || formulario.fecha_inspeccion);
    const hora = `${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}`;
    addInfoRowLeft('HORA', hora);
    addInfoRowLeft('FECHA:', fecha.toLocaleDateString('es-ES'));
    addInfoRowLeft('DURACION DE LA TAREA', formulario.id_tarea?.id_hh);



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
        const logoStartCol = Math.max(2, Math.ceil(numCuadros * 0.3)); // Comienza alrededor del 30%
        const logoEndCol = Math.min(6, numCuadros); // Máximo columna G (índice 6)
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
    // ENCABEZADOS DE CUADROS
    // ============================================
    currentRow++;
    
    // Primera columna vacía
    worksheet.getCell(`A${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    // Encabezados de cuadros con texto rotado
    if (formulario.cuadros && formulario.cuadros.length > 0) {
      formulario.cuadros.forEach((cuadro, index) => {
        const col = String.fromCharCode(66 + index); // B, C, D, etc.
        const cell = worksheet.getCell(`${col}${currentRow}`);
        cell.value = cuadro.numero_cuadro_valvula;
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
    instrCell.value = 'INDICAR SI/NO SI REALIZO LA TAREA INDICADA - N/A=NO APLICA-OP=OPERATIVO-NOP=NO OPERATIVO-OB=OBSERVACIÓN';
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

      // Agregar valores para cada cuadro
      if (formulario.cuadros) {
        formulario.cuadros.forEach((cuadro, index) => {
          const col = String.fromCharCode(66 + index);
          const valueCell = worksheet.getCell(`${col}${currentRow}`);
          
          // Navegar por el path del campo
          const parts = fieldPath.split('.');
          let value = cuadro;
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
    // SECCIÓN: TIPO SISTEMA ESTADO FÍSICO HE INTEGRIDAD
    // ============================================
    addSectionHeader('TIPO DE SISTEMA ESTADO FÍSICO HE INTEGRIDAD:');
    addChecklistItem('RED SECA', 'tipo_sistema_estado_integridad.red_seca.estado');
    addChecklistItem('RED HUMEDA', 'tipo_sistema_estado_integridad.red_humeda.estado');
    addChecklistItem('LIMPIEZA DE CUADRO Y COMPONENTES AUXILIARES', 'tipo_sistema_estado_integridad.limpieza_cuadro_componentes.estado');
    addChecklistItem('REALIZO LIMPIEZA DE SALA Y ELIMINACION DE OBTACULOS', 'tipo_sistema_estado_integridad.limpieza_sala_eliminacion_obstaculos.estado');
    addChecklistItem('OBSERVO PUNTOS DE OXIDACION Y CORRIGIÓ', 'tipo_sistema_estado_integridad.observo_puntos_oxidacion_corrigio.estado');
    addChecklistItem('SE ENCUENTRA LIBRE DE OBSTACULOS', 'tipo_sistema_estado_integridad.libre_de_obstaculos.estado');
    addChecklistItem('TEMPERATURA AMBIENTE DE LA SALA ES NORMAL', 'tipo_sistema_estado_integridad.temperatura_ambiente_normal.estado');
    addChecklistItem('LOS TRACING ESTAN ENERGIZADOS', 'sistema_tracing.tracing_posee_temp.estado');
    addChecklistItem('LOS TRACING ESTAN RECUBIERTOS', 'sistema_tracing.tracing_posee_recubrimiento_termico.estado');
    addChecklistItem('LOS TRACING CUBREN LA PARTES CRITICAS DE CAÑERIA', 'sistema_tracing.tracing_cubre_critica_cañeria.estado');

    // ============================================
    // SECCIÓN: ESTADO SISTEMA TRACING
    // ============================================
    addSectionHeader('ESTADO SISTEMA TRACING:');
    addChecklistItem('TRACING POSEE TEMP°', 'sistema_tracing.tracing_posee_temp.estado');
    addChecklistItem('LOS TRACING SE ENCUENTRA RECUBIERTOS', 'sistema_tracing.tracing_posee_recubrimiento_mecanico.estado');

    // ============================================
    // SECCIÓN: ESTADO HE INTEGRIDAD DE VÁLVULAS
    // ============================================
    addSectionHeader('ESTADO HE INTEGRIDAD DE VÁLVULAS:');
    addChecklistItem('LAS VÁLVULAS SE ENCUENTRAN ABIERTAS', 'estado_valvulas.valvulas_abiertas.estado');
    addChecklistItem('ESTADOS  VÁLVULA DE CONTROL DE ALARMAS', 'estado_valvulas.estado_valvula_control_alarmas.estado');
    addChecklistItem('LA VALVULZ DE CONTROL', 'estado_valvulas.valvula_control_conectada_a_central.estado');
    addChecklistItem('ESTADO DE VÁLVULA ANTI RETORNO', 'estado_valvulas.estado_valvula_anti_retorno.estado');
    addChecklistItem('ESTADOS DE VÁLVULAS PRINCIPALES', 'estado_valvulas.estado_valvulas_principales.estado');
    addChecklistItem('ESTADOS DE VÁLVULAS AUXILIARES', 'estado_valvulas.estado_valvulas_auxiliares.estado');
    addChecklistItem('VÁLVULA DE PURGA CARRADA', 'estado_valvulas.valvula_purga_carrada.estado');
    addChecklistItem('COMPROBÓ APERTURA Y CIERRE DE LAS VÁLVULA QUE APLIC', 'estado_valvulas.comprobo_apertura_cierre_valvulas_aplique.estado');
    addChecklistItem('DETECTOR DE FLUJO', 'estado_valvulas.detector_flujo.estado');
    addChecklistItem('LUBRICO PARTES MÓVILES DE LAS VÁLVULAS', 'estado_valvulas.lubrico_partes_moviles_valvulas.estado');

    // ============================================
    // SECCIÓN: ESTADO DE COMPONENTES HE INTEGRIDAD DE
    // ============================================
    addSectionHeader('ESTADO DE COMPONENTES HE INTEGRIDAD DE:');
    addChecklistItem('ESTADOS DE MONTURAS', 'estado_componentes_integridad.estado_monturas.estado');
    addChecklistItem('ESTADOS DE TUBERÍAS', 'estado_componentes_integridad.estado_tuberias.estado');
    addChecklistItem('ESTADO FISICO DEL COMPRESOR DE AIRE', 'estado_componentes_integridad.estado_fisico_compresor_aire.estado');
    addChecklistItem('ESTADO DE MANGUERA DE AIRE Y COMPONENTES', 'estado_componentes_integridad.estado_manguera_aire_componentes.estado');
    addChecklistItem('CAMBIO O AGREGO  ACEITE EN COMPRESORES', 'estado_componentes_integridad.cambio_agrego_aceite_compresores.estado');
    addChecklistItem('ESTADOS DE BRIDAS RANURADAS', 'estado_componentes_integridad.estado_bridas_ranuradas.estado');
    addChecklistItem('ESTADOS DE TEE', 'estado_componentes_integridad.estado_tee.estado');
    addChecklistItem('ESTADOS DE REDUCCIONES', 'estado_componentes_integridad.estado_reducciones.estado');
    addChecklistItem('ESTADOS DE MANÓMETROS', 'estado_componentes_integridad.estado_manometros.estado');
    addChecklistItem('ESTADOS DE CONEXIÓN ACOMETIDA', 'estado_componentes_integridad.estado_conexion_acometida.estado');
    addChecklistItem('PURGA DE AGUA EN COMPRESORES', 'estado_componentes_integridad.purga_agua_compresores.estado');
    addChecklistItem('ESTADOS DE CAMPANA HIDRÁULICA', 'estado_componentes_integridad.estado_campana_hidraulica.estado');
    addChecklistItem('ESTADOS CODOS O CURVAS', 'estado_componentes_integridad.estado_codos_curvas.estado');

    // ============================================
    // NORMA BASADA
    // ============================================
    worksheet.mergeCells(`A${currentRow}:${lastCol}${currentRow}`);
    const normaCell = worksheet.getCell(`A${currentRow}`);
    normaCell.value = 'NOTA: PAUTA BASADA NORMA NFPA-25: "Norma para la Inspección, Prueba, y Mantenimiento de Sistemas de Proteccion contra Incendios a Base de Agua"';
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
    const col3End = numCuadros;

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
    worksheet.getCell(`${areaStartCol}${firmaLabelRow}`).value = 'FIRMA SUPERVISOR AREA';
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
    
    const filename = `CVMP-003_${formulario.id_tarea?.id_sector?.nombre_sector || 'formulario'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);

  } catch (error) {
    console.error('Error al generar Excel:', error);
    res.status(500).json({ error: 'Error al generar el archivo Excel' });
  }
}

};