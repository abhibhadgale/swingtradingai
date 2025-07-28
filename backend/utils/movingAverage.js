export const calculateSMA = (prices, window = 45) => {
  if (prices.length < window) return null;

  const sma = [];
  for (let i = 0; i <= prices.length - window; i++) {
    const slice = prices.slice(i, i + window);
    const sum = slice.reduce((acc, val) => acc + val, 0);
    sma.push(sum / window);
  }
  return sma;
};
