type FooterProps = {
  logoSrc: string
  socialStripSrc: string
  facebookSrc: string
  twitterSrc: string
  youtubeSrc: string
}

export function Footer({
  logoSrc,
  socialStripSrc,
  facebookSrc,
  twitterSrc,
  youtubeSrc,
}: FooterProps) {
  return (
    <footer id="contact" className="border-t border-neutral-800 bg-[#0a0a0a] text-neutral-300">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10 lg:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <img src={logoSrc} alt="" className="h-10 w-auto object-contain brightness-0 invert" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-neutral-400">
              Boutique timepieces with certificate-of-authenticity workflow, white-glove service, and
              worldwide insured shipping.
            </p>
            <div className="mt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
                Follow
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <a href="#" className="opacity-90 transition hover:opacity-100" aria-label="Facebook">
                  <img src={facebookSrc} alt="" className="h-8 w-8 object-contain" />
                </a>
                <a href="#" className="opacity-90 transition hover:opacity-100" aria-label="Twitter">
                  <img src={twitterSrc} alt="" className="h-8 w-8 object-contain" />
                </a>
                <a href="#" className="opacity-90 transition hover:opacity-100" aria-label="YouTube">
                  <img src={youtubeSrc} alt="" className="h-8 w-8 object-contain" />
                </a>
                <img
                  src={socialStripSrc}
                  alt=""
                  className="hidden h-9 max-w-[200px] object-contain opacity-90 sm:block"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white">
                Shop
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a href="#rolex" className="transition hover:text-white">
                    Rolex
                  </a>
                </li>
                <li>
                  <a href="#omega" className="transition hover:text-white">
                    Omega
                  </a>
                </li>
                <li>
                  <a href="#hublot" className="transition hover:text-white">
                    Hublot
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white">
                Client care
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a href="#" className="transition hover:text-white">
                    Authenticity
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-white">
                    Shipping & returns
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-white">
                    Warranty
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white">
                Newsletter
              </p>
              <p className="mt-4 text-sm text-neutral-400">
                New arrivals and private sales — monthly at most.
              </p>
              <form
                className="mt-4 flex flex-col gap-2 sm:flex-row"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Email address"
                  className="min-h-11 flex-1 rounded-full border border-neutral-700 bg-neutral-900/80 px-4 text-sm text-white placeholder:text-neutral-500 focus:border-[#b8956c] focus:outline-none focus:ring-1 focus:ring-[#b8956c]"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[#b8956c] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-900 transition hover:bg-[#c9a97f]"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-8 text-xs text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Boutique. Crafted for the Figma export.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neutral-300">
              Privacy
            </a>
            <a href="#" className="hover:text-neutral-300">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
