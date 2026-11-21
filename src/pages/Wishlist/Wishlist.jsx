import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { ProductCard } from '../../components/product/ProductCard/ProductCard.jsx';
import { Button } from '../../components/common/Button/Button.jsx';
import { Heart, ArrowRight, Trash2, ShoppingBag } from 'lucide-react';
import './Wishlist.css';

export function Wishlist() {
  const { wishlistItems, clearWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useUI();

  const handleMoveAllToCart = () => {
    wishlistItems.forEach((product) => {
      addToCart(product, 1);
    });
    showToast(`Moved ${wishlistItems.length} items from wishlist to your shopping bag.`);
  };

  if (!wishlistItems.length) {
    return (
      <div className="wishlist-page">
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
              <Heart size={34} />
            </div>
            <h2 style={{ marginBottom: '8px' }}>Your Wishlist is Empty</h2>
            <p style={{ color: 'var(--color-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
              Save considered pottery, natural textiles, and heirloom gifts by tapping the heart icon
              on any product card.
            </p>
            <Link to="/catalogue">
              <Button variant="terracotta" size="lg" icon={ArrowRight}>
                Discover Mindful Finds
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <div>
            <span style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-terracotta)', fontWeight: 700, letterSpacing: '0.12em', display: 'block', marginBottom: '4px' }}>
              Saved Objects
            </span>
            <h1>My Wishlist ({wishlistItems.length} items)</h1>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              variant="terracotta"
              size="sm"
              icon={ShoppingBag}
              onClick={handleMoveAllToCart}
            >
              Move All to Cart
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={Trash2}
              onClick={() => {
                clearWishlist();
                showToast('Wishlist cleared.');
              }}
            >
              Clear All
            </Button>
          </div>
        </div>

        <div className="grid-4">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
