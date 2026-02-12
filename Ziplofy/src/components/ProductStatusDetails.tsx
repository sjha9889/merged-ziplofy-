import React from 'react';
import { Product } from '../contexts/product.context';

interface ProductStatusDetailsProps {
  product: Product;
}

const ProductStatusDetails: React.FC<ProductStatusDetailsProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 pl-4 border-l-4 border-l-blue-500/60">
        <h2 className="text-sm font-semibold text-gray-900">Status & Details</h2>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            Status
          </p>
          <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${
            product.status === 'active' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {product.status}
          </span>
        </div>
        
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            Inventory Tracking
          </p>
          <p className="text-sm text-gray-900">
            {product.inventoryTrackingEnabled ? 'Enabled' : 'Disabled'}
          </p>
          {product.inventoryTrackingEnabled && (
            <p className="text-sm text-gray-900 mt-1">
              Quantity: {product.quantity ?? 0}
            </p>
          )}
        </div>
        
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            Continue Selling When Out of Stock
          </p>
          <p className="text-sm text-gray-900">
            {product.continueSellingWhenOutOfStock ? 'Yes' : 'No'}
          </p>
        </div>
        
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            Created
          </p>
          <p className="text-sm text-gray-900">
            {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : '—'}
          </p>
        </div>
        
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            Updated
          </p>
          <p className="text-sm text-gray-900">
            {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : '—'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductStatusDetails;

