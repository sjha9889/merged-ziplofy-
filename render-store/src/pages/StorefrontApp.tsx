import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useStorefrontCart } from '../contexts/storefront-cart.context';
import { useStorefrontCollections } from '../contexts/storefront-collections.context';
import { useStorefrontProducts } from '../contexts/product.context';
import { formatINR } from '../utils/currency';

/**
 * Fallback when the installed theme is not shown in the iframe (e.g. missing HTML/Liquid).
 * Uses only store metadata and catalog from the API — no demo/watch imagery.
 */
export default function StorefrontApp() {
  const { storeFrontMeta } = useStorefront();
  const { user } = useStorefrontAuth();
  const { getCartByCustomerId } = useStorefrontCart();
  const { fetchCollectionsByStoreId } = useStorefrontCollections();
  const { products, loading: productsLoading, fetchProductsByStoreId } = useStorefrontProducts();

  useEffect(() => {
    if (storeFrontMeta?.storeId) {
      fetchProductsByStoreId({ storeId: storeFrontMeta.storeId, page: 1, limit: 24 });
      fetchCollectionsByStoreId(storeFrontMeta.storeId);
    }
  }, [storeFrontMeta?.storeId, fetchProductsByStoreId, fetchCollectionsByStoreId]);

  useEffect(() => {
    if (user?._id) {
      getCartByCustomerId(user._id).catch(() => {});
    }
  }, [user?._id, getCartByCustomerId]);

  const storeLabel = storeFrontMeta?.name ?? 'Store';

  return (
    <div className="min-h-svh bg-white">
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-semibold text-neutral-900">{storeLabel}</h1>
        {storeFrontMeta?.description ? (
          <p className="mt-3 max-w-2xl text-neutral-600">{storeFrontMeta.description}</p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/products"
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"
          >
            Browse products
          </Link>
          <Link
            to="/collection"
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"
          >
            Collections
          </Link>
        </div>

        {productsLoading && products.length === 0 ? (
          <p className="mt-10 text-neutral-500">Loading products…</p>
        ) : (
          <ul className="mt-10 grid list-none gap-6 p-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <li key={p._id}>
                <Link
                  to={`/products/${p._id}`}
                  className="block overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:border-neutral-300"
                >
                  {p.imageUrls?.[0] ? (
                    <img src={p.imageUrls[0]} alt="" className="aspect-square w-full object-contain" />
                  ) : (
                    <div className="flex aspect-square w-full items-center justify-center bg-neutral-100 text-sm text-neutral-400">
                      No image
                    </div>
                  )}
                  <div className="p-4">
                    <p className="font-medium text-neutral-900">{p.title}</p>
                    <p className="mt-1 text-sm tabular-nums text-neutral-700">{formatINR(p.price)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {!productsLoading && products.length === 0 ? (
          <p className="mt-10 text-neutral-500">No products published yet.</p>
        ) : null}
      </main>
    </div>
  );
}
