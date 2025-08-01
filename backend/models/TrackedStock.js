import mongoose from 'mongoose';

const trackedStockSchema = new mongoose.Schema({
  symbol: String,
  price: Number,       // optional
  addedAt: { type: Date, default: Date.now }
});

const TrackedStock = mongoose.model('TrackedStock', trackedStockSchema);
export default TrackedStock;
