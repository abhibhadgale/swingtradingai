import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dataRoutes from './routes/dataRoutes.js';
import shortlistRoutes from './routes/shortlistRoutes.js';
import trackedStockRoutes from './routes/trackedStockRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';


import connectDB from './config/db.js';
import cors from 'cors';


dotenv.config();
connectDB();


const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your actual Codespace frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());
app.use('/api/stocks', dataRoutes);
app.use('/api/shortlisted-stocks', shortlistRoutes);
app.use('/api/tracked-stocks', trackedStockRoutes);
app.use('/api/trades', tradeRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));