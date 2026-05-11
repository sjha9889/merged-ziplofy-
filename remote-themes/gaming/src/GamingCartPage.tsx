import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  formatINR,
  useStorefrontAuth,
  useStorefrontCart,
  type GuestCartItem,
  type StorefrontCartItem,
} from '@render-store/sdk';
import { GamingFooter } from './GamingFooter';
import { GamingHeader } from './GamingHeader';

function variantOf(item: StorefrontCartItem | GuestCartItem) {
  const v = item.productVariantId;
  return typeof v === 'object' && v !== null && '_id' in v ? v : null;
}

export const GamingCartPage = () => {
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
    <main style={{ minHeight: '100vh', background: '#030712', color: '#f3f3f3' }}>
      <GamingHeader />
      <section style={{ padding: '24px 20px 48px', maxWidth: 880, margin: '0 auto' }}>
        <h1 style={{ marginTop: 0, fontSize: 28 }}>Cart</h1>
        {loading && lines.length === 0 && <p style={{ color: '#9ca3af' }}>Loading cart…</p>}
        {!loading && lines.length === 0 && (
          <div style={{ border: '1px solid #2b3648', padding: 24, background: '#111827', borderRadius: 8 }}>
            <p style={{ margin: '0 0 12px', color: '#9ca3af' }}>Your cart is empty.</p>
            <Link to="/" style={{ color: '#7cf7b1', fontWeight: 700 }}>
              Continue shopping
            </Link>
          </div>
        )}
        {lines.length > 0 && (
          <>
            <div style={{ display: 'grid', gap: 12 }}>
              {lines.map((item) => {
                const v = variantOf(item);
                const opts = v?.optionValues ? Object.entries(v.optionValues as Record<string, string>) : [];
                const draft = qtyDraft[item._id] ?? String(item.quantity);
                return (
                  <article
                    key={item._id}
                    style={{
                      border: '1px solid #2b3648',
                      padding: 16,
                      background: '#111827',
                      borderRadius: 8,
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: 16,
                      alignItems: 'start',
                    }}
                  >
                    <div>
                      {v ? (
                        <>
                          <Link to={`/products/${v.productId}`} style={{ color: '#7cf7b1', fontWeight: 700, textDecoration: 'none' }}>
                            SKU: {v.sku}
                          </Link>
                          <p style={{ margin: '6px 0 0', color: '#9ca3af', fontSize: 14 }}>
                            {opts.length > 0 ? opts.map(([k, val]) => `${k}: ${val}`).join(' · ') : 'Default variant'}
                          </p>
                          <p style={{ margin: '8px 0 0', color: '#e5e7eb' }}>{formatINR(v.price)} each</p>
                        </>
                      ) : (
                        <p style={{ margin: 0 }}>Line item</p>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9ca3af', fontSize: 13 }}>
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
                          style={{ width: 64, padding: 6, background: '#0b1220', border: '1px solid #374151', color: '#f3f3f3' }}
                        />
                      </label>
                      <p style={{ margin: 0, color: '#f9d66e', fontWeight: 700 }}>
                        {v ? formatINR(v.price * item.quantity) : '—'}
                      </p>
                      <button
                        type="button"
                        onClick={() => void deleteCartEntry(item._id)}
                        style={{ background: 'transparent', border: '1px solid #7f1d1d', color: '#fca5a5', padding: '6px 10px', cursor: 'pointer', borderRadius: 4 }}
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
                marginTop: 24,
                padding: 20,
                border: '1px solid #2b3648',
                background: '#0d1117',
                borderRadius: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 800 }}>Subtotal</span>
              <span style={{ fontSize: 22, color: '#7cf7b1', fontWeight: 800 }}>{formatINR(totals)}</span>
            </div>
            <p style={{ marginTop: 16, color: '#6b7280', fontSize: 13 }}>Checkout can be wired from your storefront flow when ready.</p>
          </>
        )}
      </section>
      <GamingFooter />
    </main>
  );
};
