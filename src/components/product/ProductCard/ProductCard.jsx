import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext.jsx';
import { useWishlist } from '../../../context/WishlistContext.jsx';
import { useUI } from '../../../context/UIContext.jsx';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { Badge } from '../../common/Badge/Badge.jsx';
import { Heart, Plus, Star, Eye } from 'lucide-react';
import './ProductCard.css';

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast, openQuickView } = useUI();

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
  const primaryImage = product.images ? product.images[0] : product.image;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    showToast(`Added "${product.name}" to cart.`);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    showToast(
      wishlisted
        ? `Removed from wishlist.`
        : `Saved to wishlist!`
    );
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  return (
    <div className="product-card">
      <div className="product-card-image-wrap">
        <Link to={`/product/${product.id}`}>
          <img src={primaryImage} alt={product.name} className="product-card-image" loading="lazy" />
        </Link>

        {product.badge && (
          <div className="product-card-badge">
            <Badge variant="terracotta">{product.badge}</Badge>
          </div>
        )}

        <button
          className={`product-card-wishlist-btn ${wishlisted ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label="Wishlist toggle"
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        <button
          className="product-card-quickview-btn"
          onClick={handleQuickView}
          aria-label="Quick preview"
        >
          <Eye size={13} /> Quick Look
        </button>
      </div>

      <div className="product-card-content">
        <span className="product-card-category">{product.category}</span>
        <h4 className="product-card-title">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h4>

        {product.rating && (
          <div className="product-card-rating">
            <div style={{ display: 'flex', color: 'var(--color-terracotta)' }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span>{product.rating} ({product.reviewCount || 10})</span>
          </div>
        )}

        <div className="product-card-footer">
          <div className="product-card-pricing">
            <span className="product-card-price">{formatCurrency(product.price)}</span>
            {product.comparePrice && (
              <span className="product-card-compare">{formatCurrency(product.comparePrice)}</span>
            )}
          </div>

          <button
            className="product-card-add-btn"
            onClick={handleAddToCart}
            title="Add to cart"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
