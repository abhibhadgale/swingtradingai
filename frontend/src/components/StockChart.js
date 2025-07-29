// StockChart.js
import React, { useEffect, useState } from 'react';
import {
  Chart,
  CandlestickSeries,
  LineSeries,
} from 'lightweight-charts-react-wrapper';
import { fetchOhlcBySymbol } from '../api';

function StockChart({ symbol }) {
  const [candles, setCandles] = useState([]);
  const [maData, setMaData] = useState([]);
  const [latestData, setLatestData] = useState(null);

  useEffect(() => {
    if (!symbol) return;

    async function loadData() {
      const res = await fetchOhlcBySymbol(symbol);
      const raw = res.data;

      const c = raw.map((d) => ({
        time: d.date, // 'YYYY-MM-DD'
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }));

      const closes = raw.map((d) => d.close);
      const ma = raw.map((d, i) => {
        if (i >= 44) {
          const sum = closes.slice(i - 44, i + 1).reduce((a, b) => a + b, 0);
          return {
            time: d.date,
            value: sum / 45,
          };
        }
        return null;
      }).filter(Boolean);

      setCandles(c);
      setMaData(ma);
      setLatestData(raw[raw.length - 1]); // Set latest stock data
    }

    loadData();
  }, [symbol]);

  if (candles.length === 0) return <div>Loading {symbol} chart…</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Stock Info Section */}
      {latestData && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '0.5rem 1rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
          background: '#f9f9f9',
        }}>
          <div><strong>Symbol:</strong> {symbol}</div>
          <div><strong>Date:</strong> {latestData.date}</div>
          <div><strong>Open:</strong> {latestData.open}</div>
          <div><strong>High:</strong> {latestData.high}</div>
          <div><strong>Low:</strong> {latestData.low}</div>
          <div><strong>Close:</strong> {latestData.close}</div>
          <div><strong>Volume:</strong> {latestData.volume || 'N/A'}</div>
        </div>
      )}

      {/* Chart */}
      <Chart
        key={symbol}
        width={800}
        height={400}
        layout={{ background: { color: '#fff' }, textColor: '#333' }}
        timeScale={{ timeVisible: true, secondsVisible: false }}
        rightPriceScale={{ borderVisible: false }}
      >
        <CandlestickSeries data={candles} />
        <LineSeries
          data={maData}
          options={{ color: 'orange', lineWidth: 2 }}
        />
      </Chart>
    </div>
  );
}

export default StockChart;
