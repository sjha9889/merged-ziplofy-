import { useEffect } from 'react';
import { formatINR, useStorefrontAuth, useStorefrontOrder } from '@render-store/sdk';
import { BeautyFooter } from './BeautyFooter';
import { BeautyHeader } from './BeautyHeader';
import { B } from './beautyTokens';

export const BeautyOrdersPage = () => {
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
    <main style={{ minHeight: '100vh', background: B.cream, color: B.ink }}>
      <BeautyHeader />
      <section style={{ padding: '48px 28px 80px', maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontFamily: B.serif, fontSize: 36, fontWeight: 600, margin: '0 0 8px' }}>Your orders</h1>
        <p style={{ fontFamily: B.sans, fontSize: 15, color: B.inkMuted, margin: '0 0 36px' }}>Track every delivery from one serene place.</p>
        {loading && <p style={{ fontFamily: B.sans, color: B.inkMuted }}>Gathering your orders…</p>}
        {!loading && orders.length === 0 && (
          <p style={{ fontFamily: B.sans, color: B.inkMuted, padding: '32px', textAlign: 'center', border: `1px dashed ${B.line}`, borderRadius: B.radiusMd }}>
            No orders yet. Your first unboxing is just ahead.
          </p>
        )}
        <div style={{ display: 'grid', gap: 20 }}>
          {orders.map((order) => (
            <article
              key={order._id}
              style={{
                background: B.white,
                borderRadius: B.radiusMd,
                padding: '24px 28px',
                border: `1px solid ${B.line}`,
                boxShadow: B.shadowSm,
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
                <p style={{ margin: 0, fontFamily: B.sans, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: B.inkMuted }}>
                  Order
                </p>
                <p style={{ margin: 0, fontFamily: B.serif, fontSize: 18, color: B.gold, fontWeight: 600 }}>{formatINR(order.total)}</p>
              </div>
              <p style={{ margin: '8px 0 0', fontFamily: B.sans, fontSize: 14, color: B.ink, wordBreak: 'break-all' }}>{order._id}</p>
              <p style={{ margin: '12px 0 0', fontFamily: B.sans, fontSize: 14, color: B.roseDeep }}>
                Status: <strong style={{ color: B.ink }}>{order.status}</strong>
              </p>
            </article>
          ))}
        </div>
      </section>
      <BeautyFooter />
    </main>
  );
};
