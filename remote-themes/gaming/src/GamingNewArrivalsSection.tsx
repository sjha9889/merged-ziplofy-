import { Link } from 'react-router-dom';
import { formatINR, useStorefront, useStorefrontCart, useStorefrontProductVariants, useStorefrontProducts } from '@render-store/sdk';

export const GamingNewArrivalsSection = () => {
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
    <section style={{ padding: 20 }}>
      <h2 style={{ marginTop: 0 }}>New Arrivals</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        {products.slice(0, 8).map((product) => (
          <article key={product._id} style={{ border: '1px solid #2f3949', padding: 12, background: '#111827', color: '#f3f3f3' }}>
            <h3 style={{ marginTop: 0 }}>{product.title}</h3>
            <p style={{ color: '#9ca3af' }}>{product.description?.slice(0, 90) || 'No description'}</p>
            <p style={{ marginBottom: 10 }}>{formatINR(product.price)}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to={`/products/${product._id}`} style={{ color: '#7cf7b1' }}>
                Details
              </Link>
              <button
                type="button"
                onClick={() => void onAdd(product._id)}
                style={{ background: '#7cf7b1', border: 0, padding: '6px 8px', cursor: 'pointer' }}
              >
                Add to Cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
