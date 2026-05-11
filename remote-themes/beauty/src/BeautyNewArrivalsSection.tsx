import { Link } from 'react-router-dom';
import { formatINR, useStorefront, useStorefrontCart, useStorefrontProductVariants, useStorefrontProducts } from '@render-store/sdk';
import { B, inputStyle } from './beautyTokens';

export const BeautyNewArrivalsSection = () => {
  const { products } = useStorefrontProducts();
  const { storeFrontMeta } = useStorefront();
  const { fetchVariantsByProductId } = useStorefrontProductVariants();
  const { createCartEntry } = useStorefrontCart();

  const onAdd = async (productId: string) => {
    if (!storeFrontMeta?.storeId) return;
    const variants = await fetchVariantsByProductId(productId);
    const first = variants[0];
    if (!first) return;
    await createCartEntry({ storeId: storeFrontMeta.storeId, productVariantId: first._id, quantity: 1 }, first);
  };

  return (
    <section style={{ padding: '72px 28px', background: B.white }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, marginBottom: 40 }}>
          <div>
            <p
              style={{
                fontFamily: B.sans,
                fontSize: 11,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: B.roseDeep,
                margin: '0 0 8px',
                fontWeight: 600,
              }}
            >
              Just arrived
            </p>
            <h2 style={{ fontFamily: B.serif, fontSize: 'clamp(1.75rem, 4vw, 2.35rem)', fontWeight: 600, color: B.ink, margin: 0 }}>
              The vanity edit
            </h2>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 28 }}>
          {products.slice(0, 8).map((product) => (
            <article
              key={product._id}
              style={{
                borderRadius: B.radiusLg,
                overflow: 'hidden',
                border: `1px solid ${B.line}`,
                background: B.cream,
                boxShadow: B.shadowSm,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  aspectRatio: '4 / 5',
                  background: `
                    linear-gradient(160deg, rgba(255,255,255,0.9) 0%, transparent 40%),
                    linear-gradient(135deg, ${B.blush} 0%, #e8d4d8 40%, ${B.goldSoft} 120%)
                  `,
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    fontFamily: B.sans,
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: B.white,
                    background: 'rgba(31,23,25,0.35)',
                    padding: '6px 10px',
                    borderRadius: 6,
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  New
                </span>
              </div>
              <div style={{ padding: '22px 20px 24px', display: 'flex', flexDirection: 'column', flex: 1, gap: 10 }}>
                <h3 style={{ fontFamily: B.serif, fontSize: 22, fontWeight: 600, color: B.ink, margin: 0, lineHeight: 1.25 }}>{product.title}</h3>
                <p style={{ fontFamily: B.sans, fontSize: 14, color: B.inkMuted, margin: 0, lineHeight: 1.55, flex: 1 }}>
                  {(product.description ?? '').slice(0, 88)}
                  {(product.description?.length ?? 0) > 88 ? '…' : ''}
                </p>
                <p style={{ fontFamily: B.serif, fontSize: 22, color: B.gold, margin: '4px 0 0', fontWeight: 600 }}>{formatINR(product.price)}</p>
                <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                  <Link
                    to={`/products/${product._id}`}
                    style={{
                      fontFamily: B.sans,
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: B.roseDeep,
                      textDecoration: 'none',
                      padding: '10px 16px',
                      borderRadius: 999,
                      border: `1px solid ${B.line}`,
                      background: B.white,
                    }}
                  >
                    Details
                  </Link>
                  <button
                    type="button"
                    onClick={() => void onAdd(product._id)}
                    style={{
                      ...inputStyle,
                      width: 'auto',
                      cursor: 'pointer',
                      fontFamily: B.sans,
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      background: `linear-gradient(135deg, ${B.rose} 0%, ${B.roseDeep} 100%)`,
                      color: B.white,
                      border: 'none',
                      padding: '10px 18px',
                      boxShadow: '0 8px 20px rgba(167, 93, 106, 0.28)',
                    }}
                  >
                    Add to bag
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
