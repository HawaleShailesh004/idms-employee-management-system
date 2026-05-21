import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { uploadDirPath } from './middleware/upload.js';
import authRoutes from './routes/auth.routes.js';
import employeeRoutes from './routes/employee.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(uploadDirPath));

const getHealthPayload = () => {
  const dbReady = mongoose.connection.readyState;
  const dbConnected = dbReady === 1;
  return {
    status: dbConnected ? 'ok' : 'degraded',
    service: 'idms-employee-api',
    message: dbConnected ? 'API is running' : 'API is running; database not connected',
    database: {
      connected: dbConnected,
      state: ['disconnected', 'connected', 'connecting', 'disconnecting'][dbReady] ?? 'unknown',
    },
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  };
};

const healthHandler = (_req, res) => {
  const payload = getHealthPayload();
  res.status(payload.database.connected ? 200 : 503).json(payload);
};

app.get('/', healthHandler);
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

app.use(errorHandler);

const start = async () => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
