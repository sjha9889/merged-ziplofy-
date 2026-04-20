import { Link } from 'react-router-dom'
import type { ProductItem } from '../types/product'
import { formatInrSymbol } from '../lib/money'

type NewArrivalsSectionProps = {
  promoImage: string
  products: ProductItem[]
}

/**
 * New arrivals block: left promo banner + right 2x2 compact cards.
 */
export function NewArrivalsSection({ promoImage, products }: NewArrivalsSectionProps) {
  if (!products.length) return null
  const cards = products.slice(0, 4).map((p) => ({
    ...p,
    brand: 'Girard Perregaux',
    name: 'Laureato 81015 11 001 11A',
    priceInr: 2300,
  }))

  return (
    <section className="bg-[#ECECEC] px-3 pb-6 pt-0 sm:px-5 sm:pb-8">
      <div className="mx-auto w-full max-w-[1394px] border border-[#D6D6D6] bg-[#ECECEC] px-6 py-7 sm:px-8 sm:py-8">
        <div className="grid gap-4 lg:grid-cols-[230px_1fr] lg:gap-4">
          <NewArrivalPromo image={promoImage} />

          <div>
            <h2
              className="mb-4 text-center text-[42px] font-medium leading-none tracking-tight text-black lg:text-left"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              New Arrivals
            </h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {cards.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="group flex min-h-[184px] flex-col rounded-2xl border border-[#D8D8D8] bg-[#ECECEC] px-3 py-2.5"
                >
                  <div className="flex h-[74px] w-full items-center justify-center">
                    <img src={p.image} alt="" className="h-full max-h-[74px] w-auto object-contain" />
                  </div>

                  <p className="mt-2 text-[13px] font-bold leading-none text-black">{formatInrSymbol(p.priceInr)}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#3498db]">
                    {p.brand.toUpperCase()}
                  </p>
                  <p className="mt-1 text-[9px] font-normal uppercase tracking-wide text-black">
                    {p.name.toUpperCase()}
                  </p>
                  <p className="mt-0.5 text-[9px] font-normal uppercase tracking-wide text-black">
                    SKELETON DIAL | STAINLESS STEEL
                  </p>

                  <div className="mt-auto border-t border-[#CFCFCF] pt-2">
                    <div className="flex justify-end">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-500 text-[20px] font-light leading-none text-neutral-800 transition group-hover:border-[#3498db] group-hover:text-[#3498db]">
                        +
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function NewArrivalPromo({ image }: { image: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-black lg:h-[514px]">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" aria-hidden />
      <div className="relative z-[1] flex h-full min-h-[320px] flex-col justify-between px-4 py-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/95">Limited edition</p>
          <h3 className="mt-3 text-[41px] font-bold uppercase leading-[1.08] tracking-tight text-white">
            Discover the hottest wrist watch
          </h3>
        </div>
        <a
          href="#collections"
          className="inline-flex w-max items-center justify-center rounded-[4px] border border-[#8b6a35] bg-black/20 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white"
        >
          Shop now
        </a>
      </div>
    </div>
  )
}
