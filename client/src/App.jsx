import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import api from './api/axios';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

const AuthInterceptor = ({ children }) => {
  const { handleSessionExpired, isAuthenticated } = useAuth();

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.status === 401 && isAuthenticated) {
          handleSessionExpired(error.message);
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, [handleSessionExpired, isAuthenticated]);

  return children;
};

const App = () => (
  <BrowserRouter>
    <ToastProvider>
      <AuthProvider>
        <AuthInterceptor>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthInterceptor>
      </AuthProvider>
    </ToastProvider>
  </BrowserRouter>
);

export default App;
