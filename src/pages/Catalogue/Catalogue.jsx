import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS } from '../../mock/products.js';
import { CATEGORIES } from '../../mock/categories.js';
import { ProductGrid } from '../../components/product/ProductGrid/ProductGrid.jsx';
import { ProductFilter } from '../../components/product/ProductFilter/ProductFilter.jsx';
import { Button } from '../../components/common/Button/Button.jsx';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import './Catalogue.css';

export function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSort = searchParams.get('sort') || 'featured';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState(15000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState(initialSort);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync category param if URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const handleSelectCategory = (catSlug) => {
    setSelectedCategory(catSlug);
    if (catSlug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catSlug);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setPriceRange(15000);
    setInStockOnly(false);
    setSortBy('featured');
    searchParams.delete('category');
    searchParams.delete('sort');
    setSearchParams(searchParams);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category check
      if (selectedCategory !== 'all' && product.categorySlug !== selectedCategory) {
        return false;
      }
      // Price check
      if (product.price > priceRange) {
        return false;
      }
      // In stock check
      if (inStockOnly && !product.inStock) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0; // 'featured' keeps original curated order
    });
  }, [selectedCategory, priceRange, inStockOnly, sortBy]);

  const currentCategoryObj = CATEGORIES.find((c) => c.slug === selectedCategory);

  return (
    <div className="catalogue-page">
      <div className="container">
        {/* Header Breadcrumb & Heading */}
        <div className="catalogue-header">
          <span style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-terracotta)', fontWeight: 700, letterSpacing: '0.12em', display: 'block', marginBottom: '4px' }}>
            VELOCE Market Catalogue
          </span>
          <h1>
            {currentCategoryObj ? currentCategoryObj.name : 'All Considered Goods'}
          </h1>
          <p style={{ maxWidth: '640px', marginTop: '6px' }}>
            {currentCategoryObj
              ? currentCategoryObj.description
              : 'Slow-crafted stoneware, natural textiles, and conscious heirlooms designed for everyday living.'}
          </p>
        </div>

        {/* Toolbar */}
        <div className="catalogue-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-charcoal)' }}>
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'object' : 'objects'}
            </span>

            <Button
              variant="outline"
              size="sm"
              icon={SlidersHorizontal}
              className="mobile-filter-btn"
              onClick={() => setIsMobileFilterOpen(true)}
            >
              Filter / Sort
            </Button>
          </div>

          {/* Active Filter Pills */}
          <div className="catalogue-active-filters">
            {selectedCategory !== 'all' && (
              <span className="filter-pill">
                Category: {currentCategoryObj?.name || selectedCategory}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => handleSelectCategory('all')} />
              </span>
            )}
            {priceRange < 15000 && (
              <span className="filter-pill">
                Max {priceRange}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setPriceRange(15000)} />
              </span>
            )}
            {inStockOnly && (
              <span className="filter-pill">
                In Stock
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setInStockOnly(false)} />
              </span>
            )}
          </div>
        </div>

        {/* Main Grid & Filter Layout */}
        <div className="catalogue-layout">
          {/* Desktop & Mobile Drawer Filter Sidebar */}
          <aside className={`catalogue-sidebar ${isMobileFilterOpen ? 'mobile-open' : ''}`}>
            {isMobileFilterOpen && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Filter Catalogue</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  style={{ padding: '0.4rem', borderRadius: '50%', backgroundColor: 'var(--color-white)' }}
                >
                  <X size={20} />
                </button>
              </div>
            )}
            <ProductFilter
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                handleSelectCategory(cat);
                setIsMobileFilterOpen(false);
              }}
              priceRange={priceRange}
              onChangePriceRange={setPriceRange}
              inStockOnly={inStockOnly}
              onToggleInStockOnly={setInStockOnly}
              sortBy={sortBy}
              onChangeSortBy={setSortBy}
              onResetFilters={handleResetFilters}
            />
          </aside>

          {/* Product Grid Area */}
          <main>
            <ProductGrid
              products={filteredProducts}
              columns={3}
              emptyMessage="No conscious items found with the chosen filters. Try adjusting your maximum price or clearing category filters."
              onResetFilters={handleResetFilters}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Catalogue;
