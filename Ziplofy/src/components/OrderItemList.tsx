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
          <td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-500">
            No orders found
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default OrderItemList;

