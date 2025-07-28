import Stock from '../models/Stock.js';
import { calculateSMA } from '../utils/movingAverage.js';

export const analyzeStockTrend = async (symbol) => {
  const stock = await Stock.findOne({ symbol });

  if (!stock || !stock.data || stock.data.length < 45) {
    console.log(`Not enough data for ${symbol}`);
    return null;
  }

  // Sort the stock data by date ascending
  const sortedData = stock.data.sort((a, b) => new Date(a.date) - new Date(b.date));
  const closes = sortedData.map(d => d.close);

  const sma = calculateSMA(closes, 45);

  if (!sma || sma.length < 3) {
    console.log(`Not enough SMA data for ${symbol}`);
    return null;
  }

  const [prev2, prev1, current] = sma.slice(-3);
  const trend = (current > prev1 && prev1 > prev2) ? 'rising'
              : (current < prev1 && prev1 < prev2) ? 'falling'
              : 'flat';

  console.log(`${symbol}: trend = ${trend}, MA = ${current.toFixed(2)}`);

  return {
    symbol,
    trend,
    latestMA: Number(current.toFixed(2)),
  };
};
