import React, { useEffect, useState } from 'react';
import Dropdown from './components/Dropdown';
import CandlestickChart from './components/CandlestickChart';
import TrendTag from './components/TrendTag';
import MAOverlay from './components/MAOverlay';
import { fetchShortlistedStocks, fetchStockData } from './api';

const App = () => {
  const [shortlistedStocks, setShortlistedStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [trend, setTrend] = useState('');

  useEffect(() => {
    const getShortlistedStocks = async () => {
      const stocks = await fetchShortlistedStocks();
      setShortlistedStocks(stocks);
    };

    getShortlistedStocks();
  }, []);

  useEffect(() => {
    const getStockData = async () => {
      if (selectedStock) {
        const data = await fetchStockData(selectedStock);
        setStockData(data);
        setTrend(data.trend);
      }
    };

    getStockData();
  }, [selectedStock]);

  return (
    <div>
      <h1>Stock Dashboard</h1>
      <Dropdown stocks={shortlistedStocks} onSelect={setSelectedStock} />
      {stockData && (
        <>
          <CandlestickChart data={stockData} />
          <MAOverlay data={stockData} />
          <TrendTag trend={trend} />
        </>
      )}
    </div>
  );
};

export default App;