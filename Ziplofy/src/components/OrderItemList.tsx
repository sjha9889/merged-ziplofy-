import React from 'react';
import OrderItem, { OrderItemData } from './OrderItem';

interface OrderItemListProps {
  orders: OrderItemData[];
  selectedOrderId?: string | null;
  onOrderSelect?: (orderId: string) => void;
  onOrderView?: (orderId: string) => void;
  onOrderChat?: (orderId: string) => void;
}

const OrderItemList: React.FC<OrderItemListProps> = ({
  orders,
  selectedOrderId,
  onOrderSelect,
  onOrderView,
  onOrderChat,
}) => {
  return (
    <tbody className="bg-white">
      {orders.length > 0 ? (
        orders.map((order) => (
          <OrderItem
            key={order.orderId}
            order={order}
            isSelected={selectedOrderId === order.orderId}
            onSelect={onOrderSelect}
            onView={onOrderView}
            onChat={onOrderChat}
          />
        ))
      ) : (
        <tr>
          <td colSpan={10} className="px-4 py-8 text-center text-sm text-gray-500">
            No orders found
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default OrderItemList;

