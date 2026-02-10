import {
  ArrowUpTrayIcon,
  CalendarIcon,
  ChevronDownIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FulfilledOrdersOverTimeCard from '../components/FulfilledOrdersOverTimeCard';
import GridBackgroundWrapper from '../components/GridBackgroundWrapper';
import OrderItemsOverTimeCard from '../components/OrderItemsOverTimeCard';
import OrderTable from '../components/OrderTable';
import ReturnsOrdersCard from '../components/ReturnsOrdersCard';
import TotalOrdersCard from '../components/TotalOrdersCard';
import { useAdminOrders } from '../contexts/admin-order.context';
import { useStore } from '../contexts/store.context';
import type { OrderItemData } from '../components/OrderItem';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeStoreId } = useStore();
  const { orders, loading, error, getOrdersByStoreId } = useAdminOrders();
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);

  useEffect(() => {
    if (activeStoreId) {
      getOrdersByStoreId(activeStoreId).catch(() => {});
    }
  }, [activeStoreId, getOrdersByStoreId]);

  const tableOrders: OrderItemData[] = useMemo(() => {
    return orders.map((o) => {
      const customer = o.customerId
        ? [o.customerId.firstName, o.customerId.lastName].filter(Boolean).join(' ').trim() || o.customerId.email || '—'
        : '—';
      return {
        orderId: o._id,
        date: o.orderDate || o.createdAt || '',
        customer,
        paymentStatus: o.paymentStatus === 'unpaid' ? 'pending' : 'success',
        total: o.total ?? 0,
        delivery: 'N/A',
        items: o.items?.length ?? 0,
        fulfillmentStatus: (o.status === 'shipped' || o.status === 'delivered') ? 'fulfilled' : 'unfulfilled',
      };
    });
  }, [orders]);

  const handleExport = useCallback(() => {
    console.log('Export clicked');
    // TODO: Implement export functionality
  }, []);

  const handleCreateOrder = useCallback(() => {
    navigate('/orders/create');
  }, [navigate]);

  const handleAddOrder = useCallback(() => {
    console.log('Add order clicked');
    // TODO: Implement add order functionality
  }, []);

  const handleOrderSelect = useCallback((orderId: string) => {
    console.log('Order selected:', orderId);
    // TODO: Implement order selection
  }, []);

  const handleOrderView = useCallback((orderId: string) => {
    navigate(`/orders/${orderId}`);
  }, [navigate]);

  const handleOrderChat = useCallback((orderId: string) => {
    console.log('Chat with order:', orderId);
    // TODO: Implement chat functionality
  }, []);

  const handleDateRangeToggle = useCallback(() => {
    setIsDateRangeOpen((prev) => !prev);
  }, []);

  const handleMoreActionsToggle = useCallback(() => {
    setIsMoreActionsOpen((prev) => !prev);
  }, []);

  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen pt-3 px-4 pb-6 relative" style={{ position: 'relative', zIndex: 1 }}>
        <div className="max-w-[1600px] mx-auto">
          {/* Header Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              {/* Left Side: Title and Date Range */}
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-medium text-gray-900">Ordersssssssssssss</h1>
                
                {/* Date Range Selector */}
                <button
                  onClick={handleDateRangeToggle}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-200 rounded text-xs text-gray-600 bg-white hover:bg-gray-50 transition-colors"
                >
                  <CalendarIcon className="w-3.5 h-3.5 text-gray-500" />
                  <span>Oct 1 - Oct 30, 2025</span>
                  <ChevronDownIcon className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>

              {/* Right Side: Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Export Button */}
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded text-xs text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <ArrowUpTrayIcon className="w-3.5 h-3.5" />
                  Export
                </button>

                {/* More Actions Button */}
                <button
                  onClick={handleMoreActionsToggle}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded text-xs text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  More actions
                  <ChevronDownIcon className="w-3.5 h-3.5" />
                </button>

                {/* Create Order Button */}
                <button
                  onClick={handleCreateOrder}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800 transition-colors"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  Create Order
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Metric Cards Row */}
            <div className="flex gap-3">
              <TotalOrdersCard totalOrders={orders.length} percentageChange={0} />
              <OrderItemsOverTimeCard orderItems={orders.reduce((sum, o) => sum + (o.items?.length ?? 0), 0)} percentageChange={0} />
              <ReturnsOrdersCard returnsOrders={0} percentageChange={0} />
              <FulfilledOrdersOverTimeCard fulfilledOrders={orders.filter((o) => o.status === 'shipped' || o.status === 'delivered').length} percentageChange={0} />
            </div>

            {/* Order Table */}
            {loading ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
                <p className="mt-3 text-sm text-gray-600">Loading orders...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-sm text-red-600">{error}</p>
                {activeStoreId && (
                  <button
                    onClick={() => getOrdersByStoreId(activeStoreId)}
                    className="mt-3 text-sm font-medium text-gray-900 hover:underline"
                  >
                    Retry
                  </button>
                )}
              </div>
            ) : (
              <OrderTable
                orders={tableOrders}
                onAddOrder={handleAddOrder}
                onOrderSelect={handleOrderSelect}
                onOrderView={handleOrderView}
                onOrderChat={handleOrderChat}
              />
            )}
          </div>
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default OrdersPage;
