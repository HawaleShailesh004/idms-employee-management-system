import multer from 'multer';
import { sendError } from '../utils/apiResponse.js';

export const errorHandler = (err, _req, res, _next) => {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return sendError(res, { status: 400, message: messages.join(', ') });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return sendError(res, { status: 409, message: `${field} already exists` });
  }

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendError(res, { status: 400, message: 'Image must be 2MB or smaller' });
    }
    return sendError(res, { status: 400, message: err.message });
  }

  if (err.message?.includes('Only image files')) {
    return sendError(res, { status: 400, message: err.message });
  }

  console.error(err);
  return sendError(res, {
    status: err.status || 500,
    message: err.message || 'Internal server error',
  });
};
