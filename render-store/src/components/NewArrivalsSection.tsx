import { Link } from 'react-router-dom';
import { formatINR } from '../utils/currency';
import type { SwissWristProduct } from '../types/swisswrist-product';
import elegantGoldChronograph from '../assets/img/Elegant gold chronograph with green dial.png';

type NewArrivalsSectionProps = {
  promoImage: string;
  products: SwissWristProduct[];
};

const brandCyan = '#42B3C5';
const promoGold = '#C5A059';
const cardBorder = '#E0E0E0';

export function NewArrivalsSection({ promoImage= elegantGoldChronograph, products }: NewArrivalsSectionProps) {
  if (!products.length) return null;
  const cards = products.slice(0, 4);

  return (
    <section className="bg-[#f3f3f3] px-4 pb-10 pt-8 sm:px-6 sm:pb-12 sm:pt-10">
      <div className="mx-auto w-full max-w-[1394px]">
        <h2 className="mb-8 text-center text-[40px] font-light leading-none tracking-tight text-black sm:text-[44px]">
          New Arrivals
        </h2>

        <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[minmax(300px,1fr)_minmax(0,1.65fr)] lg:gap-6">
          <NewArrivalPromo image={promoImage} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4">
            {cards.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="group relative flex min-h-[305px] flex-col rounded-[22px] border bg-white px-5 pb-6 pt-4 transition"
                style={{ borderColor: cardBorder }}
              >
                <div className="flex h-[138px] items-start justify-center">
                  <img src={p.image} alt="" className="max-h-[132px] w-full max-w-[168px] object-contain object-center" />
                </div>

                <div className="mt-4 pr-12 text-left">
                  <p className="text-[16px] font-bold tabular-nums leading-none text-black sm:text-[17px]">
                    {formatINR(p.priceInPaisa)}
                  </p>
                  <p className="mt-2.5 text-[11px] font-semibold uppercase tracking-[0.07em]" style={{ color: brandCyan }}>
                    {p.brand.toUpperCase()}
                  </p>
                  <p className="mt-1.5 text-[11px] font-medium uppercase leading-snug tracking-[0.03em] text-black">
                    {p.name.toUpperCase()}
                  </p>
                  <p className="mt-1 text-[11px] font-normal uppercase leading-snug tracking-[0.03em] text-neutral-800">
                    SKELETON DIAL | STAINLESS STEEL
                  </p>
                </div>

                <span
                  className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-[#252525] transition group-hover:border-[#42B3C5]"
                  aria-hidden
                >
                  <span className="absolute h-px w-4 bg-[#252525] transition group-hover:bg-[#42B3C5]" />
                  <span className="absolute h-4 w-px bg-[#252525] transition group-hover:bg-[#42B3C5]" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function NewArrivalPromo({ image }: { image: string }) {
  return (
    <div className="relative flex min-h-[420px] overflow-hidden rounded-2xl bg-black sm:min-h-[460px] lg:min-h-0 lg:h-full">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      {/* <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/65" aria-hidden /> */}
      <div className="relative z-[1] flex h-full min-h-[420px] flex-col justify-between px-5 py-8 sm:px-6 sm:py-10 lg:min-h-0">
        <div className="text-center text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em]" style={{ color: promoGold }}>
            Limited edition
          </p>
          <h3 className="mx-auto mt-5 max-w-[280px] text-[18px] md:text-[26px] font-bold uppercase leading-[1.15] tracking-wide text-white sm:max-w-[320px] sm:text-[28px] lg:text-[30px]">
            Discover the hottest wrist watch
          </h3>
        </div>
        <div className="flex justify-center pb-2">
          <a
            href="/products"
            className="inline-flex items-center justify-center rounded-md border-2 px-8 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/10"
            style={{ borderColor: promoGold }}
          >
            Shop now
          </a>
        </div>
      </div>
    </div>
  );
}
