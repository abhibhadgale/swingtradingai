import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  symbol: String,
  data: [
    {
      date: String,
      open: Number,
      high: Number,
      low: Number,
      close: Number,
      volume: Number,
    },
  ],
});

export default mongoose.model('Stock', stockSchema);
