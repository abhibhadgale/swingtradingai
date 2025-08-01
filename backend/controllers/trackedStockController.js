import TrackedStock from '../models/TrackedStock.js';

export const getTrackedStocks = async (req, res) => {
  try {
    const stocks = await TrackedStock.find();
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tracked stocks' });
  }
};

export const addTrackedStock = async (req, res) => {
  try {
    const stock = new TrackedStock(req.body);
    await stock.save();
    res.status(201).json(stock);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add stock' });
  }
};

export const deleteTrackedStock = async (req, res) => {
  try {
    await TrackedStock.findByIdAndDelete(req.params.id);
    res.json({ message: 'Stock deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete stock' });
  }
};
