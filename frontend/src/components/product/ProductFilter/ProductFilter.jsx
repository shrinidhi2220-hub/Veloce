import React from 'react';
import { CATEGORIES } from '../../../mock/categories.js';
import { RotateCcw, Filter, X } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatCurrency.js';

export function ProductFilter({
  selectedCategory,
  onSelectCategory,
  priceRange,
  onChangePriceRange,
  inStockOnly,
  onToggleInStockOnly,
  sortBy,
  onChangeSortBy,
  onResetFilters,
  isOpenMobile,
  onCloseMobile
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-white)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)' }}>
          <Filter size={16} />
          <span>Filters & Sort</span>
        </div>
        <button
          onClick={onResetFilters}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-terracotta)',
            fontWeight: 600
          }}
          title="Reset all filters"
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Sort Options */}
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label className="form-label">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => onChangeSortBy(e.target.value)}
          className="form-select"
        >
          <option value="featured">Curated Collection</option>
          <option value="newest">Newest Arrivals</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Customer Rated</option>
        </select>
      </div>

      {/* Category Filter */}
      <div style={{ marginBottom: '1.75rem' }}>
        <label className="form-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Categories</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            onClick={() => onSelectCategory('all')}
            style={{
              textAlign: 'left',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-sm)',
              fontWeight: selectedCategory === 'all' ? 700 : 500,
              backgroundColor: selectedCategory === 'all' ? 'var(--color-ivory)' : 'transparent',
              color: selectedCategory === 'all' ? 'var(--color-terracotta)' : 'var(--color-charcoal)',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>All Categories</span>
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                style={{
                  textAlign: 'left',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: isSelected ? 700 : 500,
                  backgroundColor: isSelected ? 'var(--color-ivory)' : 'transparent',
                  color: isSelected ? 'var(--color-terracotta)' : 'var(--color-charcoal)',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span>{cat.name}</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                  {cat.itemCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider (INR) */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <label className="form-label">Max Price</label>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-charcoal)' }}>
            {formatCurrency(priceRange)}
          </span>
        </div>
        <input
          type="range"
          min="800"
          max="15000"
          step="100"
          value={priceRange}
          onChange={(e) => onChangePriceRange(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--color-terracotta)' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: '4px' }}>
          <span>₹800</span>
          <span>₹15,000</span>
        </div>
      </div>

      {/* In-Stock Only Toggle */}
      <div>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            fontWeight: 500
          }}
        >
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStockOnly(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: 'var(--color-sage)' }}
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </div>
  );
}

export default ProductFilter;
