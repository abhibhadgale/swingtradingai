import React, { useState, useEffect } from 'react';
import {
  fetchStockBySymbol,
  getShortlist,
  scanShortlist,
  fetchAllStocks,
  updateAllStocks
} from '../api';
import StockChart from '../components/StockChart';
import '../styles/Dashboard.css';

function Dashboard() {
  const [symbol, setSymbol] = useState('');
  const [selectedStock, setSelectedStock] = useState('');
  const [shortlist, setShortlist] = useState([]);
  const [dbStocks, setDbStocks] = useState([]);
  const [updating, setUpdating] = useState(false);


  const loadStocks = async () => {
    try {
      const { data } = await fetchAllStocks();
      setDbStocks(data);
    } catch (err) {
      console.error('Failed to fetch DB stocks:', err);
    }
  };

  useEffect(() => {
    loadStocks();
  }, []);

  const handleFetch = async () => {
    try {
      await fetchStockBySymbol(symbol);
      setSymbol('');
      await loadStocks(); // Refresh the DB list immediately after fetching
    } catch (err) {
      console.error(err);
    }
  };

  const handleShortlist = async () => {
    try {
      const { data } = await scanShortlist();
      setShortlist(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStocks = async () => {
    setUpdating(true);
    try {
      const res = await updateAllStocks();
      alert(res.data.message);
      await loadStocks();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update stocks. Please try again later.');
    } finally {
      setUpdating(false);
    }
  };



  return (
    <div className="dashboard-container">
      <h2>📈 Stock Dashboard</h2>

      <div>
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="Enter stock symbol"
        />
        <button onClick={handleFetch}>Fetch Stock</button>
      </div>

      <div className="stock-section">
        <h3>📂 Available Stocks</h3>
        <div className="update-section">
          <button onClick={handleUpdateStocks} disabled={updating}>
            {updating ? 'Updating Stocks...' : '🔄 Update All Stocks'}
          </button>
        </div>


        <div className="stock-grid">
          {dbStocks.map((stk, i) => {
            const shortlisted = shortlist.find((s) => s.symbol === stk.symbol);
            const trendClass = shortlisted
              ? shortlisted.trend === 'rising'
                ? 'rising'
                : 'falling'
              : '';

            return (
              <div
                key={i}
                className={`stock-card ${selectedStock === stk.symbol ? 'active' : ''} ${trendClass}`}
                onClick={() => setSelectedStock(stk.symbol)}
              >
                {stk.symbol}
              </div>
            );
          })}
        </div>


      </div>

      {selectedStock && (
        <div className="chart-wrapper">
          <StockChart key={selectedStock} symbol={selectedStock} />
        </div>
      )}

      <div className="stock-section">
        <button onClick={handleShortlist}>🔎 Show Shortlist</button>
        {shortlist.length > 0 && (
          <ul>
            {shortlist.map((stk, i) => (
              <li key={i}>
                <strong>{stk.symbol}</strong> - {stk.trend} (MA: {stk.latestMA})
              </li>
            ))}
          </ul>

        )}
      </div>
    </div>
  );
}

export default Dashboard;
