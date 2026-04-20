type InvestmentSectionProps = {
  image: string
}

/**
 * Editorial CTA block: message on left, featured watch image on right.
 */
export function InvestmentSection({ image }: InvestmentSectionProps) {
  return (
    <section className="bg-[#ECECEC] px-3 pb-6 pt-0 sm:px-5 sm:pb-8">
      <div className="mx-auto w-full max-w-[1394px] border border-[#D6D6D6] bg-[#ECECEC] px-6 py-7 sm:px-8 sm:py-8">
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_1.48fr] lg:gap-10">
          <div className="px-2 text-center lg:px-4">
            <p className="text-[14px] font-medium uppercase tracking-[0.03em] text-[#5a5a5a]">
              The Ultimate Watch Destination
            </p>
            <h2 className="mt-6 text-[22px] font-semibold uppercase leading-[1.15] tracking-tight text-black sm:text-[26px]">
              Invest in Timeless
              <br />
              Precision
            </h2>
            <p className="mx-auto mt-7 max-w-[420px] text-[16px] leading-[1.9] text-[#1d1d1d]">
              shop our master-curated of the world&apos;s finest pre-owned timepieces. Authenticity
              guaranteed, excellence delivered.
            </p>
            <a
              href="#collections"
              className="mt-8 inline-flex items-center justify-center rounded-[6px] bg-black px-5 py-3 text-[15px] font-medium uppercase tracking-tight text-white hover:bg-neutral-900"
            >
              Explore Catalogue
            </a>
          </div>

          <div className="overflow-hidden rounded-xl bg-[#d9d9d9]">
            <img src={image} alt="" className="h-full min-h-[320px] w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}
