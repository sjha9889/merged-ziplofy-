import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontCollections } from '../contexts/storefront-collections.context';
import { useStorefrontProducts } from '../contexts/product.context';
import { formatINR } from '../utils/currency';
import { ProductCard } from '../components/ProductCard';

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

  return (
    <main className="bg-[#ECECEC] px-4 pb-12 pt-8 sm:px-6 sm:pt-10">
      {orderDiscount && (
        <div className="mx-auto mb-6 max-w-[1394px] rounded-md bg-black px-4 py-3 text-center text-sm text-white">
          <span className="font-semibold">{orderDiscountText}</span>
          {orderDiscount.title ? <span className="ml-2 text-white/80">· {orderDiscount.title}</span> : null}
        </div>
      )}

      <div className="mx-auto max-w-[1394px]">
        <nav className="mb-4 flex items-center gap-2 text-sm text-neutral-600">
          <Link to="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <Link to="/category" className="hover:text-black">
            Categories
          </Link>
          {collection ? (
            <>
              <span>/</span>
              <span className="text-black">{collection.title}</span>
            </>
          ) : null}
        </nav>

        <div className="mb-6 flex items-end justify-between gap-4">
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
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-[#d7d7d7] bg-white p-12 text-center text-neutral-600">
            No products in this collection yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                image={product.imageUrls?.[0] || '/assets/img/watch-1.jpg'}
                name={product.title}
                brand={product.vendor?.name || 'Swisswrist'}
                priceInPaisa={product.price}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default StorefrontCollectionPage;
