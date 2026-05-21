import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionMessage, setSessionMessage] = useState('');

  const checkAuth = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.data.user);
      return true;
    } catch {
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (loginValue, password) => {
    const { data } = await api.post('/auth/login', { login: loginValue, password });
    setUser(data.data.user);
    setSessionMessage('');
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setUser(null);
    }
  };

  const handleSessionExpired = useCallback((message) => {
    setUser(null);
    setSessionMessage(message || 'Session expired. Please log in again.');
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      sessionMessage,
      setSessionMessage,
      login,
      logout,
      checkAuth,
      handleSessionExpired,
      isAuthenticated: Boolean(user),
    }),
    [user, loading, sessionMessage, handleSessionExpired, checkAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
