import React from 'react';

const Dropdown = ({ stocks, selectedStock, onSelect }) => {
  return (
    <select value={selectedStock} onChange={(e) => onSelect(e.target.value)}>
      <option value="">Select a stock</option>
      {stocks.map((stock) => (
        <option key={stock.symbol} value={stock.symbol}>
          {stock.symbol}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;