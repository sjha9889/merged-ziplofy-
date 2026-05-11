import { useEffect } from 'react';
import { formatINR, useStorefrontAuth, useStorefrontOrder } from '@render-store/sdk';
import { GamingFooter } from './GamingFooter';
import { GamingHeader } from './GamingHeader';

export const GamingOrdersPage = () => {
  const { user, checkAuth } = useStorefrontAuth();
  const { orders, getOrdersByCustomerId, loading } = useStorefrontOrder();

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user?._id) return;
    void getOrdersByCustomerId(user._id);
  }, [getOrdersByCustomerId, user?._id]);

  return (
    <main style={{ minHeight: '100vh', background: '#030712', color: '#f3f3f3' }}>
      <GamingHeader />
      <section style={{ padding: 20 }}>
        <h1>My Orders</h1>
        {loading && <p>Loading orders...</p>}
        {!loading && orders.length === 0 && <p>No orders yet.</p>}
        <div style={{ display: 'grid', gap: 12 }}>
          {orders.map((order) => (
            <article key={order._id} style={{ border: '1px solid #2b3648', padding: 12 }}>
              <p style={{ margin: 0 }}>Order: {order._id}</p>
              <p style={{ margin: '4px 0' }}>Status: {order.status}</p>
              <p style={{ margin: 0 }}>Total: {formatINR(order.total)}</p>
            </article>
          ))}
        </div>
      </section>
      <GamingFooter />
    </main>
  );
};
