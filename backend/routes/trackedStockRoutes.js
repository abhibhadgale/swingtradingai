import express from 'express';
import {
  getTrackedStocks,
  addTrackedStock,
  deleteTrackedStock
} from '../controllers/trackedStockController.js';

const router = express.Router();

router.get('/', getTrackedStocks);
router.post('/', addTrackedStock);
router.delete('/:id', deleteTrackedStock);

export default router;
