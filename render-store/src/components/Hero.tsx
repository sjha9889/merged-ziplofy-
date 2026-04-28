import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

type HeroProps = {
  bannerSources: string[];
  intervalMs?: number;
};

export function Hero({ bannerSources, intervalMs = 4500 }: HeroProps) {
  const sources = useMemo(() => bannerSources.filter(Boolean), [bannerSources]);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  useEffect(() => {
    if (sources.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % sources.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [sources.length, intervalMs]);

  useEffect(() => {
    setActiveBannerIndex(0);
  }, [sources.length]);

  const activeBanner = sources[activeBannerIndex] ?? '';

  return (
    <section className="relative w-full overflow-hidden bg-[#0b2114]">
      <div className="relative h-svh min-h-[640px] w-full">
        <img src={activeBanner} alt="" className="absolute inset-0 h-full w-full object-cover object-[center_35%] sm:object-center" />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_75%_at_15%_45%,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.35)_42%,transparent_72%)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b2114]/90 via-transparent to-[#0b2114]/25" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent sm:from-black/50" aria-hidden />

        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute left-[8%] top-[18%] h-40 w-40 rounded-full bg-[#d4a84b]/15 blur-3xl" />
          <div className="absolute left-[22%] top-[42%] h-24 w-24 rounded-full bg-[#e8c76b]/20 blur-2xl" />
          <div className="absolute right-[28%] top-[12%] h-32 w-32 rounded-full bg-[#c9a050]/12 blur-3xl" />
        </div>

        <div className="relative z-[1] mx-auto flex h-full max-w-[1440px] flex-col justify-center px-5 pb-24 pt-32 sm:px-8 sm:pb-28 sm:pt-36 lg:px-10 lg:pb-20 lg:pt-28">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white sm:text-xs sm:tracking-[0.32em]">
              Extra 15% off with code : <span className="whitespace-nowrap">TIME15</span>
            </p>
            <h1 className="mt-5 text-[clamp(1.75rem,5vw,3.75rem)] font-bold uppercase leading-[1.08] tracking-[0.02em] text-white">
              <span className="block text-white">Discover your</span>
              <span className="block text-white">perfect watch</span>
            </h1>
            <Link
              to="/products"
              className="mt-10 inline-flex items-center justify-center rounded-md bg-white px-10 py-[15px] text-[13px] font-bold uppercase tracking-[0.18em] text-black transition hover:bg-neutral-100"
            >
              Shop now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
