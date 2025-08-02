import React, { useEffect, useState } from 'react';
import {
  Chart,
  CandlestickSeries,
  LineSeries,
  PriceLine,
} from 'lightweight-charts-react-wrapper';
import { fetchOhlcBySymbol } from '../api';

function StockChart({ symbol, entry, stopLoss, target }) {
  const [candles, setCandles] = useState([]);
  const [maData, setMaData] = useState([]);
  const [latestData, setLatestData] = useState(null);

  useEffect(() => {
    if (!symbol) return;

    async function loadData() {
      const res = await fetchOhlcBySymbol(symbol);
      const raw = res.data;

      const c = raw.map((d) => ({
        time: Math.floor(new Date(d.date).getTime() / 1000), // <-- critical
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
            time: Math.floor(new Date(d.date).getTime() / 1000), // <-- also critical
            value: sum / 45,
          };
        }
        return null;
      }).filter(Boolean);

      setCandles(c);
      setMaData(ma);
      setLatestData(raw[raw.length - 1]);
    }

    loadData();
  }, [symbol]);

  if (candles.length === 0) return <div>Loading {symbol} chart…</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

      <Chart
  key={symbol}
  width={800}
  height={400}
  layout={{ background: { color: '#fff' }, textColor: '#333' }}
  timeScale={{ timeVisible: true, secondsVisible: false }}
  rightPriceScale={{ borderVisible: false }}
>
  <CandlestickSeries data={candles}>
    {entry && (
      <PriceLine
        price={entry}
        color="blue"
        lineWidth={2}
        lineStyle={2}
        title="Entry"
      />
    )}
    {stopLoss && (
      <PriceLine
        price={stopLoss}
        color="red"
        lineWidth={2}
        lineStyle={0}
        title="Stop Loss"
      />
    )}
    {target && (
      <PriceLine
        price={target}
        color="green"
        lineWidth={2}
        lineStyle={0}
        title="Target"
      />
    )}
  </CandlestickSeries>

  <LineSeries
    data={maData}
    reactive={true}
    options={{
      color: 'orange',
      lineWidth: 2,
      priceLineVisible: true,
      crossHairMarkerVisible: true,
      lastValueVisible: true,
    }}
  />
</Chart>

    </div>
  );
}

export default StockChart;
