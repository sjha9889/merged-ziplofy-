import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useState } from 'react';
import OrderProductItem, { OrderProductItemData } from './OrderProductItem';

interface OrderProductSearchSectionProps {
  products?: OrderProductItemData[];
  onProductsChange?: (products: OrderProductItemData[]) => void;
  onAddCustomItem?: () => void;
  onBrowse?: () => void;
}

const OrderProductSearchSection: React.FC<OrderProductSearchSectionProps> = ({
  products = [
    {
      id: '1',
      collectionName: 'Collection Name',
      productName: 'Gaming Console',
      variant: 'Medium',
      color: 'Gray',
      colorSwatch: '#9CA3AF',
      quantity: 3,
      unitPrice: 500.0,
      totalPrice: 1500.0,
    },
  ],
  onProductsChange,
  onAddCustomItem,
  onBrowse,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // TODO: Implement product search functionality
  }, []);

  const handleQuantityChange = useCallback(
    (id: string, quantity: number) => {
      const updatedProducts = products.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            quantity,
            totalPrice: quantity * product.unitPrice,
          };
        }
        return product;
      });
      if (onProductsChange) {
        onProductsChange(updatedProducts);
      }
    },
    [products, onProductsChange]
  );

  const handleRemove = useCallback(
    (id: string) => {
      const updatedProducts = products.filter((product) => product.id !== id);
      if (onProductsChange) {
        onProductsChange(updatedProducts);
      }
    },
    [products, onProductsChange]
  );

  const handleAddCustomItem = useCallback(() => {
    if (onAddCustomItem) {
      onAddCustomItem();
    } else {
      console.log('Add custom item clicked');
    }
  }, [onAddCustomItem]);

  const handleBrowse = useCallback(() => {
    if (onBrowse) {
      onBrowse();
    } else {
      console.log('Browse clicked');
    }
  }, [onBrowse]);

  // Get current date and time for reservation text
  const getReservationText = useCallback(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    return `Items reserved until today at ${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Products</h3>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600">{getReservationText()}</span>
            <button
              onClick={handleAddCustomItem}
              className="text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Add custom item
            </button>
            <button
              onClick={handleBrowse}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Browse
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Informational Text */}
        <p className="text-xs text-gray-500 mt-3">
          Use this personalized guide to get your store up and running.
        </p>
      </div>

      {/* Product List */}
      <div className="px-6 py-4">
        {products.length > 0 ? (
          <div className="space-y-0">
            {products.map((product) => (
              <OrderProductItem
                key={product.id}
                product={product}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500">No products added yet. Search and add products to this order.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderProductSearchSection;

