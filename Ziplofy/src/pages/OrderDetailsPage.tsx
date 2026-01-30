import React from 'react';
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

// Dummy order data
const getDummyOrder = (orderId: string) => ({
  orderId: orderId || '#1002',
  orderDate: '2024-02-11T10:30:00Z',
  status: 'fulfilled',
  paymentStatus: 'paid',
  items: [
    {
      id: '1',
      name: 'Classic White T-Shirt',
      sku: 'TSH-001-WHT',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
      quantity: 2,
      price: 29.99,
      total: 59.98,
    },
    {
      id: '2',
      name: 'Denim Jeans',
      sku: 'JNS-002-BLU',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
      quantity: 1,
      price: 79.99,
      total: 79.99,
    },
    {
      id: '3',
      name: 'Leather Sneakers',
      sku: 'SNK-003-BLK',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
      quantity: 1,
      price: 129.99,
      total: 129.99,
    },
  ],
  customer: {
    name: 'Wade Warren',
    email: 'wade.warren@example.com',
    phone: '+1 (555) 123-4567',
  },
  shippingAddress: {
    name: 'Wade Warren',
    address: '123 Main Street',
    apartment: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    phone: '+1 (555) 123-4567',
  },
  billingAddress: {
    name: 'Wade Warren',
    address: '123 Main Street',
    apartment: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
  },
  payment: {
    method: 'Credit Card',
    cardLast4: '4242',
    status: 'paid',
  },
  summary: {
    subtotal: 269.96,
    tax: 21.60,
    shipping: 9.99,
    total: 301.55,
  },
  notes: 'Please leave package at front door. Ring doorbell twice.',
  createdAt: '2024-02-11T10:30:00Z',
  updatedAt: '2024-02-12T14:20:00Z',
});

const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const order = getDummyOrder(orderId || '');

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
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
                <h1 className="text-xl font-medium text-gray-900">Order {order.orderId}</h1>
                <p className="text-sm text-gray-600 mt-0.5">{formatDate(order.orderDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded text-xs font-medium ${
                  order.status === 'fulfilled'
                    ? 'bg-green-100 text-green-700'
                    : order.status === 'pending'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              <span
                className={`px-2.5 py-1 rounded text-xs font-medium ${
                  order.paymentStatus === 'paid'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                }`}
              >
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBagIcon className="w-5 h-5 text-gray-600" />
                  <h2 className="text-base font-medium text-gray-900">Order Items</h2>
                </div>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=Product';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-xs text-gray-600 mb-2">SKU: {item.sku}</p>
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
                      {index < order.items.length - 1 && (
                        <div className="border-t border-gray-200 mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Notes */}
              {order.notes && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-base font-medium text-gray-900 mb-3">Order Notes</h2>
                  <p className="text-sm text-gray-600">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ReceiptRefundIcon className="w-5 h-5 text-gray-600" />
                  <h2 className="text-base font-medium text-gray-900">Order Summary</h2>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-medium">{formatCurrency(order.summary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900 font-medium">{formatCurrency(order.summary.tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900 font-medium">{formatCurrency(order.summary.shipping)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-900">Total</span>
                      <span className="text-base font-medium text-gray-900">
                        {formatCurrency(order.summary.total)}
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
                    <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Email</p>
                    <p className="text-sm text-gray-900">{order.customer.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Phone</p>
                    <p className="text-sm text-gray-900">{order.customer.phone}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TruckIcon className="w-5 h-5 text-gray-600" />
                  <h2 className="text-base font-medium text-gray-900">Shipping Address</h2>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">{order.shippingAddress.name}</p>
                  <p className="text-sm text-gray-600">{order.shippingAddress.address}</p>
                  {order.shippingAddress.apartment && (
                    <p className="text-sm text-gray-600">{order.shippingAddress.apartment}</p>
                  )}
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
                  <p className="text-sm text-gray-600 mt-2">Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPinIcon className="w-5 h-5 text-gray-600" />
                  <h2 className="text-base font-medium text-gray-900">Billing Address</h2>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">{order.billingAddress.name}</p>
                  <p className="text-sm text-gray-600">{order.billingAddress.address}</p>
                  {order.billingAddress.apartment && (
                    <p className="text-sm text-gray-600">{order.billingAddress.apartment}</p>
                  )}
                  <p className="text-sm text-gray-600">
                    {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}
                  </p>
                  <p className="text-sm text-gray-600">{order.billingAddress.country}</p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCardIcon className="w-5 h-5 text-gray-600" />
                  <h2 className="text-base font-medium text-gray-900">Payment</h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Payment Method</p>
                    <p className="text-sm font-medium text-gray-900">{order.payment.method}</p>
                    {order.payment.cardLast4 && (
                      <p className="text-xs text-gray-600 mt-1">•••• •••• •••• {order.payment.cardLast4}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Payment Status</p>
                    <span
                      className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${
                        order.payment.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)}
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
                    <p className="text-sm text-gray-900">{formatDate(order.orderDate)}</p>
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
      </div>
    </GridBackgroundWrapper>
  );
};

export default OrderDetailsPage;
