import React, { useEffect, useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce.js';
import { productApi } from '../../services/productApi.js';
import { ProductGrid } from '../../components/product/ProductGrid/ProductGrid.jsx';
import { Search as SearchIcon, X, Sparkles } from 'lucide-react';
import './Search.css';

const POPULAR_SUGGESTIONS = ['Terracotta', 'Linen', 'Olive Wood', 'Ceramic Mug', 'Candle', 'Rug'];

export function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    let active = true;
    if (!debouncedSearch.trim()) { setSearchResults([]); setSearchError(''); return () => { active = false; }; }
    setLoading(true);
    productApi.search(debouncedSearch.trim(), { page: 1, limit: 30 })
      .then((response) => {
        if (!active) return;
        const rows = Array.isArray(response.data) ? response.data : [];
        setSearchResults(rows.map((p) => ({ ...p, categorySlug: String(p.category || 'marketplace').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), inStock: Number(p.stock || 0) > 0, images: Array.isArray(p.images) ? p.images : [], image: p.images?.[0] || 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=900&q=80' })));
        setSearchError('');
      })
      .catch((error) => { if (active) setSearchError(error.message || 'Search failed'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [debouncedSearch]);

  const handleClear = () => setSearchTerm('');
  return (
    <div className="search-page">
      <div className="container">
        <div className="search-hero">
          <span style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-terracotta)', fontWeight: 700, letterSpacing: '0.12em', display: 'block', marginBottom: '8px' }}>Instant Market Discovery</span>
          <h1 style={{ marginBottom: '1.5rem' }}>Find What You Need</h1>
          <div className="search-input-box">
            <SearchIcon size={20} color="var(--color-muted)" style={{ flexShrink: 0 }} />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search live products by name, category or description..." className="search-field" autoFocus />
            {searchTerm && <button onClick={handleClear} style={{ padding: '4px', borderRadius: '50%', color: 'var(--color-muted)' }} aria-label="Clear query"><X size={18} /></button>}
          </div>
          <div className="search-suggestions"><span>Popular Searches:</span>{POPULAR_SUGGESTIONS.map((tag) => <button key={tag} className="suggestion-chip" onClick={() => setSearchTerm(tag)}>{tag}</button>)}</div>
        </div>
        {debouncedSearch.trim() ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{loading ? 'Searching…' : `${searchResults.length} ${searchResults.length === 1 ? 'match' : 'matches'} found for "${debouncedSearch}"`}</span>
              <button onClick={handleClear} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-terracotta)', fontWeight: 600 }}>Clear Search</button>
            </div>
            {searchError && <p role="alert">{searchError}</p>}
            <ProductGrid products={searchResults} columns={4} emptyMessage={`No live products matched "${debouncedSearch}".`} onResetFilters={handleClear} />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}><div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-muted)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }}><Sparkles size={16} color="var(--color-terracotta)" /><span>Search the live VELOCE catalogue</span></div></div>
        )}
      </div>
    </div>
  );
}
export default Search;