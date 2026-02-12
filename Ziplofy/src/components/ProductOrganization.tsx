import React from 'react';
import { Product } from '../contexts/product.context';

interface ProductOrganizationProps {
  product: Product;
}

const ProductOrganization: React.FC<ProductOrganizationProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 pl-4 border-l-4 border-l-blue-500/60">
        <h2 className="text-sm font-semibold text-gray-900">Organization</h2>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            Product Type
          </p>
          <p className="text-sm text-gray-900">
            {(product.productType && typeof product.productType === 'object' && product.productType.name) || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            Vendor
          </p>
          <p className="text-sm text-gray-900">
            {(product.vendor && typeof product.vendor === 'object' && product.vendor.name) || 'N/A'}
          </p>
        </div>
      </div>
      {Array.isArray(product.tagIds) && product.tagIds.length > 0 && (
        <div className="mt-4 col-span-full">
          <p className="text-xs text-gray-600 mb-2">Tags</p>
          <div className="flex gap-2 flex-wrap">
            {product.tagIds.map((tag) => (
              <span key={tag._id} className="px-2.5 py-1 rounded-lg text-xs font-medium border border-gray-200 text-gray-700">
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

