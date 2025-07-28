import React from 'react';

const TrendTag = ({ trend }) => {
  const trendStyles = {
    rising: { color: 'green', backgroundColor: '#e0f7e0' },
    falling: { color: 'red', backgroundColor: '#f7e0e0' },
    flat: { color: 'gray', backgroundColor: '#f0f0f0' },
  };

  return (
    <div style={{ padding: '10px', borderRadius: '5px', ...trendStyles[trend] }}>
      {trend.charAt(0).toUpperCase() + trend.slice(1)}
    </div>
  );
};

export default TrendTag;