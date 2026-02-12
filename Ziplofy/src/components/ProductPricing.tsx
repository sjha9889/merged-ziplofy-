import React from 'react';
import { Product } from '../contexts/product.context';

interface ProductPricingProps {
  product: Product;
}

const ProductPricing: React.FC<ProductPricingProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 pl-4 border-l-4 border-l-blue-500/60">
        <h2 className="text-sm font-semibold text-gray-900">Pricing</h2>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-600 mb-1.5">Price</p>
          <p className="text-sm font-medium text-gray-900">₹{product.price != null ? Number(product.price).toFixed(2) : '0.00'}</p>
        </div>
        {typeof product.compareAtPrice === 'number' && (
          <div>
            <p className="text-xs text-gray-600 mb-1.5">Compare At</p>
            <p className="text-sm font-medium text-gray-900">₹{product.compareAtPrice.toFixed(2)}</p>
          </div>
        )}
        <div>
          <p className="text-xs text-gray-600 mb-1.5">Cost</p>
          <p className="text-sm font-medium text-gray-900">₹{product.cost != null ? Number(product.cost).toFixed(2) : '0.00'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1.5">Profit</p>
          <p className="text-sm font-medium text-gray-900">₹{product.profit != null ? Number(product.profit).toFixed(2) : '0.00'} ({product.marginPercent != null ? Number(product.marginPercent).toFixed(1) : '0.0'}%)</p>
        </div>
      </div>
    </div>
  );
};

export default ProductPricing;

