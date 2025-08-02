import Trade from '../models/Trade.js';

export const createTrade = async (req, res) => {
  try {
    const trade = new Trade(req.body);
    await trade.save();
    res.status(201).json(trade);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getTradesBySymbol = async (req, res) => {
  try {
    const trades = await Trade.find({ symbol: req.params.symbol });
    res.status(200).json(trades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllTrades = async (req, res) => {
  try {
    const trades = await Trade.find({});
    res.status(200).json(trades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
