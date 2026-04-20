/** Mid-page brand highlight — matches common Figma “discover” rows */
export function BrandStrip() {
  return (
    <section
      id="collections"
      className="scroll-mt-24 border-y border-neutral-200/90 bg-white px-4 py-12 sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-[1440px]">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.35em] text-[#b8956c]">
          Curated maisons
        </p>
        <h2
          className="mt-3 text-center text-2xl font-semibold text-neutral-900 sm:text-3xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Three houses. One standard.
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              href: '#rolex',
              name: 'Rolex',
              text: 'Geneva — tool watches elevated to icons.',
            },
            {
              href: '#omega',
              name: 'Omega',
              text: 'Biel — lunar heritage and ocean-ready engineering.',
            },
            {
              href: '#hublot',
              name: 'Hublot',
              text: 'Nyon — fusion materials and bold architecture.',
            },
          ].map((b) => (
            <a
              key={b.name}
              href={b.href}
              className="group rounded-2xl border border-neutral-200/90 bg-[#f7f6f4] p-6 text-center transition hover:border-[#b8956c]/40 hover:shadow-md"
            >
              <p
                className="text-xl font-semibold text-neutral-900 sm:text-2xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {b.name}
              </p>
              <p className="mt-2 text-sm text-neutral-600">{b.text}</p>
              <span className="mt-4 inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f714e] transition group-hover:text-[#b8956c]">
                Explore →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
