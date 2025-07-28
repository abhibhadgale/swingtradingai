import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dataRoutes from './routes/dataRoutes.js';
import shortlistRoutes from './routes/shortlistRoutes.js';

import connectDB from './config/db.js';
import cors from 'cors';


dotenv.config();
connectDB();


const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/stocks', dataRoutes);
app.use('/api/shortlisted-stocks', shortlistRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));