import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontCollections } from '../contexts/storefront-collections.context';

export default function StorefrontCollectionsListPage() {
  const { storeFrontMeta } = useStorefront();
  const { collections, loading, error, fetchCollectionsByStoreId } = useStorefrontCollections();
  const [sortBy, setSortBy] = useState<'featured' | 'a-z' | 'z-a' | 'newest'>('featured');

  useEffect(() => {
    if (storeFrontMeta?.storeId) {
      fetchCollectionsByStoreId(storeFrontMeta.storeId).catch(() => {});
    }
  }, [storeFrontMeta?.storeId, fetchCollectionsByStoreId]);

  const sortedCollections = useMemo(() => {
    const copy = [...collections];
    if (sortBy === 'a-z') copy.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === 'z-a') copy.sort((a, b) => b.title.localeCompare(a.title));
    if (sortBy === 'newest') {
      copy.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
    return copy;
  }, [collections, sortBy]);

  return (
    <main className="bg-white pb-14">
      <div className="border-b border-white/10 bg-black px-4 py-1.5 text-center text-[11px] uppercase tracking-[0.16em] text-white sm:px-6">
        <span className="text-white/90">New Terra Nova Jumping Hour In Steel</span>
        <span className="ml-3 font-semibold text-white">Discover</span>
      </div>

      <section className="border-b border-white/10 bg-black px-4 py-10 text-white sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1394px]">
          <nav className="mb-3 flex items-center justify-center gap-2 text-[12px] text-[#b9b9b9]">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <span>&gt;</span>
            <span className="!text-white">Collections</span>
          </nav>
          <h1 className="!text-white text-center text-[58px] font-semibold uppercase leading-none tracking-[0.02em] [text-shadow:0_1px_0_rgba(255,255,255,0.06)]">
            Collections
          </h1>
          <p className="mx-auto mt-4 max-w-[760px] text-center text-[15px] leading-[1.6] text-[#d7d7d7]">
            Explore curated luxury watch collections tailored for every taste.
          </p>
        </div>
      </section>

      <section className="border-b border-white/10 bg-black px-4 py-4 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1394px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {['All Collections', 'Featured', 'Recently Added', 'Luxury'].map((filter) => (
              <button
                key={filter}
                type="button"
                className="whitespace-nowrap rounded-md border border-white/20 bg-black px-3 py-1.5 text-[12px] text-white/95 transition hover:border-white/40"
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 self-start lg:self-auto">
            <label htmlFor="sortCollections" className="text-[27px] font-medium text-white">
              Sort By
            </label>
            <select
              id="sortCollections"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="min-w-[140px] rounded-md border border-white/20 bg-black px-3 py-2 text-[13px] text-white focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="a-z">Name: A to Z</option>
              <option value="z-a">Name: Z to A</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1394px] px-4 pt-8 sm:px-6 lg:px-0">

        {loading ? (
          <div className="rounded-2xl border border-[#dfdfdf] bg-white p-12 text-center text-neutral-600">
            Loading collections...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-12 text-center text-red-600">
            {error}
          </div>
        ) : collections.length === 0 ? (
          <div className="rounded-2xl border border-[#dfdfdf] bg-white p-12 text-center text-neutral-600">
            No collections found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {sortedCollections.map((collection) => (
              <article
                key={collection._id}
                className="group relative overflow-hidden rounded-2xl border border-[#dfdfdf] bg-white p-6 transition"
              >
                <div className="mb-4 h-[2px] w-14 bg-black/80 transition-all duration-300 group-hover:w-20" />
                <h2 className="text-[24px] font-semibold leading-tight text-black">{collection.title}</h2>
                <p className="mt-3 line-clamp-3 min-h-[72px] text-[14px] leading-relaxed text-[#5f5f5f]">
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
