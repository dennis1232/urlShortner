import express, { Application } from 'express';
import dotenv from 'dotenv';
import urlRoutes from './routes/urlRoutes';
import cors from 'cors';

dotenv.config();


const app: Application = express();
app.use(cors({
    origin: process.env.CLIENT_BASE_URL || 'http://localhost:3000',
}));

app.use(express.json());
app.use('/', urlRoutes);

export default app;
