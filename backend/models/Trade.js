import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  entry: { type: Number, required: true },
  stopLoss: { type: Number, required: true },
  target: { type: Number, required: true },
  volume: { type: Number, required: true },
  tradeDate: { type: Date, required: true },
  exitDate: { type: Date }, // optional
  profitLoss: { type: Number }, // optional, after exit
  note: { type: String }, // optional field for remarks
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Trade', tradeSchema);
