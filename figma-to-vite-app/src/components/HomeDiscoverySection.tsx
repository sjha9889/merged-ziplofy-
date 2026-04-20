import type { ProductItem } from '../types/product'
import { ProductCard } from './ProductCard'

type CatalogSlice = {
  rolex: ProductItem[]
  omega: ProductItem[]
  hublot: ProductItem[]
}

type HomeDiscoverySectionProps = {
  catalog: CatalogSlice
}

const contentMax = 'max-w-[1320px]'

/**
 * Flow (reference): hero → **this block** — 6-image grid + 4 product cards, both in the same max-width column on white.
 */
export function HomeDiscoverySection({ catalog }: HomeDiscoverySectionProps) {
  const { rolex, omega } = catalog
  // Curated to match reference mosaic image choices.
  const leftBanner = rolex[4]?.image ?? rolex[0].image // rolex-5.webp
  const rightBanner = rolex[7]?.image ?? omega[10]?.image ?? omega[0].image // rolex-8.webp fallback
  const quad = [
    omega[5], // omega-6.webp (top-left)
    rolex[8], // rolex-9.webp (top-right)
    omega[4], // omega-5.webp (bottom-left)
    rolex[10], // rolex-11.webp (bottom-right)
  ].map((p) => p?.image ?? rolex[0].image)
  const rowProducts = [omega[2], rolex[0], omega[7], omega[9]].map((p) => ({
    ...p,
    brand: 'Girard Perregaux',
    name: 'Laureato 81015 11 001 11A',
    priceInr: 2300,
  }))

  const gridRowH = 'h-[320px] md:h-[372px]'

  return (
    <section className="bg-[#ECECEC] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div className={`mx-auto ${contentMax}`}>
        {/* 6 blocks: tall | 2×2 | tall — exact reference composition */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_2.08fr_1fr]">
          <BannerColumn image={leftBanner} className={gridRowH} />
          <div className={`grid grid-cols-2 grid-rows-2 gap-2 ${gridRowH}`}>
            {quad.map((src, i) => (
              <div key={i} className="relative min-h-0 overflow-hidden">
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <BannerColumn image={rightBanner} className={gridRowH} />
        </div>

        {/* Four cards — same horizontal alignment as grid above */}
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {rowProducts.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </div>
    </section>
  )
}

/** Side promos: copy toward top, white SHOP NOW pinned to bottom (reference). */
function BannerColumn({ image, className }: { image: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-neutral-900 ${className ?? ''}`}>
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/25" aria-hidden />
      <div
        className="relative z-[1] flex h-full min-h-[inherit] flex-col justify-between px-4 py-4 md:px-5 md:py-5"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/95">
            Limited edition
          </p>
          <h3 className="mt-3 max-w-[13rem] text-[34px] font-bold uppercase leading-[1.15] tracking-[0.01em] text-white sm:text-[36px] md:text-[37px]">
            Discover the hottest wrist watch
          </h3>
        </div>
        <a
          href="#collections"
          className="mt-auto inline-flex w-max items-center justify-center rounded-md bg-white px-6 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-black transition hover:bg-neutral-100"
        >
          Shop now
        </a>
      </div>
    </div>
  )
}
