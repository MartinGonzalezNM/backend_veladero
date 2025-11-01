import express from 'express';
import { generarReporteExcel } from './reporteController.js';


const router = express.Router();

router.get('/excel', generarReporteExcel);

export default router;