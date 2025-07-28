import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

export const fetchStockDailyData = async (symbol) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY', // ✅ FREE TIER safe function
        symbol,
        outputsize: 'compact',
        apikey: API_KEY,
      },
    });

    console.log("Alpha Vantage response for", symbol, response.data);

    const rawData = response.data['Time Series (Daily)'];
    if (!rawData) return null;

    const formattedData = Object.entries(rawData).map(([date, ohlc]) => ({
      date,
      open: parseFloat(ohlc['1. open']),
      high: parseFloat(ohlc['2. high']),
      low: parseFloat(ohlc['3. low']),
      close: parseFloat(ohlc['4. close']),
      volume: parseInt(ohlc['5. volume']),
    }));

    return formattedData;
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error.message);
    return null;
  }
};
