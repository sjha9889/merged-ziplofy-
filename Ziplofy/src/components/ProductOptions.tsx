import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
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
    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gradient-to-r from-gray-50/90 to-white px-5 py-3.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
          <AdjustmentsHorizontalIcon className="h-4 w-4 text-indigo-600" aria-hidden />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Options</h2>
          <p className="text-xs text-gray-500">Dimensions customers choose from</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
        {product.variants.map((opt) => (
          <div
            key={opt._id}
            className="rounded-xl border border-gray-200/80 bg-gray-50/30 p-4 shadow-sm"
          >
            <p className="text-sm font-semibold text-gray-900">{opt.optionName}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {opt.values.map((v) => (
                <span
                  key={v}
                  className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700"
                >
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
