import express from 'express';
import { createTrade, getTradesBySymbol, getAllTrades } from '../controllers/tradeController.js';
const router = express.Router();

router.post('/', createTrade);
router.get('/:symbol', getTradesBySymbol);
router.get('/', getAllTrades); 

export default router;
