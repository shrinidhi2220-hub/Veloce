import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AnnouncementBar() {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-charcoal)',
        color: 'var(--color-ivory)',
        fontSize: 'var(--text-xs)',
        padding: '0.45rem 1rem',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        fontWeight: 500,
        letterSpacing: '0.04em'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Sparkles size={13} style={{ color: 'var(--color-terracotta)' }} />
        <span>Thoughtful finds, made to last. Free delivery across India on orders over ₹999.</span>
      </div>
      <span style={{ opacity: 0.4 }}>•</span>
      <Link
        to="/play-earn"
        style={{
          color: 'var(--color-eucalyptus)',
          textDecoration: 'underline',
          fontWeight: 600,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '3px'
        }}
      >
        Play & Earn Rewards <ArrowRight size={11} />
      </Link>
    </div>
  );
}

export default AnnouncementBar;
