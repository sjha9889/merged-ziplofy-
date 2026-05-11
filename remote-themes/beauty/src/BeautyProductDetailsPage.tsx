import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatINR, useStorefront, useStorefrontCart, useStorefrontProductVariants, useStorefrontProducts } from '@render-store/sdk';
import { BeautyFooter } from './BeautyFooter';
import { BeautyHeader } from './BeautyHeader';
import { B } from './beautyTokens';

export const BeautyProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { storeFrontMeta } = useStorefront();
  const { productDetail, fetchProductById } = useStorefrontProducts();
  const { variants, fetchVariantsByProductId } = useStorefrontProductVariants();
  const { createCartEntry } = useStorefrontCart();
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) return;
    void fetchProductById(id);
    void fetchVariantsByProductId(id);
  }, [fetchProductById, fetchVariantsByProductId, id]);

  const selectedVariant = useMemo(() => variants[0] ?? productDetail?.variantDetails?.[0], [productDetail?.variantDetails, variants]);

  const handleAdd = async () => {
    if (!storeFrontMeta?.storeId || !selectedVariant) return;
    try {
      setAdding(true);
      await createCartEntry({ storeId: storeFrontMeta.storeId, productVariantId: selectedVariant._id, quantity: 1 }, selectedVariant);
    } finally {
      setAdding(false);
    }
  };

  if (!id) return null;

  return (
    <main style={{ minHeight: '100vh', background: B.cream, color: B.ink }}>
      <BeautyHeader />
      <section style={{ maxWidth: 1040, margin: '0 auto', padding: '48px 28px 80px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 48,
            alignItems: 'start',
          }}
        >
          <div
            style={{
              borderRadius: B.radiusLg,
              overflow: 'hidden',
              aspectRatio: '3 / 4',
              maxHeight: 520,
              background: `
                radial-gradient(circle at 30% 20%, rgba(255,255,255,0.85) 0%, transparent 45%),
                linear-gradient(145deg, ${B.blush} 0%, #dcc9ce 35%, ${B.goldSoft} 100%)
              `,
              boxShadow: B.shadow,
              border: `1px solid ${B.line}`,
            }}
          />
          <div>
            <p
              style={{
                fontFamily: B.sans,
                fontSize: 11,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: B.roseDeep,
                margin: '0 0 12px',
                fontWeight: 600,
              }}
            >
              Signature piece
            </p>
            <h1 style={{ fontFamily: B.serif, fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 600, margin: '0 0 20px', lineHeight: 1.15 }}>
              {productDetail?.title || 'Preparing your selection…'}
            </h1>
            <p style={{ fontFamily: B.sans, fontSize: 16, lineHeight: 1.75, color: B.inkMuted, margin: '0 0 28px' }}>{productDetail?.description}</p>
            <p style={{ fontFamily: B.serif, fontSize: 32, color: B.gold, margin: '0 0 28px', fontWeight: 600 }}>
              {formatINR(selectedVariant?.price ?? productDetail?.price ?? 0)}
            </p>
            <button
              type="button"
              disabled={!selectedVariant || adding}
              onClick={() => void handleAdd()}
              style={{
                fontFamily: B.sans,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                background: selectedVariant && !adding ? `linear-gradient(135deg, ${B.ink} 0%, #3d2f33 100%)` : '#c4bbb8',
                color: B.white,
                border: 'none',
                padding: '18px 40px',
                borderRadius: 999,
                cursor: selectedVariant && !adding ? 'pointer' : 'not-allowed',
                boxShadow: selectedVariant && !adding ? B.shadow : 'none',
              }}
            >
              {adding ? 'Adding…' : 'Add to bag'}
            </button>
          </div>
        </div>
      </section>
      <BeautyFooter />
    </main>
  );
};
