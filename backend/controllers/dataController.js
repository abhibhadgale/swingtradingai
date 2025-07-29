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

export const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find({}, 'symbol'); // only return symbol field
    res.status(200).json(stocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStockOhlc = async (req, res) => {
  const { symbol } = req.params;
  try {
    const stock = await Stock.findOne({ symbol });
    if (!stock || !stock.data || stock.data.length === 0) {
      return res.status(404).json({ error: 'Stock data not found' });
    }

    // Return sorted OHLC data by date ascending
    const sortedData = stock.data
      .map(d => ({
        date: d.date,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json(sortedData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updateAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find({}, 'symbol');
    let updated = 0;

    for (let i = 0; i < stocks.length; i++) {
      const { symbol } = stocks[i];
      const ohlcData = await fetchStockDailyData(symbol);
      if (ohlcData) {
        await Stock.findOneAndUpdate(
          { symbol },
          { symbol, data: ohlcData },
          { upsert: true, new: true }
        );
        updated++;
        await new Promise(resolve => setTimeout(resolve, 15000)); // 15 sec delay to avoid hitting rate limit
      }
    }

    res.status(200).json({ message: `Updated ${updated} stock(s)` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
