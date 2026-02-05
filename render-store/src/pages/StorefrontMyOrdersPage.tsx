import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiChevronDown, FiChevronUp, FiMapPin, FiCreditCard, FiTruck, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import StorefrontNavbar from '../components/StorefrontNavbar';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useStorefrontOrder, type StorefrontOrder } from '../contexts/storefront-order.context';

const NAVBAR_HEIGHT = 64;

const StorefrontMyOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, checkAuth } = useStorefrontAuth();
  const { orders, loading, error, getOrdersByCustomerId } = useStorefrontOrder();
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user?._id) getOrdersByCustomerId(user._id).catch(() => {});
  }, [user?._id, getOrdersByCustomerId]);

  const toggleOrder = (orderId: string) => {
    setExpandedOrders(prev => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount: number) => `$${(amount / 100).toFixed(2)}`;

  const getStatusColor = (status: StorefrontOrder['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'paid': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-[#f5f1e8] text-[#2b1e1e] border-[#e8e0d5]';
    }
  };

  const getPaymentStatusColor = (status: StorefrontOrder['paymentStatus']) => {
    switch (status) {
      case 'paid': return 'bg-green-50 text-green-700 border-green-200';
      case 'unpaid': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'refunded': return 'bg-[#f5f1e8] text-[#2b1e1e] border-[#e8e0d5]';
      default: return 'bg-[#f5f1e8] text-[#2b1e1e] border-[#e8e0d5]';
    }
  };

  const getStatusIcon = (status: StorefrontOrder['status']) => {
    switch (status) {
      case 'delivered': return <FiCheckCircle className="w-4 h-4" />;
      case 'shipped': return <FiTruck className="w-4 h-4" />;
      case 'paid': return <FiCheckCircle className="w-4 h-4" />;
      case 'pending': return <FiClock className="w-4 h-4" />;
      case 'cancelled': return <FiXCircle className="w-4 h-4" />;
      default: return <FiClock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8]/50 text-gray-900">
      <StorefrontNavbar />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16" style={{ paddingTop: `${NAVBAR_HEIGHT + 32}px` }}>
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#0c100c]" style={{ fontFamily: 'var(--font-serif)' }}>My Orders</h1>
          <p className="mt-2 text-sm text-[#2b1e1e]">View and track all your orders</p>
        </div>

        {!user && (
          <div className="rounded-lg border border-[#e8e0d5] bg-white p-4 text-sm text-[#2b1e1e]">
            Please login to view your orders.
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e8e0d5] border-t-[#d4af37]" />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="mt-6 rounded-xl border border-[#e8e0d5]/80 bg-white p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-[#f5f1e8] text-[#2b1e1e]">
              <FiPackage className="text-3xl" />
            </div>
            <div className="mt-4 text-base font-semibold text-[#0c100c]">No orders yet</div>
            <div className="mt-1 text-sm text-[#2b1e1e]">
              You haven&apos;t placed any orders. Start shopping to see your orders here.
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-6 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrders.has(order._id);
              const shippingAddress = typeof order.shippingAddressId === 'object' ? order.shippingAddressId : null;
              
              return (
                <div key={order._id} className="rounded-xl border border-[#e8e0d5]/80 bg-white overflow-hidden">
                  {/* Order Header */}
                  <div 
                    className="p-5 cursor-pointer hover:bg-[#f5f1e8]/50 transition-colors"
                    onClick={() => toggleOrder(order._id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-base font-semibold text-gray-900">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </h3>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-[#2b1e1e] flex-wrap">
                          <span>Placed on {formatDate(order.orderDate)}</span>
                          {order.items && order.items.length > 0 && (
                            <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">{formatCurrency(order.total)}</div>
                          {order.items && order.items.length > 0 && (
                            <div className="text-xs text-[#2b1e1e] mt-0.5">
                              {order.items.reduce((sum, item) => sum + item.quantity, 0)} {order.items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'item' : 'items'}
                            </div>
                          )}
                        </div>
                        <button className="p-1 text-gray-400 hover:text-[#2b1e1e] transition-colors">
                          {isExpanded ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {isExpanded && (
                    <div className="border-t border-[#e8e0d5] p-5 space-y-6">
                      {/* Order Items */}
                      {order.items && order.items.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Order Items</h4>
                          <div className="space-y-3">
                            {order.items.map((item) => {
                              const variant = typeof item.productVariantId === 'object' ? item.productVariantId : null;
                              const productTitle = 'Product Item'; // Product title might not be available in variant
                              const imageUrl = variant?.images?.[0] || 'https://via.placeholder.com/100x100?text=Product';
                              const sku = variant?.sku || 'N/A';
                              const optionValues = variant?.optionValues || {};
                              
                              return (
                                <div key={item._id} className="flex gap-4 p-3 rounded-lg border border-[#e8e0d5] bg-[#f5f1e8]/50">
                                  <img 
                                    src={imageUrl} 
                                    alt={productTitle}
                                    className="w-16 h-16 rounded-lg object-cover border border-[#e8e0d5]"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h5 className="text-sm font-semibold text-gray-900 mb-1">{productTitle}</h5>
                                    {Object.keys(optionValues).length > 0 && (
                                      <div className="text-xs text-[#2b1e1e] mb-1">
                                        {Object.entries(optionValues).map(([key, value]) => (
                                          <span key={key} className="mr-2">
                                            {key}: {String(value)}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                    <div className="text-xs text-[#2b1e1e]">SKU: {sku}</div>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <div className="text-sm font-semibold text-gray-900">Qty: {item.quantity}</div>
                                    <div className="text-sm font-medium text-gray-700 mt-1">{formatCurrency(item.total)}</div>
                                    <div className="text-xs text-[#2b1e1e] mt-0.5">{formatCurrency(item.price)} each</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Shipping Address */}
                      {shippingAddress && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <FiMapPin className="w-4 h-4" />
                            Shipping Address
                          </h4>
                          <div className="p-4 rounded-lg border border-[#e8e0d5] bg-[#f5f1e8]/50">
                            <div className="text-sm text-gray-900 font-medium mb-1">
                              {shippingAddress.firstName} {shippingAddress.lastName}
                            </div>
                            <div className="text-sm text-[#2b1e1e]">
                              {shippingAddress.company && `${shippingAddress.company}, `}
                              {shippingAddress.address}
                              {shippingAddress.apartment && `, ${shippingAddress.apartment}`}
                            </div>
                            <div className="text-sm text-[#2b1e1e]">
                              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.pinCode}
                            </div>
                            <div className="text-sm text-[#2b1e1e]">{shippingAddress.country}</div>
                            <div className="text-sm text-[#2b1e1e] mt-1">Phone: {shippingAddress.phoneNumber}</div>
                          </div>
                        </div>
                      )}

                      {/* Payment Information */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <FiCreditCard className="w-4 h-4" />
                          Payment Information
                        </h4>
                        <div className="p-4 rounded-lg border border-[#e8e0d5] bg-[#f5f1e8]/50">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-[#2b1e1e]">Payment Method</span>
                            <span className="text-sm font-medium text-gray-900">
                              {order.paymentMethod ? order.paymentMethod.replace('_', ' ').toUpperCase() : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-[#2b1e1e]">Payment Status</span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${getPaymentStatusColor(order.paymentStatus)}`}>
                              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Order Summary</h4>
                        <div className="p-4 rounded-lg border border-[#e8e0d5] bg-[#f5f1e8]/50 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-[#2b1e1e]">Subtotal</span>
                            <span className="text-gray-900 font-medium">{formatCurrency(order.subtotal)}</span>
                          </div>
                          {order.tax > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-[#2b1e1e]">Tax</span>
                              <span className="text-gray-900 font-medium">{formatCurrency(order.tax)}</span>
                            </div>
                          )}
                          {order.shippingCost > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-[#2b1e1e]">Shipping</span>
                              <span className="text-gray-900 font-medium">{formatCurrency(order.shippingCost)}</span>
                            </div>
                          )}
                          {order.shippingCost === 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-[#2b1e1e]">Shipping</span>
                              <span className="text-green-600 font-medium">Free</span>
                            </div>
                          )}
                          <div className="border-t border-[#e8e0d5] pt-2 mt-2 flex justify-between">
                            <span className="text-base font-semibold text-gray-900">Total</span>
                            <span className="text-base font-bold text-gray-900">{formatCurrency(order.total)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {order.notes && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Order Notes</h4>
                          <div className="p-4 rounded-lg border border-[#e8e0d5] bg-[#f5f1e8]/50">
                            <p className="text-sm text-[#2b1e1e]">{order.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StorefrontMyOrdersPage;
