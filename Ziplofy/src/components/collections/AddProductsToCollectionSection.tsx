import { MagnifyingGlassIcon, RectangleStackIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface Product {
  _id: string;
  title?: string;
  imageUrl?: string;
}

interface AddProductsToCollectionSectionProps {
  searchQuery: string;
  filteredProducts: Product[];
  selectedProducts: Product[];
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onProductSelect: (product: Product) => void;
}

const AddProductsToCollectionSection: React.FC<AddProductsToCollectionSectionProps> = ({
  searchQuery,
  filteredProducts,
  selectedProducts,
  onSearchChange,
  onProductSelect,
}) => {
  const showSearchDropdown = searchQuery.trim() && filteredProducts.length > 0;

  return (
    <div className="bg-white rounded border border-gray-200 p-4 mb-6">
      <h2 className="text-base font-medium text-gray-900 mb-3">Add products into the collection</h2>
      <div className="border-t border-gray-200 mb-3"></div>
      <div className="relative">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by title, description, or SKU"
            value={searchQuery}
            onChange={onSearchChange}
            className="w-full pl-9 pr-3 py-2 text-base border border-gray-200 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
          />
        </div>

        {/* Search Results Dropdown */}
        {showSearchDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-[300px] overflow-y-auto">
            {filteredProducts.slice(0, 10).map((product) => {
              const isSelected = selectedProducts.some((p) => p?._id === product?._id);
              return (
                <button
                  key={product?._id || Math.random()}
                  onClick={() => onProductSelect(product)}
                  disabled={isSelected}
                  className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                    isSelected ? 'opacity-60 bg-gray-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-green-500' : 'bg-gray-900'
                    }`}
                  >
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
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {product?.title || 'Untitled Product'}
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Selected
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {searchQuery.trim() && filteredProducts.length === 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg">
            <div className="px-3 py-2 text-sm text-gray-500">No products found</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProductsToCollectionSection;

