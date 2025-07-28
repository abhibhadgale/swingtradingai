import express from 'express';
import { storeStockData } from '../controllers/dataController.js';

const router = express.Router();
router.get('/fetch/:symbol', storeStockData);

export default router;

