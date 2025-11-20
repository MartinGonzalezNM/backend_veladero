import { lcmp_006Service } from "./lcmp_006_service.js";
import { procesarImagenBase64 } from "../imagenes/imageProcessor.js";
import ExcelJS from 'exceljs';

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const lcmp_006Controller = {
  async crear(req, res) {
    try {
      const carpeta = 'lcmp_006';
      let datosFormulario = await procesarImagenBase64(req.body, carpeta);
      
      const registro = await lcmp_006Service.crearLcmp006(datosFormulario);
      res.status(201).json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.error('Error en crear lcmp_006:', error);
    }
  },

  async obtenerTodos(req, res) {
    try {
      const registros = await lcmp_006Service.obtenerTodos();
      res.json(registros);
    } catch (error) {
      console.error('Error en obtener lcmp_006:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const registro = await lcmp_006Service.actualizar(req.params.id, req.body);
      if (!registro) return res.status(404).json({ error: "Registro lcmp_006 no encontrado" });
      res.json(registro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const registro = await lcmp_006Service.eliminar(req.params.id);
      if (!registro) return res.status(404).json({ error: "Registro lcmp_006 no encontrado" });
      res.json({ message: "Registro lcmp_006 eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
  try {
    const registro = await lcmp_006Service.obtenerPorId(req.params.id);
    if (!registro) return res.status(404).json({ error: "Registro lcmp_006 no encontrado" });
    res.json(registro);
    console.log('Registro encontrado:', registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

async obtenerPorIdTarea(req, res) {
  try {
    const registro = await lcmp_006Service.obtenerPorIdTarea(req.params.id);
    if (!registro) return res.status(404).json({ error: "Registro lcmp_006 no encontrado" });
    res.json(registro);
    console.log('Registro encontrado:', registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},
// ============================================
// FUNCIÓN PARA EXPORTAR A EXCEL CON LOGO - LCMP-006
// ============================================
async exportarExcel(req, res) {
  try {
    const { id } = req.params;
    
    // Obtener el formulario con todos los datos poblados
    const formulario = await lcmp_006Service.obtenerPorIdTarea(id);
    
    if (!formulario) {
      return res.status(404).json({ error: "Formulario no encontrado" });
    }

    // Crear nuevo workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('LCMP-006');

    // Configurar ancho de columnas
worksheet.columns = [
  { width: 30 },  // Columna A - Nombre de línea
  { width: 15 },  // Columna B - DRENAJE (texto)
  { width: 10 },  // Columna C - Valor DRENAJE
  { width: 18 },  // Columna D - RECIRCULACIÓN (texto)
  { width: 10 },  // Columna E - Valor RECIRCULACIÓN
  { width: 18 },  // Columna F - PRESURIZACIÓN (texto)
  { width: 10 },  // Columna G - SI
  { width: 10 },  // Columna H - NO
  { width: 10 },  // Columna I - CORRIGIÓ
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

    // Insertar logo en las celdas H1:I3 (DERECHA) - ajustado
    worksheet.addImage(logoId, {
      tl: { col: 7, row: 0 },
      br: { col: 9, row: 3 },
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
worksheet.mergeCells('A1:G3');
const titleCell = worksheet.getCell('A1');
titleCell.value = 'LAVADO DE CAÑERÍAS Y\nRECIRCULACIÓN DE AGUA\nLCMP-006';
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
['H1', 'H2', 'H3', 'I1', 'I2', 'I3'].forEach(cell => {
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

  worksheet.mergeCells(`B${currentRow}:I${currentRow}`);
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

worksheet.mergeCells(`B${currentRow}:I${currentRow}`);
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
// Fila de encabezado principal
worksheet.getCell(`A${currentRow}`).value = 'ÍTEMS A CONTROLAR / REALIZAR POR EL TÉCNICO';
worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 11 };
worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
worksheet.getCell(`A${currentRow}`).fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFD3D3D3' }
};
worksheet.getCell(`A${currentRow}`).border = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  right: { style: 'thin' },
  bottom: { style: 'thin' }
};

// Merge celdas B a F para el encabezado de acciones
worksheet.mergeCells(`B${currentRow}:F${currentRow}`);
const accionesHeader = worksheet.getCell(`B${currentRow}`);
accionesHeader.value = '';
accionesHeader.fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFD3D3D3' }
};
accionesHeader.border = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  right: { style: 'thin' },
  bottom: { style: 'thin' }
};

// Columnas SI, NO, CORRIGIÓ
['G', 'H', 'I'].forEach((col, index) => {
  const cell = worksheet.getCell(`${col}${currentRow}`);
  cell.value = ['SI', 'NO', 'CORRIGIÓ'][index];
  cell.font = { bold: true, size: 11 };
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
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

worksheet.getRow(currentRow).height = 25;
currentRow++;

// ============================================
// FILAS DE DATOS (CHECKLIST)
// ============================================
const addLineaRow = (linea) => {
  // Columna A - Nombre de la línea
  const nombreCell = worksheet.getCell(`A${currentRow}`);
  nombreCell.value = linea?.nombre || '';
  nombreCell.alignment = { horizontal: 'left', vertical: 'middle' };
  nombreCell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
    bottom: { style: 'thin' }
  };

  // Columna B - Texto "DRENAJE"
  const drenajeLabelCell = worksheet.getCell(`B${currentRow}`);
  drenajeLabelCell.value = 'DRENAJE';
  drenajeLabelCell.alignment = { horizontal: 'center', vertical: 'middle' };
  drenajeLabelCell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
    bottom: { style: 'thin' }
  };

  // Columna C - Valor de DRENAJE
  const drenajeValueCell = worksheet.getCell(`C${currentRow}`);
  drenajeValueCell.value = linea?.drenaje?.estado || '';
  drenajeValueCell.alignment = { horizontal: 'center', vertical: 'middle' };
  drenajeValueCell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
    bottom: { style: 'thin' }
  };

  // Columna D - Texto "RECIRCULACIÓN"
  const recirculacionLabelCell = worksheet.getCell(`D${currentRow}`);
  recirculacionLabelCell.value = 'RECIRCULACIÓN';
  recirculacionLabelCell.alignment = { horizontal: 'center', vertical: 'middle' };
  recirculacionLabelCell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
    bottom: { style: 'thin' }
  };

  // Columna E - Valor de RECIRCULACIÓN
  const recirculacionValueCell = worksheet.getCell(`E${currentRow}`);
  recirculacionValueCell.value = linea?.recirculacion?.estado || '';
  recirculacionValueCell.alignment = { horizontal: 'center', vertical: 'middle' };
  recirculacionValueCell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
    bottom: { style: 'thin' }
  };

  // Columna F - Texto "PRESURIZACIÓN"
  const presurizacionLabelCell = worksheet.getCell(`F${currentRow}`);
  presurizacionLabelCell.value = 'PRESURIZACIÓN';
  presurizacionLabelCell.alignment = { horizontal: 'center', vertical: 'middle' };
  presurizacionLabelCell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
    bottom: { style: 'thin' }
  };

  // Columnas G, H, I - Checkboxes para PRESURIZACIÓN
  const siCell = worksheet.getCell(`G${currentRow}`);
  const noCell = worksheet.getCell(`H${currentRow}`);
  const corrigioCell = worksheet.getCell(`I${currentRow}`);

  // Marcar checkboxes según el estado de PRESURIZACIÓN
  const presurizacionEstado = linea?.presurizacion?.estado;
  
  if (presurizacionEstado === 'SI' || presurizacionEstado === 'OP') {
    siCell.value = 'X';
  }
  if (presurizacionEstado === 'NO' || presurizacionEstado === 'NOP') {
    noCell.value = 'X';
  }
  
  // Marcar CORRIGIÓ según el campo corrigio
  if (linea?.corrigio?.estado === 'SI' || linea?.corrigio?.estado === 'OP') {
    corrigioCell.value = 'X';
  }

  [siCell, noCell, corrigioCell].forEach(cell => {
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.font = { bold: true };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };
  });

  worksheet.getRow(currentRow).height = 25;
  currentRow++;
};

// Agregar todas las líneas del checklist
if (formulario.checklist && formulario.checklist.length > 0) {
  formulario.checklist.forEach(linea => {
    addLineaRow(linea);
  });
}

// Agregar filas vacías hasta completar al menos 20 filas
const minRows = 20;
const currentLines = formulario.checklist?.length || 0;
const emptyRowsNeeded = Math.max(0, minRows - currentLines);

for (let i = 0; i < emptyRowsNeeded; i++) {
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].forEach(col => {
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
// NOTA AL PIE
// ============================================
worksheet.mergeCells(`A${currentRow}:I${currentRow}`);
const notaCell = worksheet.getCell(`A${currentRow}`);
notaCell.value = 'NOTA : PAUTA BASADA NORMA NFPA-25: "Norma para la Inspección, Prueba, y Mantenimiento de Sistemas de Protección contra Incendios a Base de Agua"';
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
worksheet.mergeCells(`A${currentRow}:I${currentRow}`);
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

worksheet.mergeCells(`A${currentRow}:I${currentRow + 3}`);
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
worksheet.mergeCells(`A${firmaRow}:C${firmaRow}`);
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
worksheet.mergeCells(`D${firmaRow}:F${firmaRow}`);
worksheet.getCell(`D${firmaRow}`).value = 'FIRMA SUPERVISOR AREA';
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

// FIRMA BRIGADA
worksheet.mergeCells(`G${firmaRow}:I${firmaRow}`);
worksheet.getCell(`G${firmaRow}`).value = 'FIRMA BRIGADA';
worksheet.getCell(`G${firmaRow}`).font = { bold: true, italic: true };
worksheet.getCell(`G${firmaRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
worksheet.getCell(`G${firmaRow}`).fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFF0F0F0' }
};
worksheet.getCell(`G${firmaRow}`).border = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  right: { style: 'thin' },
  bottom: { style: 'thin' }
};

worksheet.getRow(firmaRow).height = 25;

// Espacios para firmas (vacíos)
currentRow++;
['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].forEach(col => {
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
  worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
  worksheet.getCell(`A${currentRow}`).value = formulario.firmas.supervisor.nombre_usuario;
  worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center' };
}
if (formulario.firmas?.supervisor_area) {
  worksheet.mergeCells(`D${currentRow}:F${currentRow}`);
  worksheet.getCell(`D${currentRow}`).value = formulario.firmas.supervisor_area.nombre_usuario;
  worksheet.getCell(`D${currentRow}`).alignment = { horizontal: 'center' };
}
if (formulario.firmas?.brigada) {
  worksheet.mergeCells(`G${currentRow}:I${currentRow}`);
  worksheet.getCell(`G${currentRow}`).value = formulario.firmas.brigada.nombre_usuario;
  worksheet.getCell(`G${currentRow}`).alignment = { horizontal: 'center' };
}
    // ============================================
    // GENERAR Y ENVIAR ARCHIVO
    // ============================================
    const buffer = await workbook.xlsx.writeBuffer();
    
    const filename = `LCMP-006_${formulario.id_tarea?.id_sector?.nombre_sector || 'formulario'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);

  } catch (error) {
    console.error('Error al generar Excel:', error);
    res.status(500).json({ error: 'Error al generar el archivo Excel' });
  }
}
}