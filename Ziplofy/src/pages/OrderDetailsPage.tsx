import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ShoppingBagIcon,
  UserIcon,
  MapPinIcon,
  CreditCardIcon,
  ReceiptRefundIcon,
  TruckIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import GridBackgroundWrapper from '../components/GridBackgroundWrapper';
import { useAdminOrders } from '../contexts/admin-order.context';
import type { AdminOrder, AdminOrderAddressRef, AdminOrderCustomerRef } from '../contexts/admin-order.context';

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById } = useAdminOrders();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getOrderById(id);
      setOrder(data);
    } catch {
      setOrder(null);
      setError('Failed to load order');
    } finally {
      setLoading(false);
    }
  }, [id, getOrderById]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const formatCurrency = (amount: number) => {
    return `$${Number(amount).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAddressName = (addr: AdminOrderAddressRef | undefined) => {
    if (!addr) return '—';
    return [addr.firstName, addr.lastName].filter(Boolean).join(' ').trim() || '—';
  };

  const formatPaymentMethod = (method?: string) => {
    if (!method) return '—';
    const map: Record<string, string> = {
      credit_card: 'Credit Card',
      paypal: 'PayPal',
      cod: 'Cash on Delivery',
      other: 'Other',
    };
    return map[method] || method;
  };

  const getCustomerName = (customer?: AdminOrderCustomerRef) => {
    if (!customer) return '—';
    return [customer.firstName, customer.lastName].filter(Boolean).join(' ').trim() || customer.email || '—';
  };

  if (loading) {
    return (
      <GridBackgroundWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
            <p className="mt-3 text-sm text-gray-600">Loading order...</p>
          </div>
        </div>
      </GridBackgroundWrapper>
    );
  }

  if (error || !order) {
    return (
      <GridBackgroundWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-red-600">{error || 'Order not found'}</p>
            <button
              onClick={() => navigate('/orders')}
              className="mt-4 text-sm font-medium text-gray-900 hover:underline"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </GridBackgroundWrapper>
    );
  }

  const displayOrderId = order._id?.length === 24 ? `#${order._id.slice(-6).toUpperCase()}` : order._id;

  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto pt-6 px-4 pb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/orders')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Back
              </button>
              <div>
                <h1 className="text-xl font-medium text-gray-900">Order {displayOrderId}</h1>
                <p className="text-sm text-gray-600 mt-0.5">{formatDate(order.orderDate || order.createdAt || '')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded text-xs font-medium ${
                  order.status === 'delivered' || order.status === 'shipped'
                    ? 'bg-green-100 text-green-700'
                    : order.status === 'pending' || order.status === 'paid'
                    ? 'bg-orange-100 text-orange-700'
                    : order.status === 'cancelled'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-orange-100 text-orange-700'
                }`}
              >
                {order.status?.charAt(0).toUpperCase()}{order.status?.slice(1)}
              </span>
              <span
                className={`px-2.5 py-1 rounded text-xs font-medium ${
                  order.paymentStatus === 'paid'
                    ? 'bg-green-100 text-green-700'
                    : order.paymentStatus === 'refunded'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-orange-100 text-orange-700'
                }`}
              >
                {order.paymentStatus?.charAt(0).toUpperCase()}{order.paymentStatus?.slice(1)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBagIcon className="w-5 h-5 text-gray-600" />
                <h2 className="text-base font-medium text-gray-900">Order Items</h2>
              </div>
              <div className="space-y-4">
                {order.items?.map((item, index) => {
                  const variant = item.productVariantId;
                  const product = variant?.productId;
                  const name = product?.title || 'Product';
                  const image =
                    variant?.images?.[0] || product?.imageUrls?.[0] || undefined;
                  const sku = variant?.sku || '—';
                  return (
                    <div key={item._id}>
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded shrink-0 overflow-hidden">
                          {image ? (
                            <img
                              src={image}
                              alt={name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=Product';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 mb-1">{name}</h3>
                          <p className="text-xs text-gray-600 mb-2">SKU: {sku}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">
                              Quantity: {item.quantity} × {formatCurrency(item.price)}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {formatCurrency(item.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {index < (order.items?.length ?? 0) - 1 && (
                        <div className="border-t border-gray-200 mt-4" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Notes */}
            {order.notes && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-base font-medium text-gray-900 mb-3">Order Notes</h2>
                <p className="text-sm text-gray-600">{order.notes}</p>
              </div>
            )}

            {/* Order Summary */}
              {/* Order Summary */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ReceiptRefundIcon className="w-5 h-5 text-gray-600" />
                  <h2 className="text-base font-medium text-gray-900">Order Summary</h2>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-medium">{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900 font-medium">{formatCurrency(order.tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900 font-medium">{formatCurrency(order.shippingCost)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-900">Total</span>
                      <span className="text-base font-medium text-gray-900">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <UserIcon className="w-5 h-5 text-gray-600" />
                  <h2 className="text-base font-medium text-gray-900">Customer</h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Name</p>
                    <p className="text-sm font-medium text-gray-900">{getCustomerName(order.customerId)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Email</p>
                    <p className="text-sm text-gray-900">{order.customerId?.email || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {order.shippingAddressId && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TruckIcon className="w-5 h-5 text-gray-600" />
                    <h2 className="text-base font-medium text-gray-900">Shipping Address</h2>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">{formatAddressName(order.shippingAddressId)}</p>
                    {order.shippingAddressId.address && (
                      <p className="text-sm text-gray-600">{order.shippingAddressId.address}</p>
                    )}
                    {order.shippingAddressId.apartment && (
                      <p className="text-sm text-gray-600">{order.shippingAddressId.apartment}</p>
                    )}
                    {(order.shippingAddressId.city || order.shippingAddressId.state || order.shippingAddressId.pinCode) && (
                      <p className="text-sm text-gray-600">
                        {[order.shippingAddressId.city, order.shippingAddressId.state, order.shippingAddressId.pinCode]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                    {order.shippingAddressId.country && (
                      <p className="text-sm text-gray-600">{order.shippingAddressId.country}</p>
                    )}
                    {order.shippingAddressId.phoneNumber && (
                      <p className="text-sm text-gray-600 mt-2">Phone: {order.shippingAddressId.phoneNumber}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Billing Address */}
              {order.billingAddressId && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPinIcon className="w-5 h-5 text-gray-600" />
                    <h2 className="text-base font-medium text-gray-900">Billing Address</h2>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">{formatAddressName(order.billingAddressId)}</p>
                    {order.billingAddressId.address && (
                      <p className="text-sm text-gray-600">{order.billingAddressId.address}</p>
                    )}
                    {order.billingAddressId.apartment && (
                      <p className="text-sm text-gray-600">{order.billingAddressId.apartment}</p>
                    )}
                    {(order.billingAddressId.city || order.billingAddressId.state || order.billingAddressId.pinCode) && (
                      <p className="text-sm text-gray-600">
                        {[order.billingAddressId.city, order.billingAddressId.state, order.billingAddressId.pinCode]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                    {order.billingAddressId.country && (
                      <p className="text-sm text-gray-600">{order.billingAddressId.country}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCardIcon className="w-5 h-5 text-gray-600" />
                  <h2 className="text-base font-medium text-gray-900">Payment</h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Payment Method</p>
                    <p className="text-sm font-medium text-gray-900">{formatPaymentMethod(order.paymentMethod)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Payment Status</p>
                    <span
                      className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${
                        order.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : order.paymentStatus === 'refunded'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {order.paymentStatus?.charAt(0).toUpperCase()}{order.paymentStatus?.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarIcon className="w-5 h-5 text-gray-600" />
                  <h2 className="text-base font-medium text-gray-900">Order Information</h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Order Date</p>
                    <p className="text-sm text-gray-900">{formatDate(order.orderDate || order.createdAt || '')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Created At</p>
                    <p className="text-sm text-gray-900">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Last Updated</p>
                    <p className="text-sm text-gray-900">{formatDate(order.updatedAt)}</p>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default OrderDetailsPage;
