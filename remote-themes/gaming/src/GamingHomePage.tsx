import { useEffect } from 'react';
import { useStorefront, useStorefrontCollections, useStorefrontProducts } from '@render-store/sdk';
import { GamingFooter } from './GamingFooter';
import { GamingHeader } from './GamingHeader';
import { GamingHeroSection } from './GamingHeroSection';
import { GamingNewArrivalsSection } from './GamingNewArrivalsSection';
import { GamingTestimonialsSection } from './GamingTestimonialsSection';

export const GamingHomePage = () => {
  const { storeFrontMeta } = useStorefront();
  const { fetchProductsByStoreId } = useStorefrontProducts();
  const { fetchCollectionsByStoreId } = useStorefrontCollections();

  useEffect(() => {
    if (!storeFrontMeta?.storeId) return;
    void fetchProductsByStoreId({ storeId: storeFrontMeta.storeId, page: 1, limit: 12 });
    void fetchCollectionsByStoreId(storeFrontMeta.storeId);
  }, [fetchCollectionsByStoreId, fetchProductsByStoreId, storeFrontMeta?.storeId]);

  return (
    <main style={{ minHeight: '100vh', background: '#030712' }}>
      <GamingHeader />
      <GamingHeroSection />
      <GamingNewArrivalsSection />
      <GamingTestimonialsSection />
      <GamingFooter />
    </main>
  );
};
