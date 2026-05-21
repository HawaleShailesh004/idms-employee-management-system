import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    if (config.headers) {
      if (typeof config.headers.delete === 'function') {
        config.headers.delete('Content-Type');
      } else {
        const headers = { ...config.headers };
        delete headers['Content-Type'];
        delete headers['content-type'];
        config.headers = headers;
      }
    }
  } else {
    config.headers = {
      'Content-Type': 'application/json',
      ...(config.headers || {}),
    };
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Request failed';
    const status = error.response?.status;
    const enhanced = new Error(message);
    enhanced.status = status;
    enhanced.data = error.response?.data;
    return Promise.reject(enhanced);
  }
);

export default api;
