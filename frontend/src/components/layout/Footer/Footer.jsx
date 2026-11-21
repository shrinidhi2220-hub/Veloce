import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { validateEmail } from '../../../utils/validation.js';
import { useUI } from '../../../context/UIContext.jsx';
import { Send, CheckCircle2 } from 'lucide-react';
import './Footer.css';

export function Footer() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showToast } = useUI();

  const handleSubscribe = (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setIsSubscribed(true);
    showToast('Subscribed! Welcome to the VELOCE slow-living community.');
    setEmail('');
  };

  return (
    <footer className="veloce-footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand Info */}
          <div className="footer-brand">
            <h3>VELOCE</h3>
            <p>
              Good things, thoughtfully found. Discover considered goods from independent makers,
              sustainable bulk wholesale, and verified circular market heirlooms.
            </p>
            <div className="footer-socials">
              <a href="#instagram" className="social-icon-btn" aria-label="Instagram">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href="#twitter" className="social-icon-btn" aria-label="Twitter">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
                </svg>
              </a>
              <a href="#linkedin" className="social-icon-btn" aria-label="LinkedIn">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Explore Store</h4>
            <div className="footer-links">
              <Link to="/catalogue">All Products</Link>
              <Link to="/wholesale">Wholesale & Bulk</Link>
              <Link to="/circular-market">Circular Market</Link>
              <Link to="/play-earn">Play & Earn Rewards</Link>
              <Link to="/track-order">Track Your Order</Link>
              <Link to="/account">Patron Account</Link>
              <Link to="/wishlist">Saved Wishlist</Link>
              <Link to="/cart">Cart & Bag</Link>
            </div>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4>Collections</h4>
            <div className="footer-links">
              <Link to="/catalogue?category=home-living">Home & Living</Link>
              <Link to="/catalogue?category=fashion">Organic Fashion</Link>
              <Link to="/catalogue?category=accessories">Slow Accessories</Link>
              <Link to="/catalogue?category=beauty-lifestyle">Botanical Lifestyle</Link>
              <Link to="/catalogue?category=electronics">Tactile Tech</Link>
              <Link to="/catalogue?category=handmade-products">Handcrafted Goods</Link>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="footer-col">
            <div className="newsletter-box">
              <h4>Mindful Dispatches</h4>
              <p>
                Join 18,000+ conscious collectors. Receive our weekly maker journals and secret sample drops.
              </p>
              {isSubscribed ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-eucalyptus)', fontSize: 'var(--text-xs)' }}>
                  <CheckCircle2 size={16} />
                  <span>You are subscribed to the dispatch.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe}>
                  <div className="newsletter-input-group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Enter your email address"
                      className="newsletter-input"
                    />
                    <button
                      type="submit"
                      className="btn btn-terracotta btn-sm"
                      style={{ padding: '0.6rem 0.9rem' }}
                      aria-label="Subscribe"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                  {error && (
                    <p style={{ color: '#E57373', fontSize: '11px', marginTop: '6px' }}>{error}</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} VELOCE ONLINE STORE. Build Bengaluru Hackathon Project. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Artisan Certification Code</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
