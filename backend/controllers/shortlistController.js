import Shortlist from '../models/Shortlist.js';
import Stock from '../models/Stock.js';
import { analyzeStockTrend } from '../services/scanMovingAverage.js';

export const generateShortlist = async (req, res) => {
  const stocks = await Stock.find({}, 'symbol');
  const symbols = stocks.map((s) => s.symbol);

  const results = [];

  for (const symbol of symbols) {
    try {
      const analysis = await analyzeStockTrend(symbol);
      if (analysis && analysis.trend !== 'flat') {
        await Shortlist.create(analysis);
        results.push(analysis);
      } else {
        console.log(`${symbol} skipped – flat trend or insufficient data`);
      }
    } catch (err) {
      console.error(`Error processing ${symbol}:`, err.message);
    }
  }

  res.json(results);
};


export const getShortlist = async (req, res) => {
  const data = await Shortlist.find().sort({ scannedAt: -1 }).limit(50);
  res.json(data);
};
