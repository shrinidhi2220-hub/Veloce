import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button/Button.jsx';
import { ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import './Auth.css';

export function ForgotPassword() {
  const [identifier, setIdentifier] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const clean = identifier.trim();
    if (!clean) {
      setError('Please provide your registered email address or 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
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
              Account Recovery
            </span>
            <h1>Reset Your Password</h1>
            <p>Enter your contact details to regain access to your mindful patron profile.</p>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-sage-light)',
                  color: 'var(--color-sage)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem'
                }}
              >
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--color-charcoal)' }}>
                Recovery Link Dispatched (Simulated)
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Instructions have been generated for <strong>{identifier}</strong>.<br />
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-terracotta)', display: 'block', marginTop: '6px' }}>
                  *Note: This recovery is simulated because this project has no authentication backend. No live email or SMS OTP was transmitted.
                </span>
              </p>
              <Link to="/login" style={{ display: 'block' }}>
                <Button variant="terracotta" size="lg" style={{ width: '100%' }}>
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
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

              <div className="form-group">
                <label className="form-label" htmlFor="recovery-id">
                  Registered Email or Phone (+91) *
                </label>
                <input
                  id="recovery-id"
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g. rahul.dev@example.com or 9876543210"
                  className="form-input"
                  required
                />
              </div>

              <div className="demo-credentials-box" style={{ fontSize: '11px', marginTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, marginBottom: '2px' }}>
                  <Sparkles size={12} color="var(--color-terracotta)" />
                  <span>Demonstration Environment Note:</span>
                </div>
                <span>
                  VELOCE is operating as a frontend-only showcase. Standard demo patron password is <code>earthy2026</code>.
                </span>
              </div>

              <Button
                type="submit"
                variant="terracotta"
                size="lg"
                loading={loading}
                disabled={loading}
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                {loading ? 'Validating...' : 'Send Reset Instructions'}
              </Button>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', color: 'var(--color-muted)', fontWeight: 600 }}>
                  <ArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
