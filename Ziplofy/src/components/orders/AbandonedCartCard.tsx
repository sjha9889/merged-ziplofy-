import { EnvelopeIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useMemo } from 'react';

interface CartItem {
  _id: string;
  productVariant: {
    images?: string[];
    sku: string;
    price: number;
    optionValues: Record<string, string>;
  };
  quantity: number;
}

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

interface Cart {
  customer: Customer;
  totalItems: number;
  cartItems: CartItem[];
  lastUpdated: string;
}

interface AbandonedCartCardProps {
  cart: Cart;
  getInitials: (firstName: string, lastName: string) => string;
  formatDate: (dateString: string) => string;
  onSendEmail: (customer: Customer) => void;
  onViewDetails: (customerId: string) => void;
}

const AbandonedCartCard: React.FC<AbandonedCartCardProps> = ({
  cart,
  getInitials,
  formatDate,
  onSendEmail,
  onViewDetails,
}) => {
  const handleSendEmail = useCallback(() => {
    onSendEmail(cart.customer);
  }, [cart.customer, onSendEmail]);

  const handleViewDetails = useCallback(() => {
    onViewDetails(cart.customer._id);
  }, [cart.customer._id, onViewDetails]);

  const calculateTotal = useMemo(() => {
    return cart.cartItems.reduce((sum, item) => sum + (item.productVariant.price * item.quantity), 0);
  }, [cart.cartItems]);

  return (
    <div 
      className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Customer Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium flex-shrink-0">
                {getInitials(cart.customer.firstName, cart.customer.lastName)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {cart.customer.firstName} {cart.customer.lastName}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <EnvelopeIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <p className="text-xs text-gray-500 truncate">{cart.customer.email}</p>
                </div>
              </div>
            </div>
            
            {/* Cart Summary */}
            <div className="ml-11 mt-2 flex items-center gap-4 text-xs text-gray-500">
              <span>{cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'}</span>
              <span>•</span>
              <span>₹{calculateTotal.toFixed(2)}</span>
              <span>•</span>
              <span>{formatDate(cart.lastUpdated)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSendEmail();
              }}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 rounded transition-colors"
            >
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbandonedCartCard;

