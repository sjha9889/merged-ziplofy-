import React from 'react';
import { Product } from '../contexts/product.context';

interface ProductBasicInformationProps {
  product: Product;
}

const ProductBasicInformation: React.FC<ProductBasicInformationProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 pl-4 border-l-4 border-l-blue-500/60">
        <h2 className="text-sm font-semibold text-gray-900">Basic Information</h2>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            Category
          </p>
          <p className="text-sm text-gray-900">
            {(product.category && typeof product.category === 'object' && product.category.name) || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            SKU
          </p>
          <p className="text-sm text-gray-900">
            {product.sku || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            Barcode
          </p>
          <p className="text-sm text-gray-900">
            {product.barcode || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductBasicInformation;

