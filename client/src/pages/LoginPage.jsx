import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './LoginPage.css';

const LoginPage = () => {
  const { login, isAuthenticated, loading, sessionMessage, setSessionMessage } = useAuth();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ login: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    if (sessionMessage) setSessionMessage('');
  };

  const validate = () => {
    const next = {};
    if (!form.login.trim()) next.login = 'Email or username is required';
    if (!form.password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(form.login, form.password);
      showSuccess('Login successful');
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err.status === 401) {
        showError(err.message || 'Invalid credentials');
      } else {
        showError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <header className="login-page__top">
        <img src="/assets/idms_logo.svg" alt="IDMS Infotech" className="login-page__logo" />
      </header>
      <div className="login-page__banner" />
      <div className="login-page__content">
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <div className="login-card__brand">
            <h1 className="login-card__hrms">HRMS</h1>
            <p className="login-card__subtitle">
              <span className="login-card__idms">IDMS</span> Infotech Private Limited
            </p>
          </div>

          {sessionMessage && (
            <div className="login-card__session-msg" role="alert">
              {sessionMessage}
            </div>
          )}

          <Input
            label="Email or Username"
            name="login"
            value={form.login}
            onChange={handleChange}
            placeholder="Enter email or username"
            error={errors.login}
            autoComplete="username"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            error={errors.password}
            autoComplete="current-password"
          />

          <div className="login-card__row">
            <label className="login-card__remember">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              <span>Remember Me</span>
            </label>
            <button type="button" className="login-card__forgot">
              Forgot Password?
            </button>
          </div>

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
