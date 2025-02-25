import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const dbConnect = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    console.log('Attempting to connect to MongoDB with URL:', mongoUri);

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      heartBeatFrequencyMS: 10000, // Check server every 10 seconds
      autoIndex: true, // Optional: Automatically create indexes
    });

    console.log('MongoDB connected successfully to:', mongoUri);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Error details:', {
      name: error.name,
      code: error.code,
      reason: error.reason,
      stack: error.stack,
    });
    process.exit(1);
  }
};