import { Link } from 'react-router-dom'
import type { ProductItem } from '../types/product'
import { formatInrSymbol } from '../lib/money'

type RelatedProductCardProps = {
  product: ProductItem
}

/**
 * Related product tile — fixed image vault + aligned copy + divider + plus (symmetrical row).
 */
export function RelatedProductCard({ product }: RelatedProductCardProps) {
  const line1 = `${product.brand} ${product.name}`.toUpperCase()
  const line2 = 'AUTOMATIC · STAINLESS STEEL'

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition hover:border-neutral-300 hover:shadow-md"
    >
      {/* Fixed-height image area — all cards share the same vertical space */}
      <div className="flex h-[200px] w-full shrink-0 items-center justify-center bg-white px-4 py-5 sm:h-[220px]">
        <img
          src={product.image}
          alt=""
          className="h-full w-full max-h-[200px] object-contain object-center sm:max-h-[220px]"
        />
      </div>

      {/* Text stack: equal structure on every card */}
      <div className="flex min-h-0 flex-1 flex-col px-3 pt-3">
        <p className="text-[15px] font-bold tabular-nums leading-tight text-neutral-900">
          {formatInrSymbol(product.priceInr)}
        </p>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3498db]">
          {product.brand.toUpperCase()}
        </p>
        <div className="mt-2 min-h-[2.75rem]">
          <p className="line-clamp-2 text-[10px] font-normal uppercase leading-snug tracking-wide text-black">
            {line1}
          </p>
          <p className="mt-0.5 line-clamp-1 text-[10px] font-normal uppercase leading-snug tracking-wide text-black">
            {line2}
          </p>
        </div>

        <div className="mt-auto border-t border-neutral-200 pt-3">
          <div className="flex justify-end">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-400 bg-white text-[22px] font-light leading-none text-neutral-800 transition group-hover:border-[#3498db] group-hover:text-[#3498db]"
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
