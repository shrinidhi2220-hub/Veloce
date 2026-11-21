import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { validateEmail, validateIndianPhone } from '../../utils/validation.js';
import { Button } from '../../components/common/Button/Button.jsx';
import { Eye, EyeOff, ArrowRight, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import './Auth.css';

export function Signup() {
  const { signup, isAuthenticated } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState("");
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full legal name.');
      return;
    }

    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }

    const phoneErr = validateIndianPhone(phone);
    if (phoneErr) {
      setError(phoneErr);
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter carefully.');
      return;
    }

    if (!agreeTerms) {
      setError('Please accept the slow-living charter & patron terms to proceed.');
      return;
    }

    setLoading(true);
    try {
      await signup({ fullName, email, phone, password, referralCode });
      showToast('Your VELOCE account has been created successfully.');
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your inputs.');
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleDemoClick = () => {
    showToast('Google Sign-In is a visual demonstration. Please register using the form below.', 'info');
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
              Begin Your Journey
            </span>
            <h1>Join VELOCE Market</h1>
            <p>Become a conscious patron of artisanal craft and earn seeds for slow living.</p>
          </div>

          {/* Seeds Bonus Callout */}
          <div className="demo-credentials-box" style={{ backgroundColor: 'var(--color-eucalyptus-light)', borderColor: 'var(--color-sage)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-forest)' }}>
              <Sparkles size={16} color="var(--color-terracotta)" />
              <span style={{ fontWeight: 700, fontSize: 'var(--text-xs)' }}>
                Create your VELOCE customer account
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--color-muted)', margin: '4px 0 0 24px' }}>
              Register with your email address and start shopping the live catalogue.
            </p>
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-name">
                Full Legal Name *
              </label>
              <input
                id="signup-name"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Sanya Iyer"
                className="form-input"
                autoComplete="name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">
                Email Address *
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="sanya@example.com"
                className="form-input"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-phone">
                Indian Mobile Number (+91) *
              </label>
              <input
                id="signup-phone"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (error) setError('');
                }}
                placeholder="10-digit mobile, e.g. 9876543210"
                className="form-input"
                maxLength={13}
                autoComplete="tel"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-referral">Referral Code (optional)</label>
              <input id="signup-referral" type="text" value={referralCode} onChange={(e) => setReferralCode(e.target.value.toUpperCase())} placeholder="VLC-XXXXXXXX" className="form-input" maxLength={32} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="signup-password">
                  Password *
                </label>
                <div className="password-input-wrap">
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Minimum 8 characters"
                    className="form-input"
                    style={{ paddingRight: '40px' }}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-btn"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="signup-confirm-password">
                  Confirm Password *
                </label>
                <input
                  id="signup-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Re-type password"
                  className="form-input"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: 'var(--text-xs)', cursor: 'pointer', color: 'var(--color-charcoal)' }}>
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ accentColor: 'var(--color-terracotta)', marginTop: '2px' }}
                />
                <span>
                  I agree to the VELOCE slow-living charter, conscious return policy, and virtual Seeds rewards guidelines.
                </span>
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
              {loading ? 'Creating Account...' : 'Create Patron Account'}
            </Button>
          </form>

          {/* Social Demo Divider */}
          <div className="auth-divider">
            <span>Or register with</span>
          </div>

          <button
            type="button"
            className="google-auth-btn"
            onClick={handleGoogleDemoClick}
            aria-label="Sign up with Google (UI Demo)"
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
            <span>Sign up with Google</span>
          </button>
          <div className="demo-ui-notice">
            UI Demonstration only • No external OAuth backend connected
          </div>

          {/* Footer Link */}
          <div className="auth-footer">
            Already have a patron account?{' '}
            <Link to="/login">Sign In here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
