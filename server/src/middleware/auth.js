import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { sendError } from '../utils/apiResponse.js';

export const protect = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return sendError(res, { status: 401, message: 'Not authenticated. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = { id: decoded.id, email: decoded.email, username: decoded.username };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.clearCookie('token', getCookieOptions());
      return sendError(res, { status: 401, message: 'Session expired. Please log in again.' });
    }
    return sendError(res, { status: 401, message: 'Invalid token. Please log in again.' });
  }
};

export const getCookieOptions = () => ({
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000,
  path: '/',
});

export const signToken = (payload) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
