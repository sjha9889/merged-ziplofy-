type ExploreSwisswristSectionProps = {
  images: string[]
}

/**
 * "EXPLORE SWISSWRIST" block directly below HomeDiscoverySection.
 * Desktop target from design: 1394w x 641h, 1px border.
 */
export function ExploreSwisswristSection({ images }: ExploreSwisswristSectionProps) {
  if (!images.length) return null
  const tiles = Array.from({ length: 8 }, (_, i) => images[i % images.length])

  return (
    <section className="bg-[#ECECEC] px-3 pb-6 pt-3 sm:px-5 sm:pb-8 sm:pt-4">
      <div className="mx-auto min-h-[641px] w-full max-w-[1394px] border border-[#D6D6D6] bg-[#ECECEC] px-6 py-5 sm:px-8 sm:py-6">
        <h2
          className="text-[17px] font-medium uppercase leading-none tracking-tight text-black sm:text-[18px]"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Explore Swisswrist
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
          {tiles.map((src, i) => (
            <article
              key={`${src}-${i}`}
              className="overflow-hidden rounded-[14px] bg-neutral-200 shadow-[0_1px_0_rgba(0,0,0,0.08)]"
            >
              <img src={src} alt="" className="aspect-[1.62/1] w-full object-cover" />
            </article>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            className="inline-flex min-w-[112px] items-center justify-center rounded-[6px] border border-[#8D8D8D] bg-[#ECECEC] px-5 py-1.5 text-[15px] font-medium leading-none tracking-tight text-black hover:bg-[#e4e4e4]"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Display All
          </button>
        </div>
      </div>
    </section>
  )
}
