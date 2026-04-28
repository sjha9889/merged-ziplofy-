import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontCollections } from '../contexts/storefront-collections.context';
import { useStorefrontProducts } from '../contexts/product.context';
import { formatINR } from '../utils/currency';
import { StorefrontListingCard } from '../components/StorefrontListingCard';

const StorefrontCollectionPage: React.FC = () => {
  const { collectionId } = useParams();
  const { storeFrontMeta } = useStorefront();
  const {
    collections,
    products: collectionProducts,
    orderDiscount: collectionOrderDiscount,
    fetchCollectionsByStoreId,
    fetchProductsInCollection,
    loading: collectionsLoading,
  } = useStorefrontCollections();
  const {
    products: allProducts,
    loading: productsLoading,
    orderDiscount: productsOrderDiscount,
    fetchProductsByStoreId,
  } = useStorefrontProducts();

  const products = collectionId ? collectionProducts : allProducts;
  const loading = collectionId ? collectionsLoading : productsLoading;
  const orderDiscount = collectionId ? collectionOrderDiscount : productsOrderDiscount;
  const collection = collectionId ? collections.find((c) => c._id === collectionId) : null;
  const [sortBy, setSortBy] = useState<'featured' | 'price-low-high' | 'price-high-low' | 'newest'>('featured');

  const orderDiscountText = orderDiscount
    ? orderDiscount.valueType === 'fixed-amount'
      ? `${formatINR(orderDiscount.fixedAmount || 0)} off`
      : `${orderDiscount.percentage || 0}% off`
    : null;

  useEffect(() => {
    if (storeFrontMeta?.storeId && collections.length === 0) {
      fetchCollectionsByStoreId(storeFrontMeta.storeId).catch(() => {});
    }
  }, [storeFrontMeta?.storeId, collections.length, fetchCollectionsByStoreId]);

  useEffect(() => {
    if (collectionId) {
      fetchProductsInCollection(collectionId).catch(() => {});
    } else if (storeFrontMeta?.storeId) {
      fetchProductsByStoreId({ storeId: storeFrontMeta.storeId, page: 1, limit: 24 }).catch(() => {});
    }
  }, [collectionId, storeFrontMeta?.storeId, fetchProductsInCollection, fetchProductsByStoreId]);

  const sortedProducts = useMemo(() => {
    const copy = [...products];
    if (sortBy === 'price-low-high') copy.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high-low') copy.sort((a, b) => b.price - a.price);
    if (sortBy === 'newest') {
      copy.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
    return copy;
  }, [products, sortBy]);

  return (
    <main className="bg-white pb-14">
      {orderDiscount && (
        <div className="mx-auto mb-0 max-w-[1440px] rounded-none bg-black px-4 py-2 text-center text-xs tracking-[0.08em] text-white">
          <span className="font-semibold">{orderDiscountText}</span>
          {orderDiscount.title ? <span className="ml-2 text-white/80">· {orderDiscount.title}</span> : null}
        </div>
      )}

      <section className="border-b border-[#ececec] bg-white px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1394px]">
          <nav className="mb-3 flex items-center gap-2 text-[13px] text-[#666]">
            <Link to="/" className="hover:text-black">
              Home
            </Link>
            <span>&gt;</span>
            <span className="text-[#2a2a2a]">{collection?.title || 'New Releases'}</span>
          </nav>
          <h1 className="text-[42px] font-semibold uppercase leading-none tracking-[0.02em] text-black">
            {collection?.title || 'New Releases'}
          </h1>
          <p className="mt-4 max-w-[760px] text-[15px] leading-[1.6] text-[#5d5d5d]">
            Discover the latest luxury mechanical timepieces, designed and manufactured with precision.
          </p>
        </div>
      </section>

      <section className="border-b border-[#ececec] bg-white px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1394px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {['Price', 'Availability', 'Gender', 'Feature', 'Case Size', 'Material'].map((filter) => (
              <button
                key={filter}
                type="button"
                className="whitespace-nowrap rounded-full border border-[#dddddd] px-4 py-2 text-[12px] font-medium text-[#2f2f2f] hover:bg-[#f7f7f7]"
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 self-start lg:self-auto">
            <label htmlFor="sortBy" className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5a5a5a]">
              Sort By
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded border border-[#d9d9d9] bg-white px-3 py-2 text-[12px] text-[#1f1f1f] focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1394px] px-4 pt-8 sm:px-6 lg:px-0">
        <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-600">
          <Link to="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-black">
            Products
          </Link>
          {collection ? (
            <>
              <span>/</span>
              <span className="text-black">{collection.title}</span>
            </>
          ) : null}
        </nav>

        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-[34px] font-semibold leading-none text-black">{collection?.title || 'All Watches'}</h1>
            <p className="mt-2 text-[14px] text-neutral-600">{products.length} products</p>
          </div>
          <Link to="/" className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black hover:text-neutral-600">
            Back to Home
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center text-neutral-600">Loading products...</div>
        ) : sortedProducts.length === 0 ? (
          <div className="rounded-2xl border border-[#d7d7d7] bg-white p-12 text-center text-neutral-600">
            No products in this collection yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {sortedProducts.map((product) => (
              <StorefrontListingCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default StorefrontCollectionPage;
