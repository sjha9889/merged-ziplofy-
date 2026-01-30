import React from 'react';
import { Product } from '../contexts/product.context';

interface ProductOrganizationProps {
  product: Product;
}

const ProductOrganization: React.FC<ProductOrganizationProps> = ({ product }) => {
  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg">
      <h2 className="text-base font-medium text-gray-900 mb-4">
        Organization
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            Product Type
          </p>
          <p className="text-sm text-gray-900">
            {product.productType?.name || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            Vendor
          </p>
          <p className="text-sm text-gray-900">
            {product.vendor?.name || 'N/A'}
          </p>
        </div>
      </div>
      {product.tagIds && product.tagIds.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-gray-600 mb-2">
            Tags
          </p>
          <div className="flex gap-2 flex-wrap">
            {product.tagIds.map((tag) => (
              <span key={tag._id} className="px-2.5 py-1 rounded text-xs font-medium border border-gray-200 text-gray-700">
                {tag?.name || 'N/A'}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductOrganization;

