import BSEStock from '../models/BSEStock.js';

export const getAllBSEStocks = async (req, res) => {
    try {
        const stocks = await BSEStock.find({ Status: "Active" }).select({
            "Security Id": 1,
            "Security Name": 1,
        });

        res.json(stocks);
    } catch (err) {
        console.error('Error fetching BSE stocks:', err);
        res.status(500).json({ error: 'Failed to fetch BSE stocks' });
    }
};
