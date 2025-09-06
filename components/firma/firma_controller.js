import { subirFirma } from "../firma/firma_service.js";
import { UsuarioModel } from "../usuario/usuario_model.js";

export const uploadFirmaController = async (req, res) => {
  try {
    const { firma, userId } = req.body;
    
    if (!firma || !userId) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    // Verificar que el usuario existe
    const usuario = await UsuarioModel.findById(userId);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // 🔥 Nombre único con timestamp
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const nombreArchivo = `firmas/${userId}_${timestamp}_${random}.png`;
    
    // Subir firma con URL firmada
    const url = await subirFirma(firma, nombreArchivo);

    // Guardar URL en la base de datos
    await UsuarioModel.findByIdAndUpdate(userId, { 
      $push: { 
        firmasHistorial: {
          url: url,
          fecha: new Date(),
          nombreArchivo: nombreArchivo
        }
      },
      firmaUrl: url 
    });

    res.json({ 
      url: url,
      mensaje: "Firma guardada exitosamente"
    });
    
  } catch (err) {
    console.error("Error en uploadFirmaController:", err);
    res.status(500).json({ error: "Error subiendo firma" });
  }
};