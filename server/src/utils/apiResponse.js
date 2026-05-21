export const sendSuccess = (res, { status = 200, message = 'Success', data = null } = {}) => {
  res.status(status).json({ status: 'success', message, data });
};

export const sendError = (res, { status = 500, message = 'Something went wrong', data = null } = {}) => {
  res.status(status).json({ status: 'error', message, data });
};
