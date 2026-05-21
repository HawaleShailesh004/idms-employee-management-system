import { env } from './env.js';

export const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    if (env.clientUrls.includes(origin)) {
      return callback(null, origin);
    }
    console.warn(`CORS blocked origin: ${origin}. Allowed: ${env.clientUrls.join(', ')}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
