import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  formatINR,
  useStorefrontAuth,
  useStorefrontCart,
  type GuestCartItem,
  type StorefrontCartItem,
} from '@render-store/sdk';
import { BeautyFooter } from './BeautyFooter';
import { BeautyHeader } from './BeautyHeader';
import { B, inputStyle } from './beautyTokens';

function variantOf(item: StorefrontCartItem | GuestCartItem) {
  const v = item.productVariantId;
  return typeof v === 'object' && v !== null && '_id' in v ? v : null;
}

export const BeautyCartPage = () => {
  const { user, checkAuth } = useStorefrontAuth();
  const { getAllItems, getCartByCustomerId, updateCartEntry, deleteCartEntry, loading } = useStorefrontCart();
  const [qtyDraft, setQtyDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user?._id) return;
    void getCartByCustomerId(user._id);
  }, [getCartByCustomerId, user?._id]);

  const lines = getAllItems();

  const totals = useMemo(() => {
    let sub = 0;
    for (const item of lines) {
      const v = variantOf(item);
      if (!v) continue;
      sub += v.price * item.quantity;
    }
    return sub;
  }, [lines]);

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const item of lines) {
      next[item._id] = String(item.quantity);
    }
    setQtyDraft(next);
  }, [lines]);

  return (
    <main style={{ minHeight: '100vh', background: B.cream, color: B.ink }}>
      <BeautyHeader />
      <section style={{ padding: '32px 28px 72px', maxWidth: 880, margin: '0 auto' }}>
        <h1 style={{ marginTop: 0, fontFamily: B.serif, fontSize: 36, fontWeight: 600 }}>Your bag</h1>
        {loading && lines.length === 0 && <p style={{ fontFamily: B.sans, color: B.inkMuted }}>Loading your bag…</p>}
        {!loading && lines.length === 0 && (
          <div
            style={{
              border: `1px solid ${B.line}`,
              padding: 36,
              background: B.white,
              borderRadius: B.radiusLg,
              boxShadow: B.shadowSm,
              textAlign: 'center',
            }}
          >
            <p style={{ margin: '0 0 16px', fontFamily: B.sans, color: B.inkMuted }}>Your bag is empty — room for something lovely.</p>
            <Link
              to="/"
              style={{
                fontFamily: B.sans,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: B.roseDeep,
              }}
            >
              Continue shopping
            </Link>
          </div>
        )}
        {lines.length > 0 && (
          <>
            <div style={{ display: 'grid', gap: 16 }}>
              {lines.map((item) => {
                const v = variantOf(item);
                const opts = v?.optionValues ? Object.entries(v.optionValues as Record<string, string>) : [];
                const draft = qtyDraft[item._id] ?? String(item.quantity);
                return (
                  <article
                    key={item._id}
                    style={{
                      border: `1px solid ${B.line}`,
                      padding: 22,
                      background: B.white,
                      borderRadius: B.radiusMd,
                      boxShadow: B.shadowSm,
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: 20,
                      alignItems: 'start',
                    }}
                  >
                    <div>
                      {v ? (
                        <>
                          <Link
                            to={`/products/${v.productId}`}
                            style={{ fontFamily: B.serif, fontSize: 20, fontWeight: 600, color: B.ink, textDecoration: 'none' }}
                          >
                            SKU {v.sku}
                          </Link>
                          <p style={{ margin: '8px 0 0', fontFamily: B.sans, fontSize: 14, color: B.inkMuted }}>
                            {opts.length > 0 ? opts.map(([k, val]) => `${k}: ${val}`).join(' · ') : 'Default variant'}
                          </p>
                          <p style={{ margin: '10px 0 0', fontFamily: B.serif, fontSize: 17, color: B.gold }}>{formatINR(v.price)} each</p>
                        </>
                      ) : (
                        <p style={{ margin: 0, fontFamily: B.sans }}>Line item</p>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: B.sans, fontSize: 13, color: B.inkMuted }}>
                        Qty
                        <input
                          type="number"
                          min={1}
                          value={draft}
                          onChange={(e) => setQtyDraft((p) => ({ ...p, [item._id]: e.target.value }))}
                          onBlur={(e) => {
                            const n = Math.max(1, Math.floor(Number(e.target.value) || 1));
                            setQtyDraft((p) => ({ ...p, [item._id]: String(n) }));
                            if (n !== item.quantity) void updateCartEntry({ id: item._id, quantity: n });
                          }}
                          style={{ ...inputStyle, width: 72, padding: '8px 10px' }}
                        />
                      </label>
                      <p style={{ margin: 0, fontFamily: B.serif, fontSize: 22, color: B.roseDeep, fontWeight: 600 }}>
                        {v ? formatINR(v.price * item.quantity) : '—'}
                      </p>
                      <button
                        type="button"
                        onClick={() => void deleteCartEntry(item._id)}
                        style={{
                          fontFamily: B.sans,
                          fontSize: 12,
                          background: 'transparent',
                          border: `1px solid ${B.roseLight}`,
                          color: B.roseDeep,
                          padding: '8px 14px',
                          cursor: 'pointer',
                          borderRadius: 999,
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
            <div
              style={{
                marginTop: 28,
                padding: '24px 28px',
                borderRadius: B.radiusLg,
                border: `1px solid ${B.line}`,
                background: B.white,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16,
                boxShadow: B.shadowSm,
              }}
            >
              <span style={{ fontFamily: B.serif, fontSize: 22, fontWeight: 600 }}>Subtotal</span>
              <span style={{ fontFamily: B.serif, fontSize: 28, color: B.gold, fontWeight: 600 }}>{formatINR(totals)}</span>
            </div>
            <p style={{ marginTop: 18, fontFamily: B.sans, fontSize: 13, color: B.inkMuted }}>Checkout can connect to your payment flow when you are ready.</p>
          </>
        )}
      </section>
      <BeautyFooter />
    </main>
  );
};
