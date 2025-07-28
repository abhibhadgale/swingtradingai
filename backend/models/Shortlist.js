import mongoose from 'mongoose';

const ShortlistSchema = new mongoose.Schema({
  symbol: String,
  trend: String,
  latestMA: Number,
  scannedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Shortlist', ShortlistSchema);
