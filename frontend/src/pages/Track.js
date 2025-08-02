// /workspaces/codespaces-blank/frontend/src/pages/Track.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  fetchTrackedStocks,
  addTrackedStock,
  deleteTrackedStock,
  fetchOhlcBySymbol,
  fetchTrendBySymbol,
  createTrade
} from '../api';
import StockChart from '../components/StockChart';
import { suggestEntry } from '../utils/entryStrategy';
import AddTradeModal from '../components/AddTradeModal';
import '../styles/Track.css';

function Track() {
  const location = useLocation();
  const cart = location.state?.cart || [];

  const [tracked, setTracked] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [entrySuggestions, setEntrySuggestions] = useState({});
  const [entryLogs, setEntryLogs] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

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
        setSelectedSymbol(null);
      }
      loadTrackedStocks();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleSelect = (symbol) => {
    setSelectedSymbol(symbol);
  };

  const handleSuggestEntry = async (symbol) => {
    try {
      const [{ data: ohlcData }, { data: trendResult }] = await Promise.all([
        fetchOhlcBySymbol(symbol),
        fetchTrendBySymbol(symbol),
      ]);

      const trend = trendResult?.trend || null;
      const result = suggestEntry(ohlcData, trend);

      setEntrySuggestions((prev) => ({
        ...prev,
        [symbol]: result.entry ? { symbol, ...result } : { symbol },
      }));

      setEntryLogs((prev) => ({
        ...prev,
        [symbol]: result.log || [],
      }));
    } catch (err) {
      console.error('Error generating suggestion:', err);
      setEntrySuggestions((prev) => ({ ...prev, [symbol]: { symbol } }));
      setEntryLogs((prev) => ({ ...prev, [symbol]: ['❌ Error fetching or processing data.'] }));
    }
  };

  const handleAddTradeClick = (symbol) => {
    const suggestion = entrySuggestions[symbol];
    if (!suggestion) return;

    setModalData({
      symbol,
      entry: suggestion.entry || '',
      stopLoss: suggestion.stopLoss || '',
      target: suggestion.target || '',
      volume: suggestion.quantity || '',
      tradeDate: new Date().toISOString().split('T')[0],
      note: '',
    });
    setShowModal(true);
  };

  const saveTrade = async (trade) => {
    try {
      await createTrade(trade);
      alert('✅ Trade saved!');
      setShowModal(false);
    } catch (err) {
      console.error('Trade save failed:', err);
      alert('❌ Failed to save trade.');
    }
  };

  useEffect(() => {
    syncCartToTrackedStocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="track-container">
      <h2>📊 Tracked Stocks</h2>
      {tracked.length === 0 ? (
        <p>No stocks are currently tracked.</p>
      ) : (
        <ul className="track-list">
          {tracked.map((stock) => {
            const suggestion = entrySuggestions[stock.symbol];
            const logs = entryLogs[stock.symbol] || [];
            return (
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
                <button className="delete-btn" onClick={() => handleDelete(stock._id)}>❌</button>
                <button className="suggest-btn" onClick={() => handleSuggestEntry(stock.symbol)}>📌 Suggest Entry</button>

                {suggestion && (
                  <div className="suggestion-box">
                    <h4>💡 Entry Suggestion Log</h4>
                    <ul>
                      {logs.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                    {suggestion.entry && (
                      <div style={{ marginTop: '10px' }}>
                        <p><strong>Entry:</strong> ₹{suggestion.entry}</p>
                        <p><strong>Stop Loss:</strong> ₹{suggestion.stopLoss}</p>
                        <p><strong>Target:</strong> ₹{suggestion.target}</p>
                        <p><strong>Qty (@ ₹1000 risk):</strong> {suggestion.quantity}</p>
                        <button onClick={() => handleAddTradeClick(stock.symbol)} className="add-trade-btn" style={{ marginTop: '10px' }}>
                          ➕ Add Trade
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {selectedSymbol && (
        <div className="chart-container">
          <h3>📈 Chart for {selectedSymbol}</h3>
          <StockChart symbol={selectedSymbol} />
        </div>
      )}

      {showModal && modalData && (
        <AddTradeModal
          symbol={modalData.symbol}
          defaultData={modalData}
          onClose={() => setShowModal(false)}
          onSave={saveTrade}
        />
      )}
    </div>
  );
}

export default Track;
