const contentMax = 'max-w-[1394px]'

type InstagramGallerySectionProps = {
  /** Watch lifestyle images — first 8 used, or cycled if fewer */
  images: string[]
}

/**
 * Instagram-style gallery — left title, 8 square tiles, gutters ~16–20px, ~10px radius (reference).
 */
export function InstagramGallerySection({ images }: InstagramGallerySectionProps) {
  if (!images.length) return null
  const tiles = Array.from({ length: 8 }, (_, i) => images[i % images.length])

  return (
    <section className="bg-[#ECECEC] px-3 pb-6 pt-0 sm:px-5 sm:pb-8" aria-labelledby="instagram-gallery-heading">
      <div className={`mx-auto ${contentMax} border border-[#D6D6D6] bg-[#ECECEC] px-4 pb-14 pt-12 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8`}>
        <h2
          id="instagram-gallery-heading"
          className="max-w-4xl text-[18px] font-medium leading-snug tracking-tight text-black sm:text-[19px]"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          What&apos;s New on Instagram: Trends, Inspiration, and Lifestyle
        </h2>

        <div className="mt-7 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-3 md:grid-cols-4">
          {tiles.map((src, i) => (
            <a
              key={`${src}-${i}`}
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-[10px] bg-neutral-100 outline-none ring-black/5 transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-black"
            >
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
