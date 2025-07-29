import express from 'express';
import { storeStockData, getAllStocks, getStockOhlc, updateAllStocks } from '../controllers/dataController.js';


const router = express.Router();
router.get('/fetch/:symbol', storeStockData);
router.get('/all', getAllStocks); // 🔽 New route
router.get('/ohlc/:symbol', getStockOhlc); // ✅ New OHLC data endpoint
router.get('/update-all', updateAllStocks);




export default router;

