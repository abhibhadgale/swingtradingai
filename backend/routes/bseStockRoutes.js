import express from 'express';
import { getAllBSEStocks } from '../controllers/bseStockController.js';

const router = express.Router();

router.get('/', getAllBSEStocks);

export default router;
