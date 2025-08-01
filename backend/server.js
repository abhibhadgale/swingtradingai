import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dataRoutes from './routes/dataRoutes.js';
import shortlistRoutes from './routes/shortlistRoutes.js';
import trackedStockRoutes from './routes/trackedStockRoutes.js';

import connectDB from './config/db.js';
import cors from 'cors';


dotenv.config();
connectDB();


const app = express();

app.use(cors({
  origin: 'https://curly-space-succotash-5gxg656jxgvhvvq6-3000.app.github.dev', // Replace with your actual Codespace frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());
app.use('/api/stocks', dataRoutes);
app.use('/api/shortlisted-stocks', shortlistRoutes);
app.use('/api/tracked-stocks', trackedStockRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));