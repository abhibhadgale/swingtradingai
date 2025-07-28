import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchShortlistedStocks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/shortlisted-stocks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching shortlisted stocks:', error);
    throw error;
  }
};

export const fetchStockData = async (symbol) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stocks/fetch/${symbol}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    throw error;
  }
};