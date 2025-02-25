import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // Timeout after 5 seconds
    });
    console.log('MongoDB connected successfully to:', process.env.MONGO_URI);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  }
};