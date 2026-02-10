import { ChatBubbleLeftRightIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import React from 'react';

export interface OrderItemData {
  orderId: string;
  date: string;
  customer: string;
  paymentStatus: 'pending' | 'success';
  total: number;
  delivery: string;
  items: number;
  fulfillmentStatus: 'unfulfilled' | 'fulfilled';
}

interface OrderItemProps {
  order: OrderItemData;
  isSelected?: boolean;
  onSelect?: (orderId: string) => void;
  onView?: (orderId: string) => void;
  onChat?: (orderId: string) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({
  order,
  isSelected = false,
  onSelect,
  onView,
  onChat,
}) => {
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Selection Radio */}
      <td className="px-4 py-4">
        <input
          type="radio"
          checked={isSelected}
          onChange={() => onSelect?.(order.orderId)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      </td>

      {/* Order ID */}
      <td className="px-4 py-4">
        <button
          onClick={() => onView?.(order.orderId)}
          className="text-sm font-medium text-gray-900 hover:text-gray-700 hover:underline transition-colors cursor-pointer"
        >
          {order.orderId ?? '—'}
        </button>
      </td>

      {/* Date */}
      <td className="px-4 py-4">
        <span className="text-sm text-gray-600">{formatDate(order.date)}</span>
      </td>

      {/* Customer */}
      <td className="px-4 py-4">
        <span className="text-sm text-gray-900">{order.customer}</span>
      </td>

      {/* Payment Status */}
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            order.paymentStatus === 'pending'
              ? 'bg-orange-100 text-orange-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              order.paymentStatus === 'pending' ? 'bg-orange-500' : 'bg-green-500'
            }`}
          />
          {order.paymentStatus === 'pending' ? 'Pending' : 'Success'}
        </span>
      </td>

      {/* Total */}
      <td className="px-4 py-4">
        <span className="text-sm font-semibold text-gray-900">{formatCurrency(order.total)}</span>
      </td>

      {/* Delivery */}
      <td className="px-4 py-4">
        <span className="text-sm text-gray-600">{order.delivery}</span>
      </td>

      {/* Items */}
      <td className="px-4 py-4">
        <span className="text-sm text-gray-600">
          {order.items} items
        </span>
      </td>

      {/* Fulfillment Status */}
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            order.fulfillmentStatus === 'unfulfilled'
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              order.fulfillmentStatus === 'unfulfilled' ? 'bg-red-500' : 'bg-green-500'
            }`}
          />
          {order.fulfillmentStatus === 'unfulfilled' ? 'Unfulfilled' : 'Fulfilled'}
        </span>
      </td>

      {/* Action Icons */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onView?.(order.orderId)}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            aria-label="View order"
          >
            <DocumentTextIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onChat?.(order.orderId)}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            aria-label="Chat"
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default OrderItem;

