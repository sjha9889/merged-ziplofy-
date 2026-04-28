import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontCollections } from '../contexts/storefront-collections.context';

export default function StorefrontCollectionsListPage() {
  const { storeFrontMeta } = useStorefront();
  const { collections, loading, error, fetchCollectionsByStoreId } = useStorefrontCollections();

  useEffect(() => {
    if (storeFrontMeta?.storeId) {
      fetchCollectionsByStoreId(storeFrontMeta.storeId).catch(() => {});
    }
  }, [storeFrontMeta?.storeId, fetchCollectionsByStoreId]);

  return (
    <main className="bg-[#ECECEC] px-4 pb-12 pt-8 sm:px-6 sm:pt-10">
      <div className="mx-auto max-w-[1394px]">
        <nav className="mb-4 flex items-center gap-2 text-sm text-neutral-600" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <span className="text-black">Collections</span>
        </nav>

        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-[34px] font-semibold leading-none text-black">Collections</h1>
            <p className="mt-2 text-[14px] text-neutral-600">{collections.length} collections</p>
          </div>
          <Link to="/" className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black hover:text-neutral-600">
            Back to Home
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#d7d7d7] bg-white p-12 text-center text-neutral-600">
            Loading collections...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-[#d7d7d7] bg-white p-12 text-center text-red-600">
            {error}
          </div>
        ) : collections.length === 0 ? (
          <div className="rounded-2xl border border-[#d7d7d7] bg-white p-12 text-center text-neutral-600">
            No collections found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {collections.map((collection) => (
              <article key={collection._id} className="rounded-2xl border border-[#D9D9D9] bg-white p-6">
                <h2 className="text-[24px] font-medium leading-tight text-black">{collection.title}</h2>
                <p className="mt-3 line-clamp-3 min-h-[60px] text-[14px] leading-relaxed text-[#5f5f5f]">
                  {collection.description || 'Explore products from this curated collection.'}
                </p>
                <Link
                  to={`/collections/${collection._id}/${collection.urlHandle}`}
                  className="mt-6 inline-flex items-center justify-center rounded-md bg-black px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-neutral-900"
                >
                  View collection
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
