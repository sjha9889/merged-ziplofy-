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
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 pl-4 border-l-4 border-l-blue-500/60">
        <h2 className="text-sm font-semibold text-gray-900">Product Options</h2>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {product.variants.map((opt) => (
          <div key={opt._id} className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-2">
              {opt.optionName}
            </p>
            <div className="flex gap-2 flex-wrap">
              {opt.values.map(v => (
                <span key={v} className="px-2.5 py-1 rounded-lg text-xs font-medium border border-gray-200 text-gray-700">
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

