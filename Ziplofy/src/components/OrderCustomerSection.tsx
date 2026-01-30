import { PlusIcon, ShoppingBagIcon, UserIcon } from '@heroicons/react/24/outline';
import React, { useCallback } from 'react';

export interface CustomerInfo {
  id?: string;
  name: string;
  orderCount?: number;
  isTaxExempt?: boolean;
}

interface OrderCustomerSectionProps {
  customer?: CustomerInfo;
  onCreateNewCustomer?: () => void;
}

const OrderCustomerSection: React.FC<OrderCustomerSectionProps> = ({
  customer = {
    name: 'Alex Jander',
    orderCount: 0,
    isTaxExempt: true,
  },
  onCreateNewCustomer,
}) => {
  const handleCreateNewCustomer = useCallback(() => {
    if (onCreateNewCustomer) {
      onCreateNewCustomer();
    } else {
      console.log('Create new customer clicked');
    }
  }, [onCreateNewCustomer]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="px-6 py-4">
        {/* Header with Title and Create Button */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Customer</h3>
          <button
            onClick={handleCreateNewCustomer}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center">
              <PlusIcon className="w-4 h-4 text-gray-400" />
            </div>
            <span>Create a new customer</span>
          </button>
        </div>

        {/* Customer Info */}
        <div className="space-y-2">
          {/* Customer Name */}
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-900">{customer.name}</span>
          </div>
          
          {/* Order Count */}
          <div className="flex items-center gap-2">
            <ShoppingBagIcon className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-900">
              {customer.orderCount === 0 || customer.orderCount === undefined
                ? 'No orders'
                : `${customer.orderCount} ${customer.orderCount === 1 ? 'order' : 'orders'}`}
            </span>
          </div>
        </div>

        {/* Tax Exempt Status */}
        {customer.isTaxExempt && (
          <p className="text-sm text-gray-500 mt-3">Customer is tax-exempt</p>
        )}
      </div>
    </div>
  );
};

export default OrderCustomerSection;

