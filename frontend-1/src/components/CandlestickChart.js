import React from 'react';
import { Chart } from 'react-charts'; // Assuming you are using react-charts or a similar library

const CandlestickChart = ({ data, movingAverage, trend }) => {
  const series = React.useMemo(
    () => ({
      type: 'candlestick',
    }),
    []
  );

  const axes = React.useMemo(
    () => [
      { primary: true, type: 'time', position: 'bottom' },
      { type: 'linear', position: 'left' },
    ],
    []
  );

  const candlestickData = React.useMemo(
    () => [
      {
        label: 'Candlestick Data',
        data: data.map(d => ({
          primary: new Date(d.date),
          secondary: [d.open, d.high, d.low, d.close],
        })),
      },
    ],
    [data]
  );

  return (
    <div>
      <Chart data={candlestickData} series={series} axes={axes} />
      {movingAverage && (
        <div style={{ position: 'absolute', top: 0, left: 0 }}>
          <Chart
            data={[
              {
                label: '45-Day MA',
                data: movingAverage.map((ma, index) => ({
                  primary: new Date(data[index + 44].date), // Align MA with the corresponding date
                  secondary: ma,
                })),
              },
            ]}
            series={{ type: 'line', stroke: 'blue' }}
            axes={axes}
          />
        </div>
      )}
      {trend && (
        <div style={{ color: trend === 'rising' ? 'green' : 'red' }}>
          Trend: {trend}
        </div>
      )}
    </div>
  );
};

export default CandlestickChart;