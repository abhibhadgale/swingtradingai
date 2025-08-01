import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  fetchTrackedStocks,
  addTrackedStock,
  deleteTrackedStock,
  fetchOhlcBySymbol,
  fetchTrendBySymbol
} from '../api';
import StockChart from '../components/StockChart'; // import chart component
import { suggestEntry } from '../utils/entryStrategy';
import '../styles/Track.css';

function Track() {
  const location = useLocation();
  const cart = location.state?.cart || [];

  const [tracked, setTracked] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(null); // ⬅️ Track clicked stock
  const [entrySuggestion, setEntrySuggestion] = useState(null);
  const [entryLog, setEntryLog] = useState([]);



  const loadTrackedStocks = async () => {
    try {
      const { data } = await fetchTrackedStocks();
      setTracked(data);
    } catch (err) {
      console.error('Error loading tracked stocks:', err);
    }
  };

  const syncCartToTrackedStocks = async () => {
    try {
      const { data: current } = await fetchTrackedStocks();
      const trackedSymbols = new Set(current.map((s) => s.symbol));
      const newStocks = cart.filter((s) => !trackedSymbols.has(s.symbol));

      for (const stock of newStocks) {
        await addTrackedStock(stock);
      }

      loadTrackedStocks();
    } catch (err) {
      console.error('Sync failed:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTrackedStock(id);
      if (tracked.find((s) => s._id === id)?.symbol === selectedSymbol) {
        setSelectedSymbol(null); // Reset chart if deleted
      }
      loadTrackedStocks();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleSelect = (symbol) => {
    setSelectedSymbol(symbol);
  };

  useEffect(() => {
    syncCartToTrackedStocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleSuggestEntry = async (symbol) => {
  try {
    const [{ data: ohlcData }, { data: trendResult }] = await Promise.all([
      fetchOhlcBySymbol(symbol),
      fetchTrendBySymbol(symbol),
    ]);

    const trend = trendResult?.trend || null;
    const result = suggestEntry(ohlcData, trend);
    if (result.entry) {
      setEntrySuggestion({ symbol, ...result });
    } else {
      setEntrySuggestion({ symbol });
    }
    setEntryLog(result.log || []);
  } catch (err) {
    console.error('Error generating suggestion:', err);
    setEntrySuggestion(null);
    setEntryLog(['❌ Error fetching or processing data.']);
  }
};



  return (
    <div className="track-container">
      <h2>📊 Tracked Stocks</h2>
      {tracked.length === 0 ? (
        <p>No stocks are currently tracked.</p>
      ) : (
        <ul className="track-list">
          {tracked.map((stock) => (
            <li key={stock._id}>
              <div
                className="stock-item"
                onClick={() => handleSelect(stock.symbol)}
                style={{ cursor: 'pointer' }}
              >
                <span className="stock-symbol">{stock.symbol}</span>
                <span className="stock-date">
                  ({new Date(stock.addedAt).toLocaleString()})
                </span>
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDelete(stock._id)}
              >
                ❌
              </button>
              <button className="suggest-btn" onClick={() => handleSuggestEntry(stock.symbol)}>
                📌 Suggest Entry
              </button>
              {entrySuggestion && entrySuggestion.symbol === stock.symbol && (
  <div className="suggestion-box">
    <h4>💡 Entry Suggestion Log</h4>
    <ul>
      {entryLog.map((line, i) => (
        <li key={i}>{line}</li>
      ))}
    </ul>
    {entrySuggestion.entry && (
      <div style={{ marginTop: '10px' }}>
        <p><strong>Entry:</strong> ₹{entrySuggestion.entry}</p>
        <p><strong>Stop Loss:</strong> ₹{entrySuggestion.stopLoss}</p>
        <p><strong>Target:</strong> ₹{entrySuggestion.target}</p>
        <p><strong>Qty (@ ₹1000 risk):</strong> {entrySuggestion.quantity}</p>
      </div>
    )}
  </div>
)}

            </li>
          ))}
        </ul>
      )}

      {/* Conditionally show chart below the list */}
      {selectedSymbol && (
        <div className="chart-container">
          <h3>📈 Chart for {selectedSymbol}</h3>
          <StockChart symbol={selectedSymbol} />
        </div>
      )}



    </div>
  );
}

export default Track;
