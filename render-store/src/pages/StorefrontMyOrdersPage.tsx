import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPackage, FiChevronRight, FiMapPin, FiCreditCard, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiShoppingBag, FiCalendar, FiBox } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useStorefrontOrder, type StorefrontOrder } from '../contexts/storefront-order.context';
import { formatINR } from '../utils/currency';

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
    <main className="account-page">
      <div className="account-inner">
        <nav className="account-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="account-breadcrumb-sep">•</span>
          <span className="account-breadcrumb-current">User Dashboard</span>
          <span className="account-breadcrumb-sep">•</span>
          <span className="account-breadcrumb-current">Orders History</span>
        </nav>

        <div className="account-layout">
          <aside className="account-sidebar">
            <nav className="account-nav" aria-label="Account navigation">
              <button type="button" className="account-nav-item" onClick={() => navigate('/profile')}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                My Profile
              </button>
              <button type="button" className="account-nav-item active">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Orders
              </button>
              <button type="button" className="account-nav-item" onClick={() => navigate('/')}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Continue Shopping
              </button>
            </nav>
          </aside>

          <div className="account-content">
        <div className="account-panel account-panel-orders">
          <h1 className="account-content-title">Orders History</h1>

        {!user && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center account-panel">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16 px-4"
          >
            {/* Animated Illustration */}
            <div className="relative mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <FiShoppingBag className="w-16 h-16 text-gray-300" />
                </motion.div>
              </motion.div>
              
              {/* Decorative elements */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center"
              >
                <span className="text-amber-500 text-lg">✨</span>
              </motion.div>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="absolute -bottom-1 -left-3 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center"
              >
                <span className="text-blue-500 text-sm">💫</span>
              </motion.div>
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-center max-w-md"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No orders yet</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Your order history is empty. Once you make a purchase, you'll be able to track all your orders here.
              </p>
              
              {/* CTA Button */}
              <motion.button
                type="button"
                onClick={() => navigate('/')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
              >
                <FiShoppingBag className="w-5 h-5" />
                <span>Start Shopping</span>
              </motion.button>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="grid grid-cols-3 gap-8 mt-16 max-w-xl"
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
                  <FiTruck className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-xs text-gray-600 font-medium">Fast Delivery</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                  <FiPackage className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs text-gray-600 font-medium">Easy Tracking</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-3">
                  <FiCheckCircle className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-xs text-gray-600 font-medium">Secure Checkout</p>
              </div>
            </motion.div>
          </motion.div>
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

              <div className="account-orders-tabs" role="tablist">
                {(['all', 'pending', 'shipped', 'delivered'] as OrderFilter[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`account-order-tab ${filter === f ? 'active' : ''}`}
                    role="tab"
                    data-filter={f}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              <div className="account-orders-list flex-1 overflow-y-auto space-y-3 pr-1">
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
                      className={`account-order-card ${isSelected ? 'border-[#d4af37] border-2 shadow-lg' : 'border-gray-200'}`}
                      data-order-status={order.status}
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
                        
                        <div className="flex-1 min-w-0 account-order-details">
                          <div className="account-order-header flex items-start justify-between gap-2">
                            <div>
                              <span className="account-order-id text-sm font-semibold text-gray-900">
                                Order ID : #{order._id.slice(-8).toUpperCase()}
                              </span>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {formatDate(order.orderDate)}
                              </p>
                            </div>
                            <FiChevronRight className={`w-5 h-5 transition-colors ${isSelected ? 'text-[#d4af37]' : 'text-gray-400'}`} />
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className={`account-order-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusConfig.bgLight} ${statusConfig.text}`}>
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
        </div>
      </div>
    </main>
  );
};

export default StorefrontMyOrdersPage;
