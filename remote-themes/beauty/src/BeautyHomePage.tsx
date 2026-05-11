import { useEffect } from 'react';
import { useStorefront, useStorefrontCollections, useStorefrontProducts } from '@render-store/sdk';
import { BeautyFooter } from './BeautyFooter';
import { BeautyHeader } from './BeautyHeader';
import { BeautyHeroSection } from './BeautyHeroSection';
import { BeautyNewArrivalsSection } from './BeautyNewArrivalsSection';
import { BeautyTestimonialsSection } from './BeautyTestimonialsSection';
import { B } from './beautyTokens';

export const BeautyHomePage = () => {
  const { storeFrontMeta } = useStorefront();
  const { fetchProductsByStoreId } = useStorefrontProducts();
  const { fetchCollectionsByStoreId } = useStorefrontCollections();

  useEffect(() => {
    if (!storeFrontMeta?.storeId) return;
    void fetchProductsByStoreId({ storeId: storeFrontMeta.storeId, page: 1, limit: 12 });
    void fetchCollectionsByStoreId(storeFrontMeta.storeId);
  }, [fetchCollectionsByStoreId, fetchProductsByStoreId, storeFrontMeta?.storeId]);

  return (
    <main style={{ minHeight: '100vh', background: B.cream, color: B.ink }}>
      <BeautyHeader />
      <BeautyHeroSection />
      <BeautyNewArrivalsSection />
      <BeautyTestimonialsSection />
      <BeautyFooter />
    </main>
  );
};
