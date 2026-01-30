import React from 'react';
import { Product } from '../contexts/product.context';

interface ProductStatusDetailsProps {
  product: Product;
}

const ProductStatusDetails: React.FC<ProductStatusDetailsProps> = ({ product }) => {
  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg">
      <h2 className="text-base font-medium text-gray-900 mb-4">
        Status & Details
      </h2>
      
      <div className="space-y-4">
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
            {new Date(product.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            Updated
          </p>
          <p className="text-sm text-gray-900">
            {new Date(product.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductStatusDetails;

