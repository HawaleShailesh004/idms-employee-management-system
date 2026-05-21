import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is required');
  }

  const cached = globalThis.mongooseConnection;
  if (!cached?.promise) {
    globalThis.mongooseConnection = {
      promise: mongoose.connect(env.mongoUri).then((conn) => {
        console.log('MongoDB connected');
        return conn;
      }),
    };
  }

  return globalThis.mongooseConnection.promise;
};
