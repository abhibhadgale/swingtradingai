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

  // 🧠 Use last N SMA points to determine slope direction
const N = 7;
if (sma.length < N) {
  console.log(`Not enough SMA data for ${symbol}`);
  return null;
}

const recentSMA = sma.slice(-N);
const diffs = [];

for (let i = 1; i < recentSMA.length; i++) {
  diffs.push(recentSMA[i] - recentSMA[i - 1]);
}

const avgSlope = diffs.reduce((acc, val) => acc + val, 0) / diffs.length;

let trend = 'flat';
if (avgSlope > 0.1) trend = 'rising';
else if (avgSlope < -0.1) trend = 'falling';

console.log(`${symbol}: trend = ${trend}, MA = ${recentSMA.at(-1).toFixed(2)}, slope = ${avgSlope.toFixed(4)}`);


  return {
    symbol,
    trend,
    latestMA: Number(recentSMA.at(-1).toFixed(2)),
  };
};
