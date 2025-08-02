import React, { useEffect, useState } from 'react';
import { fetchAllTrades,fetchStockBySymbol as updateStockData } from '../api';
import StockChart from '../components/StockChart';
import '../styles/TradeDashboard.css';

const TradeDashboard = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [analysis, setAnalysis] = useState('');

  useEffect(() => {
    const getTrades = async () => {
      try {
        const res = await fetchAllTrades();
        setTrades(res.data);
      } catch (err) {
        setError('Failed to fetch trades');
      } finally {
        setLoading(false);
      }
    };

    getTrades();
  }, []);

  const handleUpdateData = async (symbol) => {
    try {
      await updateStockData(symbol);
      alert(`Stock data for ${symbol} updated to current date.`);
    } catch (err) {
      alert(`Failed to update data for ${symbol}`);
    }
  };

  const generateAnalysis = (trade) => {
  const today = new Date();
  const tradeDate = new Date(trade.tradeDate);
  const daysHeld = Math.floor((today - tradeDate) / (1000 * 60 * 60 * 24));

  const entry = trade.entry;
  const stopLoss = trade.stopLoss;
  const target = trade.target;
  const reward = target - entry;
  const risk = entry - stopLoss;
  const rrRatio = (reward / risk).toFixed(2);

  let summary = `🕒 This trade was initiated ${daysHeld} day(s) ago on ${tradeDate.toDateString()}.\n\n`;

  summary += `💼 **Entry Price:** ₹${entry}\n`;
  summary += `📉 **Stop Loss:** ₹${stopLoss}\n`;
  summary += `📈 **Target Price:** ₹${target}\n`;
  summary += `⚖️ **Reward-to-Risk Ratio:** ${rrRatio}:1\n\n`;

  if (rrRatio < 1) {
    summary += `⚠️ The reward-to-risk ratio is less than 1. Consider reassessing this trade if conditions are not favorable.\n\n`;
  }

  summary += `📊 Use the chart to evaluate price action since the trade date. Check whether price is moving toward your target or showing signs of reversal near the stop loss.\n\n`;

  summary += `🔎 **Suggestions:**\n`;
  summary += `- Monitor volume near critical price levels.\n`;
  summary += `- Look for candle patterns or trendline breaks around your entry zone.\n`;
  summary += `- Tighten stop loss if nearing target, or consider trailing SL strategy.\n`;

  summary += `📌 This is a positional trade. Revisit this analysis every 2–3 days or after any major market event.\n`;

  setAnalysis(summary);
};


  return (
    <div className="trade-dashboard">
      <h2>All Trades</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && trades.length === 0 && <p>No trades found.</p>}

      {!loading && !error && trades.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade._id}>
                <td>{trade.symbol}</td>
                <td>
                  <button
                    className="exit-btn"
                    onClick={() => alert('Exit functionality coming soon')}
                  >
                    Exit
                  </button>
                  <button
                    className="analyze-btn"
                    onClick={() => {
                      setSelectedSymbol({
                        symbol: trade.symbol,
                        entry: trade.entry,
                        stopLoss: trade.stopLoss,
                        target: trade.target,
                        tradeDate: trade.tradeDate,
                      });
                      generateAnalysis(trade);
                    }}
                  >
                    Analyze
                  </button>
                  <button
                    className="update-btn"
                    onClick={() => handleUpdateData(trade.symbol)}
                  >
                    Update Data
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedSymbol && (
        <div className="chart-section">
          <h3>Analysis for {selectedSymbol.symbol}</h3>
          <StockChart
            symbol={selectedSymbol.symbol}
            entry={selectedSymbol.entry}
            stopLoss={selectedSymbol.stopLoss}
            target={selectedSymbol.target}
            tradeDate={selectedSymbol.tradeDate}
          />
          <div className="analysis-box">
            <h4>Trade Commentary</h4>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>{analysis}</pre>

          </div>
        </div>
      )}
    </div>
  );
};

export default TradeDashboard;
