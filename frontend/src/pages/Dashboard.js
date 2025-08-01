import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  fetchStockBySymbol,
  getShortlist,
  scanShortlist,
  fetchAllStocks,
  updateAllStocks,
  fetchTrackedStocks as getTrackedStocks,
  addTrackedStock as addToTracked,
  deleteTrackedStock as removeFromTracked

} from '../api';
import StockChart from '../components/StockChart';
import '../styles/Dashboard.css';

function Dashboard() {
  const [symbol, setSymbol] = useState('');
  const [selectedStock, setSelectedStock] = useState('');
  const [shortlist, setShortlist] = useState([]);
  const [dbStocks, setDbStocks] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [tracked, setTracked] = useState([]);
  const navigate = useNavigate();

  const loadStocks = async () => {
    try {
      const { data } = await fetchAllStocks();
      setDbStocks(data);
    } catch (err) {
      console.error('Failed to fetch DB stocks:', err);
    }
  };

  const loadTrackedStocks = async () => {
    try {
      const { data } = await getTrackedStocks();
      setTracked(data);
    } catch (err) {
      console.error('Failed to fetch tracked stocks:', err);
    }
  };

  useEffect(() => {
    loadStocks();
    loadTrackedStocks();
  }, []);

  const handleFetch = async () => {
    try {
      await fetchStockBySymbol(symbol);
      setSymbol('');
      await loadStocks();
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

  const handleTrack = async (stock) => {
    const trackedItem = tracked.find((t) => t.symbol === stock.symbol);

    if (trackedItem) {
      // 🛠 Use _id from tracked item for deletion
      await removeFromTracked(trackedItem._id);
    } else {
      await addToTracked(stock);
    }

    await loadTrackedStocks();
  };

  const handleGoToTrack = () => {
    navigate('/track');
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

            const trackedSymbols = tracked.map(t => t.symbol); // ✅ added
            const isTracked = trackedSymbols.includes(stk.symbol); // ✅ fixed
            
            return (
              <div
                key={i}
                className={`stock-card ${selectedStock === stk.symbol ? 'active' : ''} ${trendClass}`}
              >
                <div onClick={() => setSelectedStock(stk.symbol)}>
                  {stk.symbol}
                </div>
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleTrack(stk)}
                >
                  {isTracked ? 'Remove from Track' : 'Track'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="cart-section">
          <h4>📌 Tracked: {tracked.length} stock(s)</h4>
          <button onClick={handleGoToTrack}>➡️ Go to Track Page</button>
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