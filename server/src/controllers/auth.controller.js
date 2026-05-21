import { body } from 'express-validator';
import { getCookieOptions, signToken } from '../middleware/auth.js';
import { findUserByLogin } from '../services/auth.service.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

export const loginValidation = [
  body('login').trim().notEmpty().withMessage('Email or username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const login = async (req, res) => {
  const { login, password } = req.body;
  const user = await findUserByLogin(login);

  if (!user || !(await user.comparePassword(password))) {
    return sendError(res, { status: 401, message: 'Invalid credentials' });
  }

  const token = signToken({
    id: user._id.toString(),
    email: user.email,
    username: user.username,
  });

  res.cookie('token', token, getCookieOptions());

  return sendSuccess(res, {
    message: 'Login successful',
    data: { user: { id: user._id, email: user.email, username: user.username } },
  });
};

export const logout = (_req, res) => {
  res.clearCookie('token', getCookieOptions());
  return sendSuccess(res, { message: 'Logged out successfully' });
};

export const getMe = async (req, res) => {
  return sendSuccess(res, {
    message: 'Authenticated',
    data: { user: req.user },
  });
};
