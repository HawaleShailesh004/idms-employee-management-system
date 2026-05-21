import { User } from '../models/User.js';

export const findUserByLogin = async (login) => {
  const normalized = login.trim().toLowerCase();
  return User.findOne({
    $or: [{ email: normalized }, { username: normalized }],
  }).select('+password');
};

export const getUserById = async (id) => User.findById(id).select('-password');
