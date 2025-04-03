import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
configDotenv();

const url = process.env.MONGO_URI; // import mongodb url from .env
const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log('Database connect successfully !');
  } catch (error) {
    console.log('Mongodb database connection error :' + error.message);
  }
};

export default connectDB;
