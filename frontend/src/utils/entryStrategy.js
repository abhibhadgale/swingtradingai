export const suggestEntry = (ohlcData, riskAmount = 1000) => {
  const log = [];

  if (!ohlcData || ohlcData.length < 3) {
    log.push('❌ Not enough OHLC data (need at least 3 candles).');
    return { log };
  }

  const lastThree = ohlcData.slice(-3);
  const [prev2, prev1, current] = lastThree;

  const isGreen = current.close > current.open;
  log.push(`📘 Candle check: Close = ${current.close}, Open = ${current.open}`);
  log.push(isGreen ? '✅ Current candle is green.' : '❌ Current candle is not green.');

  const ma = calculateMovingAverage(ohlcData, 44);
  const distance = Math.abs(current.close - ma) / current.close;
  const isNearMA = distance < 0.02;

  log.push(`📉 44 MA = ${ma.toFixed(2)}, Current Close = ${current.close}`);
  log.push(isNearMA ? '✅ Close is near 44 MA.' : `❌ Close is too far from MA (distance = ${(distance * 100).toFixed(2)}%)`);

  if (!isGreen || !isNearMA) {
    log.push('❌ Entry conditions not met.');
    return { log };
  }

  const entry = current.high + 0.1;
  const stopLoss = Math.min(prev1.low, prev2.low);
  const quantity = Math.floor(riskAmount / (entry - stopLoss));
  const target = entry + 2 * (entry - stopLoss);

  log.push('✅ Entry conditions met. Generating strategy...');
  log.push(`➡️ Entry: ${entry.toFixed(2)}`);
  log.push(`🛑 Stop Loss: ${stopLoss.toFixed(2)}`);
  log.push(`🎯 Target: ${target.toFixed(2)}`);
  log.push(`📦 Quantity (risk ₹${riskAmount}): ${quantity}`);

  return {
    entry: entry.toFixed(2),
    stopLoss: stopLoss.toFixed(2),
    quantity,
    target: target.toFixed(2),
    log,
  };
};

export const calculateMovingAverage = (data, period) => {
  if (data.length < period) return data[data.length - 1]?.close || 0;
  const relevant = data.slice(-period);
  const sum = relevant.reduce((acc, day) => acc + day.close, 0);
  return sum / period;
};
