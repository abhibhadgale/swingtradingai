// /workspaces/codespaces-blank/frontend/src/components/AddTradeModal.js
import React, { useState } from 'react';
import '../styles/Modal.css';

const AddTradeModal = ({ symbol, defaultData = {}, onClose, onSave }) => {
  const [formData, setFormData] = useState(defaultData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>➕ Add Trade for {symbol}</h3>
        <form onSubmit={handleSubmit}>
          <label>Entry:</label>
          <input type="number" name="entry" value={formData.entry} onChange={handleChange} required />

          <label>Stop Loss:</label>
          <input type="number" name="stopLoss" value={formData.stopLoss} onChange={handleChange} required />

          <label>Target:</label>
          <input type="number" name="target" value={formData.target} onChange={handleChange} required />

          <label>Volume:</label>
          <input type="number" name="volume" value={formData.volume} onChange={handleChange} required />

          <label>Trade Date:</label>
          <input type="date" name="tradeDate" value={formData.tradeDate} onChange={handleChange} required />

          <label>Note:</label>
          <textarea name="note" value={formData.note} onChange={handleChange} />

          <div className="modal-actions">
            <button type="submit">💾 Save</button>
            <button type="button" onClick={onClose}>❌ Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTradeModal;
