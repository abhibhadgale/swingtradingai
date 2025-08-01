// suggestEntry.js

function isGreenCandle(candle) {
  return candle.close > candle.open;
}

function isNearMA(closePrice, movingAverage, thresholdPercent = 10) {
  const diff = Math.abs(closePrice - movingAverage);
  return (diff / movingAverage) * 100 <= thresholdPercent;
}

function suggestEntryStrategy(stockData, movingAverage) {
  const last3Candles = stockData.slice(-3);

  const [prev2, prev1, today] = last3Candles;

  if (!isGreenCandle(today) || !isNearMA(today.close, movingAverage)) {
    return null;
  }

  const entry = today.high + 0.05; // small buffer
  const stopLoss = Math.min(prev1.low, prev2.low);
  const riskPerTrade = 1000; // fixed or adjustable on frontend
  const quantity = Math.floor(riskPerTrade / (entry - stopLoss));
  const target = entry + (entry - stopLoss) * 2;

  return {
    entry: entry.toFixed(2),
    stopLoss: stopLoss.toFixed(2),
    target: target.toFixed(2),
    quantity
  };
}

module.exports = { suggestEntryStrategy };
