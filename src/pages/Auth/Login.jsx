import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, DEMO_CREDENTIALS } from '../../context/AuthContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { Button } from '../../components/common/Button/Button.jsx';
import { Eye, EyeOff, Lock, User, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import './Auth.css';

export function Login() {
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect to destination or homepage (/)
  const redirectPath = location.state?.from || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleNotice, setGoogleNotice] = useState(false);

  const handleQuickFillDemo = () => {
    setIdentifier(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate submissions
    setError('');

    const cleanId = identifier.trim();
    if (!cleanId) {
      setError('Please enter your registered email address or 10-digit mobile number.');
      return;
    }

    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await login({ identifier: cleanId, password, rememberMe });
      showToast('Welcome back to VELOCE! Session authenticated successfully.');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleDemoClick = () => {
    setGoogleNotice(true);
    showToast('Google Sign-In is a visual demonstration. Use standard or demo login below.', 'info');
  };

  return (
    <div className="auth-page">
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="auth-card">
          {/* Brand Header */}
          <div className="auth-header">
            <Link to="/" style={{ display: 'inline-block', marginBottom: '8px', textDecoration: 'none' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--color-charcoal)' }}>
                VELOCE
              </span>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-terracotta)', marginLeft: '4px' }} />
            </Link>
            <span style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-terracotta)', fontWeight: 700, letterSpacing: '0.12em', display: 'block', marginBottom: '6px' }}>
              Patron Portal
            </span>
            <h1>Welcome Back</h1>
            <p>Sign in to access your saved wishlist, seeds balance, and artisanal orders.</p>
          </div>

          {/* Demonstration Credentials Helper */}
          <div className="demo-credentials-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <Sparkles size={14} color="var(--color-terracotta)" />
                <span>Demo Patron Credentials:</span>
              </div>
              <button
                type="button"
                onClick={handleQuickFillDemo}
                className="quick-fill-btn"
                title="Auto-fill demo credentials"
              >
                Auto Fill
              </button>
            </div>
            <div style={{ color: 'var(--color-muted)', fontSize: '11px', lineHeight: 1.5 }}>
              Email: <code>{DEMO_CREDENTIALS.email}</code><br />
              Password: <code>{DEMO_CREDENTIALS.password}</code>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              style={{
                backgroundColor: 'rgba(194, 84, 80, 0.1)',
                border: '1px solid var(--color-danger)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
                marginBottom: '1.25rem',
                color: 'var(--color-danger)',
                fontSize: 'var(--text-xs)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="login-identifier">
                Email or Indian Mobile (+91) *
              </label>
              <input
                id="login-identifier"
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. rahul.dev@example.com or 9876543210"
                className="form-input"
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="login-password">
                  Password *
                </label>
                <Link to="/forgot-password" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-terracotta)', fontWeight: 500 }}>
                  Forgot password?
                </Link>
              </div>
              <div className="password-input-wrap">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your password"
                  className="form-input"
                  style={{ paddingRight: '40px' }}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', cursor: 'pointer', color: 'var(--color-charcoal)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--color-terracotta)' }}
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="terracotta"
              size="lg"
              loading={loading}
              disabled={loading}
              icon={ArrowRight}
              style={{ width: '100%' }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Account'}
            </Button>
          </form>

          {/* Social Demo Divider */}
          <div className="auth-divider">
            <span>Or continue with</span>
          </div>

          {/* Google Sign-In Demo Button */}
          <button
            type="button"
            className="google-auth-btn"
            onClick={handleGoogleDemoClick}
            aria-label="Sign in with Google (UI Demo)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>
          <div className="demo-ui-notice">
            UI Demonstration only • No external OAuth backend connected
          </div>

          {/* Footer Link */}
          <div className="auth-footer">
            Don't have a conscious patron account?{' '}
            <Link to="/signup">Join VELOCE today (+500 Seeds bonus)</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
