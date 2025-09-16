import express from "express";
import { uploadFirmaController } from "./firma_Controller.js";

const router = express.Router();

// 👈 Ya no necesita verificarJWT
router.post("/upload-firma", uploadFirmaController);

export default router;