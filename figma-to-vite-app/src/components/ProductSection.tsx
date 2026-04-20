import type { ProductItem } from '../types/product'
import { ProductCard } from './ProductCard'

export type { ProductItem }

type ProductSectionProps = {
  id: string
  eyebrow: string
  title: string
  description: string
  products: ProductItem[]
  /** e.g. "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" */
  gridClass?: string
}

export function ProductSection({
  id,
  eyebrow,
  title,
  description,
  products,
  gridClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}: ProductSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#b8956c]">
            {eyebrow}
          </p>
          <h2
            className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">{description}</p>
        </div>
        <div className={`grid gap-6 lg:gap-8 ${gridClass}`}>
          {products.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </div>
    </section>
  )
}
