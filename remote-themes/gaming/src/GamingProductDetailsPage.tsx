import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatINR, useStorefront, useStorefrontCart, useStorefrontProductVariants, useStorefrontProducts } from '@render-store/sdk';
import { GamingFooter } from './GamingFooter';
import { GamingHeader } from './GamingHeader';

export const GamingProductDetailsPage = () => {
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
    <main style={{ minHeight: '100vh', background: '#030712', color: '#f3f3f3' }}>
      <GamingHeader />
      <section style={{ padding: 20, maxWidth: 860, margin: '0 auto' }}>
        <h1>{productDetail?.title || 'Loading product...'}</h1>
        <p style={{ color: '#9ca3af' }}>{productDetail?.description}</p>
        <p style={{ fontSize: 22 }}>{formatINR(selectedVariant?.price ?? productDetail?.price ?? 0)}</p>
        <button
          type="button"
          disabled={!selectedVariant || adding}
          onClick={() => void handleAdd()}
          style={{ background: '#7cf7b1', border: 0, padding: '10px 14px', cursor: 'pointer' }}
        >
          {adding ? 'Adding...' : 'Add to Cart'}
        </button>
      </section>
      <GamingFooter />
    </main>
  );
};
