import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiChevronRight, FiMapPin, FiCreditCard, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiShoppingBag, FiCalendar, FiBox } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import StorefrontNavbar from '../components/StorefrontNavbar';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useStorefrontOrder, type StorefrontOrder } from '../contexts/storefront-order.context';
import { formatINR } from '../utils/currency';

const NAVBAR_HEIGHT = 64;

type OrderFilter = 'all' | 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

const StorefrontMyOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, checkAuth } = useStorefrontAuth();
  const { orders, loading, error, getOrdersByCustomerId } = useStorefrontOrder();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderFilter>('all');

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user?._id) getOrdersByCustomerId(user._id).catch(() => {});
  }, [user?._id, getOrdersByCustomerId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status: StorefrontOrder['status']) => {
    switch (status) {
      case 'pending': return { color: 'bg-amber-500', bgLight: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: FiClock, label: 'Pending' };
      case 'paid': return { color: 'bg-blue-500', bgLight: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: FiCreditCard, label: 'Paid' };
      case 'shipped': return { color: 'bg-purple-500', bgLight: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: FiTruck, label: 'Shipped' };
      case 'delivered': return { color: 'bg-green-500', bgLight: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: FiCheckCircle, label: 'Delivered' };
      case 'cancelled': return { color: 'bg-red-500', bgLight: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: FiXCircle, label: 'Cancelled' };
      default: return { color: 'bg-gray-500', bgLight: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', icon: FiClock, label: status };
    }
  };

  const getPaymentStatusConfig = (status: StorefrontOrder['paymentStatus']) => {
    switch (status) {
      case 'paid': return { bgLight: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
      case 'unpaid': return { bgLight: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
      case 'refunded': return { bgLight: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
      default: return { bgLight: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
    }
  };

  const filteredOrders = orders.filter(order => filter === 'all' || order.status === filter);

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalSpent: orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0),
  };

  const selectedOrderData = selectedOrder ? orders.find(o => o._id === selectedOrder) : null;

  const OrderProgressBar = ({ status }: { status: StorefrontOrder['status'] }) => {
    const steps = ['pending', 'paid', 'shipped', 'delivered'];
    const currentIndex = steps.indexOf(status);
    const isCancelled = status === 'cancelled';
    
    if (isCancelled) {
      return (
        <div className="flex items-center gap-2 py-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600">
            <FiXCircle className="w-4 h-4" />
          </div>
          <span className="text-sm text-red-600 font-medium">Order Cancelled</span>
        </div>
      );
    }
    
    return (
      <div className="py-4">
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const config = getStatusConfig(step as StorefrontOrder['status']);
            const Icon = config.icon;
            
            return (
              <div key={step} className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted 
                    ? `${config.color} border-transparent text-white` 
                    : 'bg-white border-gray-200 text-gray-400'
                } ${isCurrent ? 'ring-4 ring-offset-2 ring-opacity-30 ' + config.color.replace('bg-', 'ring-') : ''}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`mt-2 text-xs font-medium ${isCompleted ? config.text : 'text-gray-400'}`}>
                  {config.label}
                </span>
              </div>
            );
          })}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0" style={{ left: '10%', right: '10%' }}>
            <div 
              className="h-full bg-green-500 transition-all"
              style={{ width: `${Math.min(100, (currentIndex / (steps.length - 1)) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StorefrontNavbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16" style={{ paddingTop: `${NAVBAR_HEIGHT + 32}px` }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-1 text-gray-500">Track and manage your orders</p>
        </motion.div>

        {!user && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <FiPackage className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Please Login</h3>
            <p className="text-gray-500 mb-4">Login to view your order history</p>
            <button
              onClick={() => navigate('/auth/login')}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Login
            </button>
          </div>
        )}

        {user && loading && (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-gray-200 border-t-[#d4af37]" />
          </div>
        )}

        {user && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {user && !loading && !error && orders.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <FiShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Looks like you haven't placed any orders. Start shopping to see your orders here!
            </p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        )}

        {user && !loading && !error && orders.length > 0 && (
          <div className="max-h-screen overflow-y-scroll pb-16 mb-16 grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ height: 'calc(100vh - 160px)' }}>
            {/* Left Column - Order List */}
            <div className="lg:col-span-1 flex flex-col h-full">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-3 mb-4 flex-shrink-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <FiBox className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
                      <p className="text-xs text-gray-500">Total Orders</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-white rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                      <FiCheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{orderStats.delivered}</p>
                      <p className="text-xs text-gray-500">Delivered</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Filter Tabs */}
              <div className="bg-white rounded-xl border border-gray-200 p-1.5 flex gap-1 overflow-x-auto flex-shrink-0 mb-4">
                {(['all', 'pending', 'shipped', 'delivered'] as OrderFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`relative flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                      filter === f 
                        ? '' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {filter === f && (
                      <motion.span
                        layoutId="orderFilterTab"
                        className="absolute inset-0 bg-gray-900 rounded-lg"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className={`relative z-10 ${filter === f ? 'text-white' : ''}`}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </span>
                  </button>
                ))}
              </div>

              {/* Order List - Scrollable */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                <AnimatePresence mode="popLayout">
                {filteredOrders.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl border border-gray-200 p-6 text-center"
                  >
                    <p className="text-gray-500 text-sm">No {filter} orders found</p>
                  </motion.div>
                )}
                {filteredOrders.map((order, index) => {
                  const statusConfig = getStatusConfig(order.status);
                  const isSelected = selectedOrder === order._id;
                  const firstItem = order.items?.[0];
                  const variant = typeof firstItem?.productVariantId === 'object' ? firstItem.productVariantId : null;
                  const imageUrl = variant?.images?.[0];
                  
                  return (
                    <motion.div 
                      key={order._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      onClick={() => setSelectedOrder(order._id)}
                      className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-[#d4af37] shadow-lg shadow-[#d4af37]/10' 
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {imageUrl ? (
                            <img src={imageUrl} alt="Product" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FiPackage className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        {/* Order Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                #{order._id.slice(-8).toUpperCase()}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {formatDate(order.orderDate)}
                              </p>
                            </div>
                            <FiChevronRight className={`w-5 h-5 transition-colors ${isSelected ? 'text-[#d4af37]' : 'text-gray-400'}`} />
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusConfig.bgLight} ${statusConfig.text}`}>
                              <statusConfig.icon className="w-3 h-3" />
                              {statusConfig.label}
                            </span>
                            <span className="text-sm font-bold text-gray-900">{formatINR(order.total)}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column - Order Details */}
            <div className="lg:col-span-2 h-full">
              <AnimatePresence mode="wait">
              {!selectedOrderData ? (
                <motion.div
                  key="no-selection"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl border border-gray-200 p-12 text-center h-full flex flex-col items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <FiPackage className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Select an Order</h3>
                  <p className="text-gray-500 text-sm">Click on an order to view details</p>
                </motion.div>
              ) : (
                <motion.div
                  key={selectedOrderData._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden h-full flex flex-col"
                >
                  {/* Order Header - Fixed */}
                  <div className="p-6 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          Order #{selectedOrderData._id.slice(-8).toUpperCase()}
                        </h2>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <FiCalendar className="w-4 h-4" />
                          <span>Placed on {formatDateTime(selectedOrderData.orderDate)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{formatINR(selectedOrderData.total)}</p>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold mt-1 ${getPaymentStatusConfig(selectedOrderData.paymentStatus).bgLight} ${getPaymentStatusConfig(selectedOrderData.paymentStatus).text}`}>
                          Payment: {selectedOrderData.paymentStatus.charAt(0).toUpperCase() + selectedOrderData.paymentStatus.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <OrderProgressBar status={selectedOrderData.status} />
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto">
                  {/* Order Items */}
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FiShoppingBag className="w-4 h-4" />
                      Items ({selectedOrderData.items?.length || 0})
                    </h3>
                    <div className="space-y-3">
                      {selectedOrderData.items?.map((item) => {
                        const variant = typeof item.productVariantId === 'object' ? item.productVariantId : null;
                        const imageUrl = variant?.images?.[0];
                        const optionValues = variant?.optionValues || {};
                        
                        return (
                          <div key={item._id} className="flex gap-4 p-4 rounded-xl bg-gray-50">
                            <div className="w-20 h-20 rounded-lg bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                              {imageUrl ? (
                                <img src={imageUrl} alt="Product" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FiPackage className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900">
                                {variant?.sku || 'Product'}
                              </h4>
                              {Object.keys(optionValues).length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {Object.entries(optionValues).map(([key, value]) => (
                                    <span key={key} className="text-xs px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-600">
                                      {key}: {String(value)}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div className="flex items-center justify-between mt-3">
                                <span className="text-xs text-gray-500">
                                  {formatINR(item.price)} × {item.quantity}
                                </span>
                                <span className="text-sm font-bold text-gray-900">{formatINR(item.total)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Details Grid */}
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Shipping Address */}
                    {typeof selectedOrderData.shippingAddressId === 'object' && selectedOrderData.shippingAddressId && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <FiMapPin className="w-4 h-4" />
                          Shipping Address
                        </h3>
                        <div className="p-4 rounded-xl bg-gray-50">
                          <p className="font-medium text-gray-900">
                            {selectedOrderData.shippingAddressId.firstName} {selectedOrderData.shippingAddressId.lastName}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {selectedOrderData.shippingAddressId.address}
                            {selectedOrderData.shippingAddressId.apartment && `, ${selectedOrderData.shippingAddressId.apartment}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedOrderData.shippingAddressId.city}, {selectedOrderData.shippingAddressId.state} {selectedOrderData.shippingAddressId.pinCode}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            📞 {selectedOrderData.shippingAddressId.phoneNumber}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Payment Info */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FiCreditCard className="w-4 h-4" />
                        Payment Details
                      </h3>
                      <div className="p-4 rounded-xl bg-gray-50 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Method</span>
                          <span className="text-sm font-medium text-gray-900">
                            {selectedOrderData.paymentMethod?.toUpperCase() || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Subtotal</span>
                          <span className="text-sm text-gray-900">{formatINR(selectedOrderData.subtotal)}</span>
                        </div>
                        {selectedOrderData.tax > 0 && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Tax</span>
                            <span className="text-sm text-gray-900">{formatINR(selectedOrderData.tax)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Shipping</span>
                          <span className={`text-sm ${selectedOrderData.shippingCost === 0 ? 'text-green-600 font-medium' : 'text-gray-900'}`}>
                            {selectedOrderData.shippingCost === 0 ? 'FREE' : formatINR(selectedOrderData.shippingCost)}
                          </span>
                        </div>
                        <div className="pt-3 border-t border-gray-200 flex justify-between">
                          <span className="text-sm font-semibold text-gray-900">Total</span>
                          <span className="text-lg font-bold text-gray-900">{formatINR(selectedOrderData.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Notes */}
                  {selectedOrderData.notes && (
                    <div className="px-6 pb-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Order Notes</h3>
                      <p className="text-sm text-gray-600 p-4 rounded-xl bg-gray-50">{selectedOrderData.notes}</p>
                    </div>
                  )}
                  </div>
                </motion.div>
              )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorefrontMyOrdersPage;
