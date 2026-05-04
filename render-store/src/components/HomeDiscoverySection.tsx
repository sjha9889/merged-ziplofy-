import type { SwissWristProduct } from '../types/swisswrist-product';
import { assets } from '../data/images';
import type { StorefrontProductItem } from '../contexts/product.context';
import { ProductCard } from './ProductCard';

type CatalogSlice = {
  rolex: SwissWristProduct[];
  omega: SwissWristProduct[];
  hublot: SwissWristProduct[];
};

type HomeDiscoverySectionProps = {
  catalog: CatalogSlice;
  products: StorefrontProductItem[];
  loading?: boolean;
};

const contentMax = 'max-w-[1320px]';

export function HomeDiscoverySection({ catalog, products, loading = false }: HomeDiscoverySectionProps) {
  const { rolex, omega } = catalog;
  const leftBanner = assets.elegantRoseGoldMacro;
  const rightBanner = assets.elegantGreenChronograph;
  const quad = [
    rolex[1]?.image ?? leftBanner,
    assets.elegantRoseGoldMacro,
    omega[5]?.image ?? leftBanner,
    rolex[7]?.image ?? rightBanner,
  ];
  const rowProducts = products.slice(0, 4);

  const gridRowH = 'h-[320px] md:h-[340px]';

  return (
    <section className="bg-white px-4 py-5 sm:px-6 sm:py-6 lg:px-8 ">
      <div className={`mx-auto ${contentMax}`}>
        <div className="grid grid-cols-1 gap-1.5 md:grid-cols-[1fr_2.25fr_1fr]">
          <BannerColumn image={leftBanner} className={gridRowH} />
          <div className={`grid grid-cols-2 grid-rows-2 gap-1.5 ${gridRowH}`}>
            {quad.map((src, i) => (
              <div key={`${src}-${i}`} className="relative min-h-0 overflow-hidden">
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <BannerColumn image={rightBanner} className={gridRowH} />
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {loading ? (
            <div className="col-span-full rounded-[14px] border border-[#E0E0E0] bg-white p-6 text-center text-sm text-neutral-600">
              Loading products...
            </div>
          ) : rowProducts.length === 0 ? (
            <div className="col-span-full rounded-[14px] border border-[#E0E0E0] bg-white p-6 text-center text-sm text-neutral-600">
              No products available.
            </div>
          ) : (
            rowProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                image={product.imageUrls?.[0] || '/assets/img/watch-1.jpg'}
                name={product.title || 'Laureato 81015 11 001 11A'}
                brand={product.vendor?.name || 'Girard Perregaux'}
                priceInPaisa={product.price}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function BannerColumn({ image, className }: { image: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-neutral-900 ${className ?? ''}`}>
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/25" aria-hidden />
      <div className="relative z-[1] flex h-full min-h-[inherit] flex-col justify-between px-4 py-4 text-center md:px-5 md:py-5">
        <div className="mx-auto text-white">
          <p className="text-[10px] text-red font-semibold uppercase tracking-[0.24em] text-[#DFE49C]">Limited edition</p>
          <h3 className="mt-3 max-w-[13rem] text-[20px] font-medium uppercase leading-[1.28] tracking-[0.02em] text-white sm:text-[22px]">
            Discover the hottest wrist watchh
          </h3>
        </div>
        <div className="flex justify-center pb-1">
          <a
            href="/products"
            className="inline-flex w-max items-center justify-center rounded-[4px] border border-white/40 bg-black/20 px-5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-black/35"
          >
            Shop now
          </a>
        </div>
      </div>
    </div>
  );
}
