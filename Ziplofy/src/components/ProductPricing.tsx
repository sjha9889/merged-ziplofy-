import React from 'react';
import { Product } from '../contexts/product.context';

interface ProductPricingProps {
  product: Product;
}

const ProductPricing: React.FC<ProductPricingProps> = ({ product }) => {
  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg">
      <h2 className="text-base font-medium text-gray-900 mb-4">
        Pricing
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            Price
          </p>
          <p className="text-sm font-medium text-gray-900">
            ${product.price.toFixed(2)}
          </p>
        </div>
        {typeof product.compareAtPrice === 'number' && (
          <div>
            <p className="text-xs text-gray-600 mb-1.5">
              Compare At
            </p>
            <p className="text-sm font-medium text-gray-900">
              ${product.compareAtPrice.toFixed(2)}
            </p>
          </div>
        )}
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            Cost
          </p>
          <p className="text-sm font-medium text-gray-900">
            ${product.cost?.toFixed(2) ?? '0.00'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            Profit
          </p>
          <p className="text-sm font-medium text-gray-900">
            ${product.profit?.toFixed(2) ?? '0.00'} ({product.marginPercent?.toFixed(1) ?? '0.0'}%)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductPricing;

