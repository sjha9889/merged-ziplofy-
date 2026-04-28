import { useEffect } from 'react';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useStorefrontCart } from '../contexts/storefront-cart.context';
import { useStorefrontCollections } from '../contexts/storefront-collections.context';
import { useStorefrontProducts } from '../contexts/product.context';
import { Hero } from '../components/Hero';
import { HomeDiscoverySection } from '../components/HomeDiscoverySection';
import { ExploreSwisswristSection } from '../components/ExploreSwisswristSection';
import { NewArrivalsSection } from '../components/NewArrivalsSection';
import { InvestmentSection } from '../components/InvestmentSection';
import { InvestmentFeatureSection } from '../components/InvestmentFeatureSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { InstagramGallerySection } from '../components/InstagramGallerySection';
import { buildCatalog } from '../data/catalog';
import { assets, hublotImages, omegaImages, rolexImages } from '../data/images';
import banner1 from '../assets/banners/banner-1.png';
import banner2 from '../assets/banners/banner-2.png';
import banner3 from '../assets/banners/banner-3.png';

const catalog = buildCatalog(rolexImages, omegaImages, hublotImages);
const heroBanners = [assets.heroScene, banner1, banner2, banner3];

const instagramGridImages = [
  catalog.hublot[4].image,
  catalog.omega[1].image,
  catalog.hublot[2].image,
  catalog.rolex[8].image,
  catalog.rolex[3].image,
  catalog.omega[4].image,
  catalog.rolex[0].image,
  catalog.hublot[0].image,
];

const exploreSwisswristImages = [
  catalog.hublot[2].image,
  catalog.rolex[10].image,
  catalog.omega[1].image,
  catalog.rolex[7].image,
  catalog.hublot[0].image,
  catalog.omega[5].image,
  catalog.rolex[5].image,
  catalog.hublot[4].image,
];

const newArrivalProducts = [catalog.omega[2], catalog.rolex[0], catalog.omega[10], catalog.omega[7]].map((p) => ({
  ...p,
  brand: 'Girard Perregaux',
  name: 'Laureato 81015 11 001 11A',
  priceInPaisa: 230000,
}));

const testimonials = [
  {
    image: catalog.rolex[7].image,
    name: 'Rahul Mehta',
    role: 'Working Professional',
    quote:
      'The Design looks very premium and the finishing is impressive. I’ve received multiple compliments, and honestly it feels much more expensive than what I paid.',
  },
  {
    image: catalog.hublot[4].image,
    name: 'Rahul Mehta',
    role: 'College Student',
    quote:
      'The Design looks very premium and the finishing is impressive. I’ve received multiple compliments, and honestly it feels much more expensive than what I paid.',
  },
  {
    image: catalog.rolex[5].image,
    name: 'Rahul Mehta',
    role: 'Working Professional',
    quote:
      'The Design looks very premium and the finishing is impressive. I’ve received multiple compliments, and honestly it feels much more expensive than what I paid.',
  },
  {
    image: catalog.rolex[10].image,
    name: 'Rahul Mehta',
    role: 'College Student',
    quote:
      'The Design looks very premium and the finishing is impressive. I’ve received multiple compliments, and honestly it feels much more expensive than what I paid.',
  },
  {
    image: catalog.rolex[10].image,
    name: 'Rahul Mehta',
    role: 'College Student',
    quote:
      'The Design looks very premium and the finishing is impressive. I’ve received multiple compliments, and honestly it feels much more expensive than what I paid.',
  },
];

export default function StorefrontApp() {
  const { storeFrontMeta } = useStorefront();
  const { user } = useStorefrontAuth();
  const { getCartByCustomerId } = useStorefrontCart();
  const { fetchCollectionsByStoreId } = useStorefrontCollections();
  const { products, fetchProductsByStoreId } = useStorefrontProducts();

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

  const realIds = products.map((p) => p._id);
  const getRealId = (fallbackId: string, index: number) => realIds[index] ?? fallbackId;

  const catalogWithRealIds = {
    rolex: catalog.rolex.map((p, i) => ({ ...p, id: getRealId(p.id, i) })),
    omega: catalog.omega.map((p, i) => ({ ...p, id: getRealId(p.id, 11 + i) })),
    hublot: catalog.hublot.map((p, i) => ({ ...p, id: getRealId(p.id, 22 + i) })),
  }; 

  const newArrivalProductsWithRealIds = newArrivalProducts.map((p, i) => ({
    ...p,
    id: getRealId(p.id, i),
  }));

  return (
    <div className="min-h-svh bg-[#f7f6f4]">
      <main>
        <Hero bannerSources={heroBanners} />
        <HomeDiscoverySection catalog={catalogWithRealIds} />
        <ExploreSwisswristSection images={exploreSwisswristImages} />
        <NewArrivalsSection promoImage={catalog.hublot[4].image} products={newArrivalProductsWithRealIds} />
        <InvestmentSection image={assets.heroScene} />
        <InvestmentFeatureSection image={catalog.hublot[1].image} />
        <TestimonialsSection testimonials={testimonials} />
        <InstagramGallerySection images={instagramGridImages} />
      </main>
    </div>
  );
}
