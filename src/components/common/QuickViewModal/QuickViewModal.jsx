import React, { useState } from 'react';
import { useUI } from '../../../context/UIContext.jsx';
import { useCart } from '../../../context/CartContext.jsx';
import { useWishlist } from '../../../context/WishlistContext.jsx';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { Modal } from '../Modal/Modal.jsx';
import { Button } from '../Button/Button.jsx';
import { Badge } from '../Badge/Badge.jsx';
import { Star, Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export function QuickViewModal() {
  const { quickViewProduct, closeQuickView, showToast } = useUI();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`Added ${quantity} × ${product.name} to your cart.`);
    closeQuickView();
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    showToast(
      wishlisted
        ? `Removed ${product.name} from wishlist.`
        : `Added ${product.name} to wishlist!`
    );
  };

  return (
    <Modal isOpen={Boolean(quickViewProduct)} onClose={closeQuickView} maxWidth="760px">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        {/* Product Image */}
        <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--color-ivory)' }}>
          <img
            src={product.images ? product.images[0] : product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '320px', maxHeight: '400px' }}
          />
          {product.badge && (
            <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
              <Badge variant="terracotta">{product.badge}</Badge>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-terracotta)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '4px' }}>
            {product.category}
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', lineHeight: 1.3 }}>{product.name}</h2>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem', fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>
            <div style={{ display: 'flex', color: 'var(--color-terracotta)' }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < Math.floor(product.rating || 5) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span>{product.rating} ({product.reviewCount || 12} reviews)</span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
              {formatCurrency(product.price)}
            </span>
            {product.comparePrice && (
              <span style={{ textDecoration: 'line-through', color: 'var(--color-muted)', fontSize: '1.1rem' }}>
                {formatCurrency(product.comparePrice)}
              </span>
            )}
            {product.comparePrice && (
              <Badge variant="sage">Save {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%</Badge>
            )}
          </div>

          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {product.description}
          </p>

          {/* Quantity & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-ivory)'
              }}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '0.5rem 0.9rem', fontSize: '1.1rem', fontWeight: 600 }}
              >
                -
              </button>
              <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: 600, fontSize: '0.95rem' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{ padding: '0.5rem 0.9rem', fontSize: '1.1rem', fontWeight: 600 }}
              >
                +
              </button>
            </div>

            <Button
              variant="terracotta"
              icon={ShoppingBag}
              onClick={handleAddToCart}
              style={{ flex: 1 }}
            >
              Add to Cart
            </Button>

            <button
              onClick={handleToggleWishlist}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: wishlisted ? 'var(--color-terracotta)' : 'var(--color-white)',
                color: wishlisted ? 'var(--color-white)' : 'var(--color-charcoal)',
                transition: 'all var(--transition-fast)'
              }}
              title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Link to Full Page */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: 'auto' }}>
            <Link
              to={`/product/${product.id}`}
              onClick={closeQuickView}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--color-charcoal)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}
            >
              <Eye size={14} /> View full details & customer reviews →
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default QuickViewModal;
