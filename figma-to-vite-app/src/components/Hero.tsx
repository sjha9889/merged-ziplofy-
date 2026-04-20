type HeroProps = {
  bannerSrc: string
}

/**
 * Luxury marquee: full-bleed art, left copy (promo / headline / SHOP NOW),
 * vignette + soft bokeh — matches SWISSWRIST green-silk reference.
 */
export function Hero({ bannerSrc }: HeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-[#0b2114]">
      <div className="relative h-svh min-h-[640px] w-full">
        <img
          src={bannerSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_35%] sm:object-center"
        />
        {/* Vignette: readable left column + depth */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_75%_at_15%_45%,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.35)_42%,transparent_72%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b2114]/90 via-transparent to-[#0b2114]/25"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent sm:from-black/50"
          aria-hidden
        />
        {/* Soft gold bokeh */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute left-[8%] top-[18%] h-40 w-40 rounded-full bg-[#d4a84b]/15 blur-3xl" />
          <div className="absolute left-[22%] top-[42%] h-24 w-24 rounded-full bg-[#e8c76b]/20 blur-2xl" />
          <div className="absolute right-[28%] top-[12%] h-32 w-32 rounded-full bg-[#c9a050]/12 blur-3xl" />
        </div>

        <div className="relative z-[1] mx-auto flex h-full max-w-[1440px] flex-col justify-center px-5 pb-24 pt-32 sm:px-8 sm:pb-28 sm:pt-36 lg:px-10 lg:pb-20 lg:pt-28">
          <div className="max-w-xl">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white sm:text-xs sm:tracking-[0.32em]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Extra 15% off with code :{' '}
              <span className="whitespace-nowrap">TIME15</span>
            </p>
            <h1
              className="mt-5 text-[clamp(1.75rem,5vw,3.75rem)] font-bold uppercase leading-[1.08] tracking-[0.02em] text-white"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              <span className="block">Discover your</span>
              <span className="block">perfect watch</span>
            </h1>
            <a
              href="#collections"
              className="mt-10 inline-flex items-center justify-center rounded-md bg-white px-10 py-[15px] text-[13px] font-bold uppercase tracking-[0.18em] text-black transition hover:bg-neutral-100"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Shop now
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
