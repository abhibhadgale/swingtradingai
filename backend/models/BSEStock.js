// models/BSEStockSchema.js
import mongoose from 'mongoose';

const BSEStockSchema = new mongoose.Schema({
  'Security Code': Number,
  'Issuer Name': String,
  'Security Id': String,
  'Security Name': String,
  Status: String,
  Group: String,
  'ISIN No': String,
  Industry: String,
  Instrument: String,
  'Sector Name': String,
  'Industry New Name': String,
  'Igroup Name': String,
  'ISubgroup Name': String
}, {
  collection: 'BSEStockSchema'  // Important
});

export default mongoose.model('BSEStockSchema', BSEStockSchema);
