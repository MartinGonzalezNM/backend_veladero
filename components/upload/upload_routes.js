import express from "express";
import multer from "multer";
import { uploadFile } from "./upload_controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), uploadFile);

export default router;
