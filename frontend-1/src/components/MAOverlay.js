import React from 'react';
import { Line } from 'react-chartjs-2';

const MAOverlay = ({ data, movingAverage }) => {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Candlestick Data',
        data: data.map(item => item.close),
        type: 'candlestick',
        borderColor: 'rgba(0, 0, 0, 1)',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      },
      {
        label: '45-Day Moving Average',
        data: movingAverage,
        borderColor: 'blue',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  return (
    <div>
      <Line data={chartData} />
    </div>
  );
};

export default MAOverlay;