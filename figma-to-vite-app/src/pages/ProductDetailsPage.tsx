import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { hublotImages, omegaImages, rolexImages } from '../data/images'
import { buildCatalog } from '../data/catalog'
import { getProductById, getRelatedProducts } from '../data/catalogIndex'
import { formatRs } from '../lib/money'
import { ProductGallery } from '../components/ProductGallery'
import { RelatedProductCard } from '../components/RelatedProductCard'
import { SwissWristFooter } from '../components/SwissWristFooter'
import { SwissWristHeader } from '../components/SwissWristHeader'

const catalog = buildCatalog(rolexImages, omegaImages, hublotImages)

const trust = [
  '24 Months Warranty',
  'Free Shipping Countrywide',
  'Easy Return',
  'Pay on Delivery Available',
  'Service Across India',
]

const pdpBorder = 'border-[#E0E0E0]'
const deliveryGold = 'text-[#8a7339]'

export default function ProductDetailsPage() {
  const { productId } = useParams<{ productId: string }>()
  const product = productId ? getProductById(catalog, productId) : undefined
  const [openAcc, setOpenAcc] = useState<Record<string, boolean>>({
    desc: true,
    spec: false,
    more: false,
  })

  const related = useMemo(() => {
    if (!product) return []
    return getRelatedProducts(catalog, product, 4)
  }, [product])

  if (!productId || !product) {
    return <Navigate to="/" replace />
  }

  const longTitle = `${product.name} Oyster edition Automatic japanese machinery`

  return (
    <div className="min-h-svh bg-white">
      <SwissWristHeader />

      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8">
        <nav
          className="border-b border-[#EEEEEE] py-3.5 text-[13px] text-[#737373]"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="transition hover:text-black">
            Home
          </Link>
          <span className="mx-2 text-neutral-400">&gt;</span>
          <span>Watch on sale</span>
          <span className="mx-2 text-neutral-400">&gt;</span>
          <span className="font-medium text-neutral-900">{product.brand}</span>
        </nav>

        <main className="pb-12 pt-6 sm:pb-14 sm:pt-8 lg:pt-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-x-14 lg:gap-y-0 lg:items-start">
            <ProductGallery key={product.id} product={product} catalog={catalog} />

            <div className="min-w-0">
              <h1
                className="max-w-[520px] text-[22px] font-bold leading-[1.35] tracking-tight text-black sm:text-[24px] lg:text-[26px] lg:leading-snug"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {longTitle}
              </h1>

              <p
                className="mt-5 text-[28px] font-bold leading-none tracking-tight text-black sm:text-[30px]"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {formatRs(product.priceInr)}
              </p>
              <p className="mt-2 text-sm font-normal text-[#737373]">inclusive all taxes</p>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <button
                  type="button"
                  className={`min-h-[52px] rounded-[10px] border border-black bg-white text-[15px] font-semibold text-black transition hover:bg-neutral-50`}
                >
                  Add to cart
                </button>
                <button
                  type="button"
                  className="min-h-[52px] rounded-[10px] bg-black text-[15px] font-semibold text-white transition hover:bg-neutral-900"
                >
                  Buy Now
                </button>
              </div>

              <button
                type="button"
                className={`mt-8 flex w-full items-center justify-between gap-4 rounded-[10px] border ${pdpBorder} bg-[#FAFAFA] px-4 py-4 text-left transition hover:bg-neutral-100`}
              >
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-black">Check Delivery Availability</p>
                  <p className={`mt-1.5 text-sm font-medium ${deliveryGold}`}>
                    Dispatched By 16 apr, Thursday
                  </p>
                  <p className={`mt-0.5 text-xs ${deliveryGold}`}>If ordered within 17 hrs 55 mins</p>
                </div>
                <span className="shrink-0 text-xl font-light text-neutral-500" aria-hidden>
                  ›
                </span>
              </button>

              <div
                className={`mt-8 grid grid-cols-2 gap-x-3 gap-y-2 border-t ${pdpBorder} pt-6 sm:grid-cols-3 md:grid-cols-5 md:gap-x-2`}
              >
                {trust.map((t) => (
                  <span
                    key={t}
                    className="text-center text-[10px] font-normal leading-snug text-black sm:text-[11px]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className={`mt-10 divide-y divide-[#E0E0E0] border-t ${pdpBorder}`}>
                {(
                  [
                    ['desc', 'Product Description'],
                    ['spec', 'Product Specification'],
                    ['more', 'More Information'],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key}>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenAcc((s) => ({
                          ...s,
                          [key]: !s[key],
                        }))
                      }
                      className="flex w-full items-center justify-between py-4 text-left text-[15px] font-semibold text-black"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {label}
                      <span
                        className={`text-neutral-500 transition-transform duration-200 ${
                          openAcc[key] ? 'rotate-180' : ''
                        }`}
                        aria-hidden
                      >
                        <ChevronDown className="h-5 w-5" />
                      </span>
                    </button>
                    {openAcc[key] ? (
                      <div className="pb-4 text-sm leading-relaxed text-[#555555]">
                        {key === 'desc' && (
                          <p>
                            Authentic {product.brand} timepiece with precision movement, sapphire crystal,
                            and original finishing. Each watch is inspected before dispatch.
                          </p>
                        )}
                        {key === 'spec' && (
                          <ul className="list-inside list-disc space-y-1">
                            <li>Case: stainless steel / manufacturer specification</li>
                            <li>Movement: automatic</li>
                            <li>Water resistance: per manufacturer rating</li>
                            <li>Warranty: 24 months</li>
                          </ul>
                        )}
                        {key === 'more' && (
                          <p>
                            SKU: {product.id.toUpperCase()}. For servicing and authenticity questions,
                            contact client care.
                          </p>
                        )}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <section className="border-t border-[#E0E0E0] bg-[#FAFAFA] px-4 py-12 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1200px] px-1 sm:px-0">
          <h2 className="mb-8 text-xl font-bold tracking-tight text-black sm:text-2xl">
            Related Products
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5 md:items-stretch">
            {related.map((p) => (
              <RelatedProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <SwissWristFooter />
    </div>
  )
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
