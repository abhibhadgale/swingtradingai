import axios from 'axios';
import Stock from '../models/Stock.js';

export const fetchAndStoreStockData = async (symbol) => {
  try {
    const res = await axios.get(`https://www.alphavantage.co/query`, {
      params: {
        function: 'TIME_SERIES_DAILY_ADJUSTED',
        symbol: `${symbol}.BSE`, // or use .NS
        outputsize: 'compact',
        apikey: process.env.ALPHA_VANTAGE_KEY,
      },
    });

    const timeSeries = res.data['Time Series (Daily)'];

    if (!timeSeries) {
      console.error(`❌ No data for ${symbol}`);
      return;
    }

    for (const [date, values] of Object.entries(timeSeries)) {
      await Stock.updateOne(
        { symbol, date },
        {
          symbol,
          date,
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
          volume: parseInt(values['6. volume']),
        },
        { upsert: true }
      );
    }

    console.log(`✅ ${symbol} data saved`);
  } catch (err) {
    console.error(`❌ Failed for ${symbol}:`, err.message);
  }
};
