import {
  ArrowUpTrayIcon,
  CalendarIcon,
  ChevronDownIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FulfilledOrdersOverTimeCard from '../components/FulfilledOrdersOverTimeCard';
import GridBackgroundWrapper from '../components/GridBackgroundWrapper';
import OrderItemsOverTimeCard from '../components/OrderItemsOverTimeCard';
import OrderTable from '../components/OrderTable';
import ReturnsOrdersCard from '../components/ReturnsOrdersCard';
import TotalOrdersCard from '../components/TotalOrdersCard';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);

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
    // Remove # prefix if present and navigate to order details
    const cleanOrderId = orderId.startsWith('#') ? orderId.slice(1) : orderId;
    navigate(`/orders/${cleanOrderId}`);
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
                <h1 className="text-xl font-medium text-gray-900">Orders</h1>
                
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
              <TotalOrdersCard totalOrders={21} percentageChange={25.2} />
              <OrderItemsOverTimeCard orderItems={15} percentageChange={18.2} />
              <ReturnsOrdersCard returnsOrders={0} percentageChange={-1.2} />
              <FulfilledOrdersOverTimeCard fulfilledOrders={12} percentageChange={12.2} />
            </div>

            {/* Order Table */}
            <OrderTable
              onAddOrder={handleAddOrder}
              onOrderSelect={handleOrderSelect}
              onOrderView={handleOrderView}
              onOrderChat={handleOrderChat}
            />
          </div>
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default OrdersPage;
