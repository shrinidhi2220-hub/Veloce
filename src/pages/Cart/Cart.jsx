import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { Button } from '../../components/common/Button/Button.jsx';
import { Badge } from '../../components/common/Badge/Badge.jsx';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Check,
  Tag
} from 'lucide-react';
import './Cart.css';

export function Cart() {
  const {
    items,
    totalItemsCount,
    subtotal,
    discountAmount,
    discountedSubtotal,
    shipping,
    amountToFreeShipping,
    tax,
    total,
    appliedPromo,
    removeFromCart,
    updateQuantity,
    applyPromo,
    removePromo
  } = useCart();

  const { showToast } = useUI();
  const navigate = useNavigate();
  const [promoCodeInput, setPromoCodeInput] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;

    const result = applyPromo(promoCodeInput);
    if (result.success) {
      showToast(result.message);
      setPromoCodeInput('');
    } else {
      showToast(result.message, 'error');
    }
  };

  const handleRemovePromo = () => {
    removePromo();
    showToast('Promo code removed.');
  };

  if (!items.length) {
    return (
      <div className="cart-page">
        <div className="container">
          <div
            style={{
              textAlign: 'center',
              padding: '5rem 1.5rem',
              backgroundColor: 'var(--color-white)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)',
              maxWidth: '560px',
              margin: '3rem auto'
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-ivory)',
                color: 'var(--color-terracotta)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}
            >
              <ShoppingBag size={34} />
            </div>
            <h2 style={{ marginBottom: '8px' }}>Your Shopping Bag is Empty</h2>
            <p style={{ color: 'var(--color-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
              You haven't added any mindful finds to your bag yet. Explore our handcrafted ceramics,
              organic textiles, or conscious wholesale catalogue.
            </p>
            <Link to="/catalogue">
              <Button variant="terracotta" size="lg" icon={ArrowRight}>
                Discover Considered Goods
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-terracotta)', fontWeight: 700, letterSpacing: '0.12em', display: 'block', marginBottom: '4px' }}>
            Shopping Bag
          </span>
          <h1>Review Your Order ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})</h1>
        </div>

        <div className="cart-layout">
          {/* Left Column: Line Items */}
          <div>
            <div className="cart-table-card">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.product.images ? item.product.images[0] : item.product.image}
                    alt={item.product.name}
                    className="cart-item-img"
                  />

                  <div className="cart-item-details">
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-muted)', fontWeight: 700 }}>
                      {item.product.category}
                    </span>
                    <h4>
                      <Link to={`/product/${item.product.id}`}>{item.product.name}</Link>
                    </h4>
                    <p>{formatCurrency(item.product.price)} each</p>
                  </div>

                  <div className="cart-item-qty">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-price">
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-charcoal)' }}>
                      {formatCurrency(item.product.price * item.quantity)}
                    </div>
                    <button
                      onClick={() => {
                        removeFromCart(item.id);
                        showToast(`Removed "${item.product.name}" from cart.`);
                      }}
                      style={{ color: 'var(--color-muted)', marginTop: '6px', display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px' }}
                      title="Remove item"
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <Link to="/catalogue">
                <Button variant="ghost">← Continue Browsing Finds</Button>
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                <ShieldCheck size={16} color="var(--color-sage)" />
                <span>Zero-waste eco packaging included with every order</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout Trigger */}
          <aside className="cart-summary-box">
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
              Order Summary
            </h3>

            <div className="summary-row">
              <span>Bag Subtotal</span>
              <span style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>{formatCurrency(subtotal)}</span>
            </div>

            {appliedPromo && (
              <div className="summary-row" style={{ color: 'var(--color-terracotta)' }}>
                <span>Discount ({appliedPromo.label})</span>
                <span style={{ fontWeight: 600 }}>-{formatCurrency(discountAmount)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Delivery Charges (Pan-India)</span>
              <span>{shipping === 0 ? <strong style={{ color: 'var(--color-success)' }}>FREE</strong> : formatCurrency(shipping)}</span>
            </div>

            {shipping > 0 && amountToFreeShipping > 0 && (
              <div style={{ backgroundColor: 'var(--color-eucalyptus-light)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '11px', color: 'var(--color-charcoal)', marginTop: '-4px', marginBottom: '10px' }}>
                Add <strong>{formatCurrency(amountToFreeShipping)}</strong> more for <strong>FREE Delivery</strong> across India!
              </div>
            )}

            <div className="summary-row">
              <span>Estimated GST (CGST + SGST)</span>
              <span>{formatCurrency(tax)}</span>
            </div>

            <div className="summary-row total">
              <span>Estimated Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            {/* Promo Code Input */}
            <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
              {appliedPromo ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-ivory)', padding: '0.6rem 0.9rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                    <Tag size={14} color="var(--color-terracotta)" />
                    <span>{appliedPromo.code} applied</span>
                  </div>
                  <button onClick={handleRemovePromo} style={{ fontSize: '11px', color: 'var(--color-danger)', fontWeight: 600 }}>
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="Promo code (e.g. EARTH15, SEEDS250)"
                    className="form-input"
                    style={{ fontSize: 'var(--text-xs)', padding: '0.55rem 0.8rem' }}
                  />
                  <Button type="submit" variant="outline" size="sm">
                    Apply
                  </Button>
                </form>
              )}
            </div>

            <Button
              variant="terracotta"
              size="lg"
              icon={ArrowRight}
              style={{ width: '100%' }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>
                Demonstration checkout interface • No charge will be made
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Cart;
