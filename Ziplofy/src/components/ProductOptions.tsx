import React from 'react';
import { Product } from '../contexts/product.context';

interface ProductOptionsProps {
  product: Product;
}

const ProductOptions: React.FC<ProductOptionsProps> = ({ product }) => {
  if (!product.variants || product.variants.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg">
      <h2 className="text-base font-medium text-gray-900 mb-4">
        Product Options
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {product.variants.map((opt) => (
          <div key={opt._id} className="p-4 border border-gray-200 rounded">
            <p className="text-sm font-medium text-gray-900 mb-2">
              {opt.optionName}
            </p>
            <div className="flex gap-2 flex-wrap">
              {opt.values.map(v => (
                <span key={v} className="px-2.5 py-1 rounded text-xs font-medium border border-gray-200 text-gray-700">
                  {v}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductOptions;

