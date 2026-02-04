import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPackage } from 'react-icons/fi';
import StorefrontNavbar from '../components/StorefrontNavbar';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useStorefrontOrder } from '../contexts/storefront-order.context';

const NAVBAR_HEIGHT = 64;

const StorefrontMyOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, checkAuth } = useStorefrontAuth();
  const { orders, loading, error, getOrdersByCustomerId } = useStorefrontOrder();

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

  const formatCurrency = (amount: number) => `$${(amount / 100).toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <StorefrontNavbar />

      <div className="mx-auto max-w-6xl px-4 pb-10" style={{ paddingTop: `${NAVBAR_HEIGHT + 16}px` }}>
        <h1 className="text-2xl font-extrabold">My Orders</h1>
        <p className="mt-1 text-sm text-gray-600">View and track all your orders.</p>

        {!user && (
          <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-800">
            Please login to view your orders.
          </div>
        )}

        {loading && (
          <div className="mt-8 flex justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <FiPackage className="text-2xl" />
            </div>
            <div className="mt-4 text-lg font-bold">No orders yet</div>
            <div className="mt-1 text-sm text-gray-600">
              You haven&apos;t placed any orders. Start shopping to see your orders here.
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="mt-6 space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-700">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-600">Placed on {formatDate(order.orderDate)}</div>
                  </div>
                  <div className="text-base font-bold">{formatCurrency(order.total)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StorefrontMyOrdersPage;
