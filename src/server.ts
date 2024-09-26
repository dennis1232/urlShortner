import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/urlShortener';

mongoose.connect(mongoUri, {
    minPoolSize: 10
}).then(() => {
    console.log('MongoDB connected');
}).catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
