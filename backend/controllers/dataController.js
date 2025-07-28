import Stock from '../models/Stock.js';
import { fetchStockDailyData } from '../services/alphaVantageService.js';

export const storeStockData = async (req, res) => {
  const { symbol } = req.params;
  try {
    const ohlcData = await fetchStockDailyData(symbol);
    if (!ohlcData) return res.status(500).json({ error: 'Failed to fetch data' });

    await Stock.findOneAndUpdate(
      { symbol },
      { symbol, data: ohlcData },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Stock data saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
