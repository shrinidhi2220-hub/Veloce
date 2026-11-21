import React, { useState } from 'react';
import { CIRCULAR_PRODUCTS, CIRCULAR_BENEFITS } from '../../mock/circular.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { useCart } from '../../context/CartContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { Button } from '../../components/common/Button/Button.jsx';
import { Badge } from '../../components/common/Badge/Badge.jsx';
import { Modal } from '../../components/common/Modal/Modal.jsx';
import {
  Repeat,
  Leaf,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Upload,
  Check
} from 'lucide-react';
import './CircularMarket.css';

export function CircularMarket() {
  const { addToCart } = useCart();
  const { showToast } = useUI();
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  // Sell Item Form
  const [sellItemName, setSellItemName] = useState('');
  const [sellCategory, setSellCategory] = useState('Home & Living');
  const [sellCondition, setSellCondition] = useState('Gently Loved');
  const [sellEstimatedPrice, setSellEstimatedPrice] = useState('');

  const handleBuyCircular = (product) => {
    // Adapt circular product to cart schema
    const cartProduct = {
      id: product.id,
      name: `[Circular] ${product.name}`,
      category: product.category,
      price: product.circularPrice,
      images: [product.image],
      image: product.image
    };
    addToCart(cartProduct, 1);
    showToast(`Added circular heirloom "${product.name}" to cart.`);
  };

  const handleSellSubmit = (e) => {
    e.preventDefault();
    showToast('Item submitted for circular trade-in review! Our curation team will send a valuation within 24 hours.');
    setIsSellModalOpen(false);
    setSellItemName('');
    setSellEstimatedPrice('');
  };

  return (
    <div className="circular-page">
      {/* Circular Hero */}
      <section className="circular-hero">
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-charcoal)', textTransform: 'uppercase', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '1rem' }}>
            <Repeat size={16} /> Closed-Loop Craft Economy
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', marginBottom: '1rem' }}>
            The Circular Market
          </h1>
          <p style={{ maxWidth: '640px', fontSize: 'var(--text-md)', lineHeight: 1.7, color: 'var(--color-charcoal)', opacity: 0.85, marginBottom: '2rem' }}>
            Giving master-crafted objects an enduring second life. Shop verified pre-owned, studio-restored,
            and upcycled heirlooms at up to 60% off original retail with zero carbon compromise.
          </p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Button
              variant="terracotta"
              size="lg"
              onClick={() => setIsSellModalOpen(true)}
              icon={Upload}
            >
              Trade In / Sell Your Pre-Loved Find
            </Button>
            <a href="#circular-catalogue">
              <Button variant="outline" size="lg">
                Shop Verified Resale
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Circular Principles / Benefits */}
      <section className="section-spacing-sm" style={{ backgroundColor: 'var(--color-white)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="grid-4" style={{ gap: '1.5rem' }}>
            {CIRCULAR_BENEFITS.map((benefit, idx) => (
              <div key={idx} style={{ padding: '0.5rem', textAlign: 'left' }}>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '6px', color: 'var(--color-charcoal)' }}>
                  {benefit.title}
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', lineHeight: 1.6 }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Circular Products Grid */}
      <section id="circular-catalogue" className="section-spacing">
        <div className="container">
          <div className="section-header">
            <span className="tagline">Inspected & Restored</span>
            <h2>Current Circular Finds</h2>
            <p>One-of-one verified heirloom items available for immediate adoption.</p>
          </div>

          <div className="circular-grid">
            {CIRCULAR_PRODUCTS.map((item) => (
              <div key={item.id} className="circular-card">
                <div className="circular-img-wrap">
                  <img src={item.image} alt={item.name} className="circular-img" loading="lazy" />
                  <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    <Badge variant={item.conditionColor || 'sage'}>{item.condition}</Badge>
                  </div>
                </div>

                <div className="circular-content">
                  <div className="carbon-badge">
                    <Leaf size={12} /> {item.carbonSaved}
                  </div>

                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-muted)', fontWeight: 700 }}>
                    {item.category} • Prior Owner: {item.seller}
                  </span>

                  <h3 style={{ fontSize: '1.15rem', margin: '4px 0 8px' }}>{item.name}</h3>

                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '12px' }}>
                    {item.story}
                  </p>

                  <div style={{ backgroundColor: 'var(--color-ivory)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '11px', color: 'var(--color-charcoal)', marginBottom: '1.25rem' }}>
                    <strong>VELOCE Verification:</strong> {item.verification}
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
                    <div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                        {formatCurrency(item.circularPrice)}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-muted)', textDecoration: 'line-through' }}>
                        Orig. {formatCurrency(item.originalPrice)}
                      </div>
                    </div>

                    <Button
                      variant="terracotta"
                      size="sm"
                      icon={ShoppingBag}
                      onClick={() => handleBuyCircular(item)}
                    >
                      Adopt Item
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trade-In / Sell Modal */}
      <Modal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        title="Trade In or Resell an Heirloom"
        maxWidth="540px"
      >
        <form onSubmit={handleSellSubmit}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginBottom: '1.25rem' }}>
            Submit an eligible ceramic, wooden object, or slow garment. We inspect, sanitize, and list it
            in the Circular Market while rewarding you with up to 50% cash payout or store credit.
          </p>

          <div className="form-group">
            <label className="form-label">Item Title & Maker *</label>
            <input
              type="text"
              value={sellItemName}
              onChange={(e) => setSellItemName(e.target.value)}
              placeholder="e.g. Handmade Terracotta Jug by Jaipur Studio"
              className="form-input"
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={sellCategory}
                onChange={(e) => setSellCategory(e.target.value)}
                className="form-select"
              >
                <option value="Home & Living">Home & Living</option>
                <option value="Fashion">Fashion & Textiles</option>
                <option value="Accessories">Accessories</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Condition Assessment</label>
              <select
                value={sellCondition}
                onChange={(e) => setSellCondition(e.target.value)}
                className="form-select"
              >
                <option value="Mint Condition">Mint Condition (Like New)</option>
                <option value="Gently Loved">Gently Loved (Minor Patina)</option>
                <option value="Restored Heritage">Restored Heritage (Repaired)</option>
                <option value="Upcycled">Upcycled (Reworked)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Original Retail Price (₹ INR approx)</label>
            <input
              type="number"
              value={sellEstimatedPrice}
              onChange={(e) => setSellEstimatedPrice(e.target.value)}
              placeholder="e.g. 2400"
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
            <Button variant="ghost" onClick={() => setIsSellModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="terracotta" icon={Check}>
              Submit for Valuation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default CircularMarket;
