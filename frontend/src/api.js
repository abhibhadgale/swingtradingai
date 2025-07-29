import axios from 'axios';

const API = axios.create({
  baseURL: 'https://curly-space-succotash-5gxg656jxgvhvvq6-5000.app.github.dev/api',
});

export const fetchStockBySymbol = (symbol) => API.get(`/stocks/fetch/${symbol}`);
export const getShortlist = () => API.get('/shortlisted-stocks');
export const scanShortlist = () => API.get('/shortlisted-stocks/scan');
export const fetchAllStocks = () => API.get('/stocks/all');
export const fetchOhlcBySymbol = (symbol) => API.get(`/stocks/ohlc/${symbol}`);
export const updateAllStocks = () => API.get('/stocks/update-all');

