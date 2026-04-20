import { Link } from 'react-router-dom'
import { formatInrSymbol } from '../lib/money'

const line2ByBrand: Record<string, string> = {
  Rolex: 'OYSTER CASE | STAINLESS STEEL',
  Omega: 'CO‑AXIAL MASTER | STAINLESS STEEL',
  Hublot: 'FUSION CASE | STAINLESS STEEL',
  'Girard Perregaux': 'SKELETON DIAL | STAINLESS STEEL',
}

/** Brand line — light blue per SWISSWRIST comp (e.g. Girard-Perregaux row) */
const brandAccent = 'text-[#3498db]'

type ProductCardProps = {
  id: string
  image: string
  name: string
  brand: string
  priceInr: number
}

/**
 * Luxury grid card — ₹ price, light-blue brand, two-line uppercase spec, divider, + (reference).
 */
export function ProductCard({ id, image, name, brand, priceInr }: ProductCardProps) {
  const line1 = name.toUpperCase()
  const line2 = line2ByBrand[brand] ?? 'AUTOMATIC MOVEMENT | STAINLESS STEEL'

  return (
    <Link
      to={`/product/${id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[14px] border border-[#E0E0E0] bg-white transition hover:border-neutral-300"
    >
      <div className="flex min-h-[200px] flex-1 items-center justify-center bg-white px-5 py-8 sm:min-h-[220px] sm:px-6 sm:py-10">
        <img
          src={image}
          alt=""
          className="max-h-[200px] w-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.02] sm:max-h-[220px]"
        />
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-1 sm:px-5">
        <p
          className="text-[15px] font-bold tabular-nums leading-none text-black"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {formatInrSymbol(priceInr)}
        </p>
        <p
          className={`mt-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${brandAccent}`}
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {brand.toUpperCase()}
        </p>
        <div className="mt-2 space-y-0.5">
          <p
            className="text-[10px] font-normal uppercase leading-snug tracking-wide text-black sm:text-[11px]"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {line1}
          </p>
          <p
            className="text-[10px] font-normal uppercase leading-snug tracking-wide text-black sm:text-[11px]"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {line2}
          </p>
        </div>

        <div className="mt-4 border-t border-[#E0E0E0] pt-3">
          <div className="flex justify-end">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-400 bg-white text-[20px] font-light leading-none text-neutral-800 transition group-hover:border-[#3498db] group-hover:text-[#3498db]"
              aria-hidden
            >
              +
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
