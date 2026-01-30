import { RectangleStackIcon, TrashIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface Product {
  _id: string;
  title?: string;
  imageUrl?: string;
}

interface SelectedProductsToAddSectionProps {
  selectedProducts: Product[];
  loading?: boolean;
  onRemoveProduct: (productId: string) => void;
  onAddProducts: () => void;
  onClearAll: () => void;
}

const SelectedProductsToAddSection: React.FC<SelectedProductsToAddSectionProps> = ({
  selectedProducts,
  loading = false,
  onRemoveProduct,
  onAddProducts,
  onClearAll,
}) => {
  return (
    <div className="bg-white rounded border border-gray-200 p-4 mb-6">
      <h2 className="text-base font-medium text-gray-900 mb-3">
        Products to add to collection ({selectedProducts.length})
      </h2>
      <div className="border-t border-gray-200 mb-3"></div>

      {selectedProducts.length > 0 ? (
        <div className="space-y-2">
          {selectedProducts.map((product) => (
            <div
              key={product?._id || Math.random()}
              className="flex items-center justify-between p-3 border border-gray-200 rounded bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                  {product?.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title || 'Product'}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <RectangleStackIcon className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {product?.title || 'Untitled Product'}
                </span>
              </div>
              <button
                onClick={() => onRemoveProduct(product?._id)}
                className="p-1.5 hover:bg-gray-200 rounded transition-colors"
              >
                <TrashIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ))}

          <div className="flex gap-2 mt-3">
            <button
              onClick={onAddProducts}
              disabled={selectedProducts.length === 0 || loading}
              className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Adding products...'
                : `Add ${selectedProducts.length === 1 ? 'one product' : selectedProducts.length + ' products'} to collection`}
            </button>
            <button
              onClick={onClearAll}
              disabled={selectedProducts.length === 0}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear all
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-600">
          No products selected. Use the search above to add products to this collection.
        </p>
      )}
    </div>
  );
};

export default SelectedProductsToAddSection;

