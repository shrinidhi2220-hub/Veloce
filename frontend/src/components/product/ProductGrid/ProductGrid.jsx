import React from 'react';
import { ProductCard } from '../ProductCard/ProductCard.jsx';
import { PackageOpen } from 'lucide-react';
import { Button } from '../../common/Button/Button.jsx';

export function ProductGrid({
  products = [],
  columns = 4, // 2 | 3 | 4
  emptyMessage = 'No products found matching your criteria.',
  onResetFilters = null
}) {
  if (!products.length) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '4rem 1.5rem',
          backgroundColor: 'var(--color-white)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          maxWidth: '520px',
          margin: '2rem auto'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-ivory)',
            color: 'var(--color-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}
        >
          <PackageOpen size={30} />
        </div>
        <h3 style={{ fontSize: '1.35rem', marginBottom: '8px' }}>No items discovered</h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', marginBottom: '1.5rem' }}>
          {emptyMessage}
        </p>
        {onResetFilters && (
          <Button variant="outline" onClick={onResetFilters}>
            Clear all filters
          </Button>
        )}
      </div>
    );
  }

  const gridClass = columns === 3 ? 'grid-3' : columns === 2 ? 'grid-2' : 'grid-4';

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
