import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi } from '../../services/productApi.js';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { Button } from '../../components/common/Button/Button.jsx';
import { Badge } from '../../components/common/Badge/Badge.jsx';
import { ProductGrid } from '../../components/product/ProductGrid/ProductGrid.jsx';
import {
  Star,
  Heart,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Send
} from 'lucide-react';
import './ProductDetail.css';

export function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useUI();

  const [liveProduct, setLiveProduct] = useState(null);
  const [liveProductLoading, setLiveProductLoading] = useState(true);
  const [allLiveProducts, setAllLiveProducts] = useState([]);
  useEffect(() => {
    let active = true;
    setLiveProductLoading(true);
    productApi.getProductById(id).then((response) => {
      if (!active) return;
      const p = response.data;
      setLiveProduct({ ...p, categorySlug: String(p.category || 'marketplace').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), inStock: Number(p.stock || 0) > 0, stockCount: p.stock, images: Array.isArray(p.images) ? p.images : [], image: p.images?.[0] || 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=900&q=80' });
    }).catch((error) => { if (active) console.error('Product detail API:', error); })
      .finally(() => { if (active) setLiveProductLoading(false); });
    return () => { active = false; };
  }, [id]);
  useEffect(() => {
    let active = true;
    productApi.getProducts({ page: 1, limit: 50 }).then((response) => {
      if (!active) return;
      const rows = Array.isArray(response.data) ? response.data : [];
      setAllLiveProducts(rows.map((p) => ({ ...p, categorySlug: String(p.category || 'marketplace').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), inStock: Number(p.stock || 0) > 0, images: Array.isArray(p.images) ? p.images : [], image: p.images?.[0] || 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=900&q=80' })));
    }).catch((error) => console.error('Related products API:', error));
    return () => { active = false; };
  }, []);
  const product = liveProduct;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState('specs'); // 'specs' | 'shipping' | 'care'

  // Mock Review Form State
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [localReviews, setLocalReviews] = useState(product?.reviews || []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImageIndex(0);
    setQuantity(1);
    setLocalReviews(product?.reviews || []);
  }, [id, product]);

  if (!product) {
    return <div className="product-detail-page"><div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>{liveProductLoading ? 'Loading product…' : 'This product is not available in the live catalogue.'}</div></div>;
  }
  const wishlisted = isWishlisted(product.id);
  const images = product?.images?.length ? product.images : (product?.image ? [product.image] : []);

  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity);
      showToast(`Added ${quantity} × "${product.name}" to your shopping bag.`);
    } catch (error) {
      showToast(error.message || 'Could not add this product to cart.', 'error');
    }
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    showToast(
      wishlisted
        ? `Removed "${product.name}" from your wishlist.`
        : `Added "${product.name}" to your wishlist!`
    );
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      showToast('Please fill out your name and review comment.', 'error');
      return;
    }

    const newRev = {
      id: `rev-${Date.now()}`,
      author: reviewName.trim(),
      rating: reviewRating,
      date: 'Just now',
      title: 'Verified Customer Review',
      comment: reviewComment.trim()
    };

    setLocalReviews([newRev, ...localReviews]);
    setReviewName('');
    setReviewComment('');
    showToast('Thank you! Your customer review has been posted.');
  };

  const relatedProducts = allLiveProducts.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumbs">
          <Link to="/">Home</Link>
          <ChevronRight size={12} />
          <Link to="/catalogue">Catalogue</Link>
          <ChevronRight size={12} />
          <Link to={`/catalogue?category=${product.categorySlug}`}>{product.category}</Link>
          <ChevronRight size={12} />
          <span style={{ color: 'var(--color-charcoal)', fontWeight: 600 }}>{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="product-detail-layout">
          {/* Gallery Column */}
          <div className="gallery-container">
            <div className="gallery-main-image-wrap">
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="gallery-main-image"
              />
            </div>

            {images.length > 1 && (
              <div className="gallery-thumbnails">
                {images.map((imgUrl, index) => (
                  <button
                    key={index}
                    className={`gallery-thumb-btn ${selectedImageIndex === index ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img src={imgUrl} alt={`${product.name} angle ${index + 1}`} className="gallery-thumb-img" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Actions Column */}
          <div className="product-info-col">
            <span className="product-info-category">{product.category}</span>
            <h1 className="product-info-title">{product.name}</h1>

            {/* Rating & In-Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-terracotta)' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    fill={i < Math.floor(product.rating || 5) ? 'currentColor' : 'none'}
                  />
                ))}
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)', fontWeight: 600, marginLeft: '4px' }}>
                  {product.rating}
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                  ({localReviews.length} reviews)
                </span>
              </div>

              <span style={{ color: 'var(--color-border)' }}>|</span>

              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: product.inStock ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {product.inStock ? `● In Stock (${product.stockCount || 10} pieces left)` : '○ Backorder Available'}
              </span>
            </div>

            {/* Price Row */}
            <div className="product-info-price-row">
              <span className="product-info-price">{formatCurrency(product.price)}</span>
              {product.comparePrice && (
                <span className="product-info-compare">{formatCurrency(product.comparePrice)}</span>
              )}
              {product.comparePrice && (
                <Badge variant="sage">
                  Save {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                </Badge>
              )}
            </div>

            <p className="product-info-desc">{product.description}</p>

            {/* Quantity Selector & Action Buttons */}
            <div className="product-actions-row">
              <div className="qty-control">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">
                  -
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">
                  +
                </button>
              </div>

              <Button
                variant="terracotta"
                size="lg"
                icon={ShoppingBag}
                onClick={handleAddToCart}
                style={{ flex: 1 }}
              >
                Add to Cart • {formatCurrency(product.price * quantity)}
              </Button>

              <button
                className={`wishlist-large-btn ${wishlisted ? 'active' : ''}`}
                onClick={handleToggleWishlist}
                title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                aria-label="Wishlist toggle"
              >
                <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Trust Assurances */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                padding: '1.25rem',
                backgroundColor: 'var(--color-white)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}
            >
              <div>
                <Truck size={18} style={{ color: 'var(--color-terracotta)', margin: '0 auto 4px' }} />
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>Zero-Plastic Shipping</div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>100% Recycled Pack</div>
              </div>
              <div>
                <ShieldCheck size={18} style={{ color: 'var(--color-sage)', margin: '0 auto 4px' }} />
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>Artisan Guarantee</div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>Verified Makers</div>
              </div>
              <div>
                <RotateCcw size={18} style={{ color: 'var(--color-charcoal)', margin: '0 auto 4px' }} />
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>Circular Trade-In</div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>50% Store Credit</div>
              </div>
            </div>

            {/* Accordion Sections: Specs, Shipping, Care */}
            <div className="specs-accordion">
              {/* 1. Specifications */}
              <div className="accordion-item">
                <button
                  className="accordion-trigger"
                  onClick={() => setOpenAccordion(openAccordion === 'specs' ? null : 'specs')}
                >
                  <span>Materials & Artisan Specifications</span>
                  {openAccordion === 'specs' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openAccordion === 'specs' && (
                  <div className="accordion-body">
                    {product.specs ? (
                      <table style={{ width: '100%', fontSize: 'var(--text-sm)' }}>
                        <tbody>
                          {Object.entries(product.specs).map(([key, val]) => (
                            <tr key={key} style={{ borderBottom: '1px solid var(--color-border)' }}>
                              <td style={{ padding: '8px 0', fontWeight: 600, color: 'var(--color-charcoal)', width: '38%' }}>
                                {key}
                              </td>
                              <td style={{ padding: '8px 0', color: 'var(--color-muted)' }}>
                                {val}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>Handcrafted using pure sustainable materials in accordance with VELOCE standards.</p>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Shipping & Delivery */}
              <div className="accordion-item">
                <button
                  className="accordion-trigger"
                  onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                >
                  <span>Conscious Shipping & Packaging</span>
                  {openAccordion === 'shipping' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openAccordion === 'shipping' && (
                  <div className="accordion-body">
                    <p style={{ marginBottom: '8px' }}>
                      Orders are packed by hand in Bangalore using post-consumer recycled cardboard and water-activated Kraft tape.
                    </p>
                    <p>
                      • Standard Pan-India Delivery: 3-5 business days (₹99 or FREE over ₹999)<br />
                      • Express Metro Dispatch: 1-2 business days (₹199)
                    </p>
                  </div>
                )}
              </div>

              {/* 3. Care & Maintenance */}
              <div className="accordion-item">
                <button
                  className="accordion-trigger"
                  onClick={() => setOpenAccordion(openAccordion === 'care' ? null : 'care')}
                >
                  <span>Heirloom Care & Longevity</span>
                  {openAccordion === 'care' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openAccordion === 'care' && (
                  <div className="accordion-body">
                    <p>
                      Each object is formulated to acquire grace with age. Please avoid chemical dishwashing detergents, bleach, and extreme thermal shock. Occasionally nourish unglazed ceramics and natural woods with food-grade walnut oil or natural beeswax balm.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="reviews-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ marginBottom: '4px' }}>Customer Reviews & Experiences</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>
                Authentic feedback from verified collectors and conscious homemakers.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Badge variant="sage">{product.rating} Average Rating</Badge>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                Based on {localReviews.length} experiences
              </span>
            </div>
          </div>

          {/* Reviews List & New Review Form */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {/* Left: Existing Reviews */}
            <div>
              {localReviews.map((rev) => (
                <div key={rev.id} className="review-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)' }}>
                      {rev.author}
                    </div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>{rev.date}</span>
                  </div>
                  <div style={{ display: 'flex', color: 'var(--color-terracotta)', marginBottom: '8px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill={i < rev.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <h5 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>{rev.title}</h5>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', lineHeight: 1.6 }}>
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>

            {/* Right: Write a Review Form */}
            <div
              style={{
                backgroundColor: 'var(--color-ivory)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)'
              }}
            >
              <h4 style={{ marginBottom: '8px' }}>Share Your Experience</h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginBottom: '1.25rem' }}>
                Your review helps other conscious collectors and supports independent artisans.
              </p>

              <form onSubmit={handleAddReview}>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. Priya M."
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="form-select"
                  >
                    <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                    <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                    <option value={3}>★★★☆☆ (3 Stars - Satisfactory)</option>
                    <option value={2}>★★☆☆☆ (2 Stars - Needs Improvement)</option>
                    <option value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Review</label>
                  <textarea
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="How does the craft and texture feel in your daily space?"
                    className="form-textarea"
                    required
                  />
                </div>

                <Button type="submit" variant="charcoal" icon={Send} style={{ width: '100%' }}>
                  Submit Customer Review
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Related Products Carousel / Grid */}
        {relatedProducts.length > 0 && (
          <section className="section-spacing-sm">
            <div style={{ marginBottom: '2rem' }}>
              <span className="tagline" style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-terracotta)', marginBottom: '4px' }}>
                Harmonious Pairings
              </span>
              <h2>You Might Also Consider</h2>
            </div>
            <ProductGrid products={relatedProducts} columns={4} />
          </section>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
