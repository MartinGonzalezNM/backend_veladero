import { bucket } from "../config/firebaseAdmin.js";

export const subirFirma = async (base64Firma, nombreArchivo) => {
  try {
    const base64Data = base64Firma.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const file = bucket.file(nombreArchivo);

    await file.save(buffer, {
      metadata: {
        contentType: "image/png",
        metadata: {
          uploadedAt: new Date().toISOString(),
          uploadedBy: "firma-system"
        }
      },
      public: true,
      validation: "md5",
    });

    await file.makePublic();

    // Pequeña pausa para Firebase
    await new Promise(resolve => setTimeout(resolve, 500));

    return `https://storage.googleapis.com/${bucket.name}/${nombreArchivo}`;
  } catch (error) {
    console.error("Error subiendo firma a Firebase:", error);
    throw new Error("Error subiendo firma a Firebase");
  }
};