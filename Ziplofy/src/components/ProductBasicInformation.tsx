import React from 'react';
import { Product } from '../contexts/product.context';

interface ProductBasicInformationProps {
  product: Product;
}

const ProductBasicInformation: React.FC<ProductBasicInformationProps> = ({ product }) => {
  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg">
      <h2 className="text-base font-medium text-gray-900 mb-4">
        Basic Information
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            Category
          </p>
          <p className="text-sm text-gray-900">
            {product.category?.name || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            SKU
          </p>
          <p className="text-sm text-gray-900">
            {product.sku}
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

