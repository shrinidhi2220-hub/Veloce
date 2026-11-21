import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext.jsx';
import { useWishlist } from '../../../context/WishlistContext.jsx';
import { useUI } from '../../../context/UIContext.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  Sparkles,
  Layers,
  Repeat,
  Trophy,
  Package,
  LogOut,
  LogIn,
  Truck,
  UserPlus
} from 'lucide-react';
import { Modal } from '../../common/Modal/Modal.jsx';
import { Badge } from '../../common/Badge/Badge.jsx';
import { Button } from '../../common/Button/Button.jsx';
import './Navbar.css';

export function Navbar() {
  const { totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { isMobileMenuOpen, openMobileMenu, closeMobileMenu, showToast } = useUI();
  const { user, isAuthenticated, logout } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      setIsProfileModalOpen(true);
    }
  };

  const handleSignOut = () => {
    setIsProfileModalOpen(false);
    closeMobileMenu();
    logout();
    showToast('Signed out safely. Hope to welcome you back soon!');
    navigate('/login', { replace: true });
  };

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'CP';

  return (
    <>
      <header className="veloce-navbar">
        <div className="navbar-inner">
          {/* Mobile Menu Toggle Button */}
          <button
            className="icon-button mobile-toggle"
            onClick={openMobileMenu}
            aria-label="Open Navigation Menu"
          >
            <Menu size={22} />
          </button>

          {/* Brand Logo */}
          <Link to="/" className="brand-logo" onClick={closeMobileMenu}>
            <span>VELOCE</span>
            <span className="brand-logo-dot" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav" aria-label="Main Navigation">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
            <NavLink to="/catalogue" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Shop
            </NavLink>
            <NavLink to="/wholesale" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Wholesale
            </NavLink>
            <NavLink to="/circular-market" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Circular Market
            </NavLink>
            <NavLink to="/play-earn" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Play & Earn
            </NavLink>
          </nav>

          {/* Action Icons and Authentication Controls */}
          <div className="nav-actions">
            <button
              className="icon-button"
              onClick={() => navigate('/search')}
              aria-label="Search Catalog"
              title="Search"
            >
              <Search size={20} />
            </button>

            <Link
              to="/wishlist"
              className="icon-button"
              aria-label="Saved Wishlist"
              title="Saved Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
            </Link>

            <Link
              to="/cart"
              className="icon-button"
              aria-label="Shopping Cart"
              title="Shopping Cart"
            >
              <ShoppingBag size={20} />
              {totalItemsCount > 0 && <span className="badge-count">{totalItemsCount}</span>}
            </Link>

            {isAuthenticated && user ? (
              <button
                className="icon-button"
                onClick={handleProfileClick}
                aria-label="Open Patron Profile"
                title={`${user.fullName} (${user.tier || 'Patron'}) - ${user.seedsBalance || 0} Seeds`}
                style={{
                  backgroundColor: 'var(--color-eucalyptus-light)',
                  fontWeight: 700,
                  fontSize: '12px',
                  color: 'var(--color-charcoal)',
                  border: '1.5px solid var(--color-sage)'
                }}
              >
                {initials}
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Button variant="ghost" size="sm" icon={LogIn}>
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" className="desktop-only-btn" style={{ textDecoration: 'none' }}>
                  <Button variant="terracotta" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={closeMobileMenu}>
          <div className="mobile-drawer open" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <Link to="/" className="brand-logo" onClick={closeMobileMenu}>
                <span>VELOCE</span>
                <span className="brand-logo-dot" />
              </Link>
              <button className="icon-button" onClick={closeMobileMenu} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>

            <nav className="mobile-nav-links">
              <NavLink
                to="/"
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                Home
              </NavLink>
              <NavLink
                to="/catalogue"
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                Shop All Catalogue
              </NavLink>
              <NavLink
                to="/wholesale"
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                Wholesale & Bulk
              </NavLink>
              <NavLink
                to="/circular-market"
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                Circular Market (Resale)
              </NavLink>
              <NavLink
                to="/play-earn"
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                Play & Earn Rewards
              </NavLink>
              <NavLink
                to="/wishlist"
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                My Wishlist ({wishlistCount})
              </NavLink>
              <NavLink
                to="/cart"
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                Shopping Bag ({totalItemsCount})
              </NavLink>
              <NavLink
                to="/track-order"
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                Track Order
              </NavLink>

              {isAuthenticated ? (
                <NavLink
                  to="/account"
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  My Account Dashboard
                </NavLink>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    Sign In
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                    style={{ color: 'var(--color-terracotta)', fontWeight: 600 }}
                  >
                    Create Account (+500 Seeds)
                  </NavLink>
                </>
              )}
            </nav>

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
              {isAuthenticated && user ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={16} color="var(--color-terracotta)" />
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                        {user.fullName}
                      </span>
                    </div>
                    <Badge variant="sage">{user.tier || 'Sprout Patron'}</Badge>
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginBottom: '12px' }}>
                    {user.seedsBalance || 0} VELOCE Seeds accumulated
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={LogOut}
                    onClick={handleSignOut}
                    style={{ width: '100%', color: 'var(--color-danger)', justifyContent: 'center' }}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginBottom: '10px' }}>
                    Sign in to harvest seeds and save curated items across your devices.
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to="/login" onClick={closeMobileMenu} style={{ flex: 1 }}>
                      <Button variant="outline" size="sm" style={{ width: '100%' }}>Sign In</Button>
                    </Link>
                    <Link to="/signup" onClick={closeMobileMenu} style={{ flex: 1 }}>
                      <Button variant="terracotta" size="sm" style={{ width: '100%' }}>Register</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Patron Profile Overview Modal */}
      {isAuthenticated && user && (
        <Modal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          title="Patron Profile"
          maxWidth="460px"
        >
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-eucalyptus)',
                color: 'var(--color-charcoal)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 700,
                margin: '0 auto 12px',
                border: '2px solid var(--color-sage)'
              }}
            >
              {initials}
            </div>
            <h4 style={{ marginBottom: '4px', color: 'var(--color-charcoal)' }}>{user.fullName}</h4>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>{user.email}</p>
            <div style={{ marginTop: '8px' }}>
              <Badge variant="sage">{user.tier || 'Patron'}</Badge>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-ivory)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>VELOCE Seeds Balance</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-terracotta)' }}>
                {user.seedsBalance || 0} Seeds
              </span>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginBottom: '12px' }}>
              Earn 10 Seeds per ₹100 spent or via daily rituals in Play & Earn.
            </p>
            <Link
              to="/play-earn"
              onClick={() => setIsProfileModalOpen(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                color: 'var(--color-charcoal)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Redeem rewards & play games →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.25rem' }}>
            <Link
              to="/account"
              onClick={() => setIsProfileModalOpen(false)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                backgroundColor: 'var(--color-white)',
                color: 'var(--color-charcoal)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Package size={16} color="var(--color-terracotta)" />
                <span>My Account Dashboard</span>
              </div>
              <span style={{ color: 'var(--color-terracotta)' }}>Open →</span>
            </Link>

            <Link
              to="/track-order"
              onClick={() => setIsProfileModalOpen(false)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                color: 'var(--color-charcoal)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Truck size={16} color="var(--color-muted)" />
                <span>Track Dispatches</span>
              </div>
              <span style={{ color: 'var(--color-muted)' }}>Status</span>
            </Link>

            <Link
              to="/wishlist"
              onClick={() => setIsProfileModalOpen(false)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                color: 'var(--color-charcoal)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Heart size={16} color="var(--color-muted)" />
                <span>Saved Wishlist ({wishlistCount})</span>
              </div>
              <span style={{ color: 'var(--color-muted)' }}>View</span>
            </Link>
          </div>

          <Button
            variant="ghost"
            icon={LogOut}
            onClick={handleSignOut}
            style={{ width: '100%', color: 'var(--color-danger)' }}
          >
            Sign Out
          </Button>
        </Modal>
      )}
    </>
  );
}

export default Navbar;
