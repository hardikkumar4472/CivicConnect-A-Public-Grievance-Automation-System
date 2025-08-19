import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import sectorHeadRoutes from './routes/sectorHead.js';
import citizenRoutes from './routes/citizenRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; 
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "https://civicconnect-a-public-grievance-85gb.onrender.com/", 
  credentials: true
}));

// routes
app.use('https://civicconnect-1f9p.onrender.com/api/auth', authRoutes);
app.use('https://civicconnect-1f9p.onrender.com/api/sector-head', sectorHeadRoutes);
app.use('https://civicconnect-1f9p.onrender.com/api/citizen', citizenRoutes);
app.use('https://civicconnect-1f9p.onrender.com/api/issues', issueRoutes);
app.use('https://civicconnect-1f9p.onrender.com/api/feedback', feedbackRoutes);
app.use('https://civicconnect-1f9p.onrender.com/api/admin', adminRoutes);

export default app;
