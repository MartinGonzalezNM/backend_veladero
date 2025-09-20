import { uploadFileToFirebase } from "./upload_service.js";
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No se envió archivo" });

    const url = await uploadFileToFirebase(req.file);
    return res.json({ url });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
