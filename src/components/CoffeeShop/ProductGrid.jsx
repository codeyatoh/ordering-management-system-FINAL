import React from 'react';
import ProductCard from './ProductCard';

// This component shows a grid of product cards (coffee or pastry)
function ProductGrid({ items, onAddToCart, onViewProduct }) {
  return (
    // Container for all product cards
    <div className="items-grid">
      {/* Loop through each item and show a ProductCard for it */}
      {items.map(item => (
        <ProductCard key={item.id} item={item} onAddToCart={onAddToCart} onViewProduct={onViewProduct} />
      ))}
    </div>
  );
}

export default ProductGrid; 