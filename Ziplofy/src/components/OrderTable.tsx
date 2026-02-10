import { PlusIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useState } from 'react';
import { OrderItemData } from './OrderItem';
import OrderItemList from './OrderItemList';

type FilterTab = 'all' | 'unfulfilled' | 'unpaid' | 'open' | 'closed';

interface OrderTableProps {
  orders?: OrderItemData[];
  onAddOrder?: () => void;
  onOrderSelect?: (orderId: string) => void;
  onOrderView?: (orderId: string) => void;
  onOrderChat?: (orderId: string) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders = [],
  onAddOrder,
  onOrderSelect,
  onOrderView,
  onOrderChat,
}) => {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleTabChange = useCallback((tab: FilterTab) => {
    setActiveTab(tab);
  }, []);

  const handleAddClick = useCallback(() => {
    if (onAddOrder) {
      onAddOrder();
    } else {
      console.log('Add order clicked');
    }
  }, [onAddOrder]);

  const handleOrderSelect = useCallback(
    (orderId: string) => {
      setSelectedOrderId(orderId);
      if (onOrderSelect) {
        onOrderSelect(orderId);
      }
    },
    [onOrderSelect]
  );

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    switch (activeTab) {
      case 'unfulfilled':
        return order.fulfillmentStatus === 'unfulfilled';
      case 'unpaid':
        return order.paymentStatus === 'pending';
      case 'open':
        return order.fulfillmentStatus === 'unfulfilled' || order.paymentStatus === 'pending';
      case 'closed':
        return order.fulfillmentStatus === 'fulfilled' && order.paymentStatus === 'success';
      default:
        return true; // 'all'
    }
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Navigation Tabs and Add Button */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-0">
          <button
            onClick={() => handleTabChange('all')}
            className={`px-3 py-1.5 text-xs font-medium transition-colors relative ${
              activeTab === 'all'
                ? 'text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All
            {activeTab === 'all' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
          <button
            onClick={() => handleTabChange('unfulfilled')}
            className={`px-3 py-1.5 text-xs font-medium transition-colors relative ${
              activeTab === 'unfulfilled'
                ? 'text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Unfulfilled
            {activeTab === 'unfulfilled' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
          <button
            onClick={() => handleTabChange('unpaid')}
            className={`px-3 py-1.5 text-xs font-medium transition-colors relative ${
              activeTab === 'unpaid'
                ? 'text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Unpaid
            {activeTab === 'unpaid' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
          <button
            onClick={() => handleTabChange('open')}
            className={`px-3 py-1.5 text-xs font-medium transition-colors relative ${
              activeTab === 'open'
                ? 'text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Open
            {activeTab === 'open' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
          <button
            onClick={() => handleTabChange('closed')}
            className={`px-3 py-1.5 text-xs font-medium transition-colors relative ${
              activeTab === 'closed'
                ? 'text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Closed
            {activeTab === 'closed' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
        </div>

        {/* Add Button */}
        <button
          onClick={handleAddClick}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800 transition-colors"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Add
        </button>
      </div>

      {/* Table Container with Fixed Height and Scrollable Body */}
      <div className="overflow-x-auto">
        <div className="relative max-h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-gray-50">
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-2 text-left bg-gray-50">
                  <input
                    type="radio"
                    className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                  Order
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                  Customer
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                  Payment
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                  Total
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                  Delivery
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                  Items
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                  Fulfillment
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                  Action
                </th>
              </tr>
            </thead>
            <OrderItemList
              orders={filteredOrders}
              selectedOrderId={selectedOrderId}
              onOrderSelect={handleOrderSelect}
              onOrderView={onOrderView}
              onOrderChat={onOrderChat}
            />
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;

