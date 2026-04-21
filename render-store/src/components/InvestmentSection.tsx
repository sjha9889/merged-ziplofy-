type InvestmentSectionProps = {
  image: string;
};

export function InvestmentSection({ image }: InvestmentSectionProps) {
  return (
    <section className="bg-[#F1F7FA] px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
      <div className="mx-auto flex w-full max-w-[1394px] flex-col items-stretch gap-10 lg:flex-row lg:items-center lg:gap-14">
        <div className="flex flex-1 flex-col items-center justify-center text-center lg:max-w-[min(560px,50%)] lg:items-center lg:px-2">
          <p className="text-[15px] font-medium uppercase tracking-[0.1em] text-[#6b7280] sm:text-[16px]">
            The Ultimate Watch Destination
          </p>
          <h2 className="mt-6 max-w-[18ch] text-[clamp(1.875rem,5.2vw,3.25rem)] font-semibold uppercase leading-[1.08] tracking-[0.02em] text-black">
            Invest in Timeless
            <br />
            Precision
          </h2>
          <p className="mx-auto mt-9 max-w-[440px] text-[17px] leading-[1.8] text-[#374151] sm:text-[18px]">
            shop our master-curated selection of the world&apos;s finest pre-owned timepieces. Authenticity
            guaranteed, excellence delivered.
          </p>
          <a
            href="/category"
            className="mt-11 inline-flex items-center justify-center bg-black px-12 py-4 text-[13px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-neutral-900 sm:text-[14px]"
            style={{ borderRadius: 0 }}
          >
            Explore Catalogue
          </a>
        </div>

        <div className="relative min-h-0 flex-1 lg:min-h-[420px]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-[#0d1f16] shadow-[0_8px_30px_rgba(15,23,42,0.08)] lg:aspect-[5/4] lg:min-h-[420px]">
            <img
              src={image}
              alt=""
              className="absolute inset-0 h-full w-full scale-[1.14] object-cover object-[92%_42%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
