import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../../services/productApi.js';
import { CATEGORIES } from '../../mock/categories.js';
import { ProductGrid } from '../../components/product/ProductGrid/ProductGrid.jsx';
import { Button } from '../../components/common/Button/Button.jsx';
import { Badge } from '../../components/common/Badge/Badge.jsx';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Leaf,
  Layers,
  Repeat,
  Trophy,
  Package,
  HeartHandshake
} from 'lucide-react';
import './Home.css';

export function Home() {
  const [liveProducts, setLiveProducts] = useState([]);
  useEffect(() => {
    let active = true;
    productApi.getProducts({ page: 1, limit: 12 }).then((response) => {
      if (!active) return;
      const rows = Array.isArray(response.data) ? response.data : [];
      setLiveProducts(rows.map((p) => ({ ...p, categorySlug: String(p.category || 'marketplace').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), inStock: Number(p.stock || 0) > 0, images: Array.isArray(p.images) ? p.images : [], image: p.images?.[0] || 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=900&q=80' })));
    }).catch((error) => console.error('Home catalogue API:', error));
    return () => { active = false; };
  }, []);
  const trendingProducts = liveProducts.slice(0, 4);
  const newArrivals = liveProducts.slice(4, 8);

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <section className="home-hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-tagline">
                <Sparkles size={14} /> Modern Earthy Marketplace
              </div>
              <h1 className="hero-title">
                Thoughtfully found, <span>made to last.</span>
              </h1>
              <p className="hero-desc">
                Discover slow-crafted ceramics, organic textiles, and considered heirlooms from
                independent master makers. Mindful shopping designed for harmonious living.
              </p>
              <div className="hero-actions">
                <Link to="/catalogue">
                  <Button variant="terracotta" size="lg" icon={ArrowRight}>
                    Shop All Finds
                  </Button>
                </Link>
                <Link to="/catalogue">
                  <Button variant="outline" size="lg">
                    Explore Collections
                  </Button>
                </Link>
              </div>

              <div className="hero-stats">
                <div className="stat-item">
                  <h4>100%</h4>
                  <p>Mindfully Sourced</p>
                </div>
                <div className="stat-item">
                  <h4>240+</h4>
                  <p>Independent Artisans</p>
                </div>
                <div className="stat-item">
                  <h4>0%</h4>
                  <p>Single-Use Plastics</p>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-main-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=80"
                  alt="Modern Earthy Interior with handcrafted ceramics"
                  className="hero-main-img"
                />
              </div>

              {/* Floating Social Proof Card */}
              <div className="hero-floating-card">
                <div className="floating-icon">
                  <Leaf size={22} />
                </div>
                <div>
                  <h5 style={{ fontSize: '0.95rem', marginBottom: '2px' }}>Carbon Neutral</h5>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                    Offsetting 100% of shipping emissions with native re-wilding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories Section */}
      <section className="section-spacing" style={{ backgroundColor: 'var(--color-white)' }}>
        <div className="container">
          <div className="section-header">
            <span className="tagline">Curated Living</span>
            <h2>Shop by Aesthetic Category</h2>
            <p>Form, tactile texture, and enduring function across our core master disciplines.</p>
          </div>

          <div className="grid-3" style={{ gap: '1.5rem' }}>
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to={`/catalogue?category=${category.slug}`}
                className="category-card"
              >
                <img src={category.image} alt={category.name} className="category-card-img" loading="lazy" />
                <div className="category-card-overlay">
                  <h4>{category.name}</h4>
                  <span>{category.highlight} • {category.itemCount} items</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Trending Products Section */}
      <section className="section-spacing" style={{ backgroundColor: 'var(--color-ivory)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="tagline" style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-terracotta)', marginBottom: '4px' }}>
                Most Coveted
              </span>
              <h2>Trending in the Market</h2>
            </div>
            <Link to="/catalogue">
              <Button variant="ghost" icon={ArrowRight}>
                View all trending items
              </Button>
            </Link>
          </div>

          <ProductGrid products={trendingProducts} columns={4} />
        </div>
      </section>

      {/* 4. Wholesale Feature Promotion */}
      <section className="section-spacing-sm">
        <div className="container">
          <div className="promo-banner">
            <div className="promo-banner-content">
              <div style={{ display: 'inline-block', marginBottom: '1rem' }}>
                <Badge variant="sage" icon={Layers}>B2B & Bulk Purchasing</Badge>
              </div>
              <h2 style={{ marginBottom: '1rem' }}>Artisanal Wholesale for Studios & Retailers</h2>
              <p style={{ color: 'var(--color-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                Stock considered, handmade goods with flexible low MOQs, tiered volume discounts, and
                complimentary custom co-branding options for your store or studio.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/wholesale">
                  <Button variant="primary" icon={ArrowRight}>
                    Explore Wholesale Catalog
                  </Button>
                </Link>
                <Link to="/wholesale">
                  <Button variant="outline">Request Free Samples</Button>
                </Link>
              </div>
            </div>
            <div style={{ backgroundColor: 'var(--color-eucalyptus)' }}>
              <img
                src="https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80"
                alt="Wholesale olive wood tableware"
                className="promo-banner-img"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. New Arrivals Section */}
      <section className="section-spacing" style={{ backgroundColor: 'var(--color-white)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="tagline" style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-terracotta)', marginBottom: '4px' }}>
                Fresh From The Kiln & Loom
              </span>
              <h2>New Seasonal Arrivals</h2>
            </div>
            <Link to="/catalogue?sort=newest">
              <Button variant="ghost" icon={ArrowRight}>
                Browse all new additions
              </Button>
            </Link>
          </div>

          <ProductGrid products={newArrivals} columns={4} />
        </div>
      </section>

      {/* 6. Circular Market Promotion */}
      <section className="section-spacing-sm">
        <div className="container">
          <div className="promo-banner promo-banner-reversed" style={{ backgroundColor: 'var(--color-eucalyptus-light)', borderColor: 'var(--color-eucalyptus)' }}>
            <div style={{ order: 2 }}>
              <img
                src="https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80"
                alt="Restored terracotta amphora"
                className="promo-banner-img"
                loading="lazy"
              />
            </div>
            <div className="promo-banner-content" style={{ order: 1 }}>
              <div style={{ display: 'inline-block', marginBottom: '1rem' }}>
                <Badge variant="terracotta" icon={Repeat}>Zero Waste Movement</Badge>
              </div>
              <h2 style={{ marginBottom: '1rem' }}>The Circular Market: Pre-Loved & Restored</h2>
              <p style={{ color: 'var(--color-charcoal)', opacity: 0.85, marginBottom: '1.5rem', lineHeight: 1.7 }}>
                Give timeless design a second chapter. Every piece is physically inspected, certified,
                and graded with full carbon diversion transparency.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/circular-market">
                  <Button variant="terracotta" icon={ArrowRight}>
                    Discover Circular Goods
                  </Button>
                </Link>
                <Link to="/circular-market">
                  <Button variant="outline">Learn Trade-In Program</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Play & Earn Promotion */}
      <section className="section-spacing" style={{ backgroundColor: 'var(--color-ivory)' }}>
        <div className="container">
          <div
            style={{
              backgroundColor: 'var(--color-charcoal)',
              color: 'var(--color-white)',
              borderRadius: 'var(--radius-xl)',
              padding: 'clamp(2rem, 5vw, 4rem)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-terracotta)', fontWeight: 700, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>
                <Trophy size={16} /> Gamified Sustainability
              </div>
              <h2 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>
                Play, Learn & Harvest VELOCE Seeds
              </h2>
              <p style={{ color: 'rgba(245, 240, 230, 0.75)', lineHeight: 1.7, marginBottom: '2rem' }}>
                Earn reward seeds daily by taking our 60-second craft quiz, spinning the Earth Wheel,
                or pledging circular drop-offs. Redeem for store discounts or plant verified native trees.
              </p>
              <Link to="/play-earn">
                <Button variant="terracotta" size="lg" icon={Sparkles}>
                  Enter Play & Earn Arena
                </Button>
              </Link>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>Your Demo Seed Wallet</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-eucalyptus)' }}>1,450 Seeds</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: 'var(--text-sm)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(183, 123, 85, 0.2)', color: 'var(--color-terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    🎡
                  </div>
                  <span>Daily Spin: +150 Seeds ready to claim</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: 'var(--text-sm)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(124, 152, 117, 0.2)', color: 'var(--color-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    🌿
                  </div>
                  <span>Eco-Quiz: 3 questions = +200 Seeds</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Brand Benefits Grid */}
      <section className="section-spacing" style={{ backgroundColor: 'var(--color-white)' }}>
        <div className="container">
          <div className="section-header">
            <span className="tagline">The VELOCE Standard</span>
            <h2>Why Conscious Buyers Choose Us</h2>
            <p>Every interaction is anchored in transparency, low ecological footprint, and honest craft.</p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon-wrap">
                <HeartHandshake size={26} />
              </div>
              <h4 style={{ marginBottom: '8px' }}>Direct Maker Equity</h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                Over 78% of retail earnings go directly to independent artisanal workshops.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-wrap">
                <Leaf size={26} />
              </div>
              <h4 style={{ marginBottom: '8px' }}>Earthy Longevity</h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                Crafted from renewable raw stoneware, organic flax, and vegetable-tanned hides.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-wrap">
                <Truck size={26} />
              </div>
              <h4 style={{ marginBottom: '8px' }}>Plastic-Free Delivery</h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                Shipped in 100% recycled paper tape and biodegradable cornstarch cushioning.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-wrap">
                <ShieldCheck size={26} />
              </div>
              <h4 style={{ marginBottom: '8px' }}>Lifetime Craft Care</h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                Free conditioning guides, repair kits, and guaranteed Circular trade-in value.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
