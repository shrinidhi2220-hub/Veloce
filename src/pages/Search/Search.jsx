import React, { useState, useMemo } from 'react';
import { PRODUCTS } from '../../mock/products.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { ProductGrid } from '../../components/product/ProductGrid/ProductGrid.jsx';
import { Search as SearchIcon, X, Sparkles } from 'lucide-react';
import './Search.css';

const POPULAR_SUGGESTIONS = [
  'Terracotta',
  'Linen',
  'Olive Wood',
  'Speaker',
  'Ceramic Mug',
  'Candle',
  'Rug'
];

export function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 250);

  const searchResults = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return [];
    }
    const query = debouncedSearch.toLowerCase().trim();
    return PRODUCTS.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(query);
      const catMatch = product.category.toLowerCase().includes(query);
      const descMatch = product.description.toLowerCase().includes(query);
      return nameMatch || catMatch || descMatch;
    });
  }, [debouncedSearch]);

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-hero">
          <span style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-terracotta)', fontWeight: 700, letterSpacing: '0.12em', display: 'block', marginBottom: '8px' }}>
            Instant Market Discovery
          </span>
          <h1 style={{ marginBottom: '1.5rem' }}>Find What You Need</h1>

          <div className="search-input-box">
            <SearchIcon size={20} color="var(--color-muted)" style={{ flexShrink: 0 }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by object name, material, artisan category..."
              className="search-field"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={handleClear}
                style={{ padding: '4px', borderRadius: '50%', color: 'var(--color-muted)' }}
                aria-label="Clear query"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Quick Suggestions Chips */}
          <div className="search-suggestions">
            <span>Popular Searches:</span>
            {POPULAR_SUGGESTIONS.map((tag) => (
              <button
                key={tag}
                className="suggestion-chip"
                onClick={() => setSearchTerm(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Display */}
        {debouncedSearch.trim() ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                {searchResults.length} {searchResults.length === 1 ? 'match' : 'matches'} found for "{debouncedSearch}"
              </span>
              <button
                onClick={handleClear}
                style={{ fontSize: 'var(--text-xs)', color: 'var(--color-terracotta)', fontWeight: 600 }}
              >
                Clear Search
              </button>
            </div>

            <ProductGrid
              products={searchResults}
              columns={4}
              emptyMessage={`We couldn't find any objects matching "${debouncedSearch}". Try another keyword or browse our curated categories.`}
              onResetFilters={handleClear}
            />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-muted)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }}>
              <Sparkles size={16} color="var(--color-terracotta)" />
              <span>Or explore our top recommended artisan finds below</span>
            </div>
            <ProductGrid products={PRODUCTS.slice(0, 4)} columns={4} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
