/** Footer matching the reference: 4 columns + slim bottom row with round socials. */
export function SwissWristFooter() {
  return (
    <footer className="bg-[#050607] text-[#b8b8b8]">
      <div className="mx-auto max-w-[1394px] px-4 pb-5 pt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <FooterCol title="Watches" items={['New Release', 'Best Sellers', "Men's Watches", "Women's Watches", 'Accessories', 'Shop All Watches']} />
          <FooterCol title="The story" items={['Our Philosophies', 'Ambassadors & Partners', 'Our Town', 'The Journal', 'Careers']} />
          <FooterCol title="Yours Swisswrist" items={['My Club Swisswrist', 'FAQs', 'Servicing & Repairs', 'Delivery & Returns', 'Privacy Policy', 'Terms and Conditions']} />

          <div>
            <h3 className="text-[17px] font-semibold uppercase tracking-[0.01em] text-white">Swisswrist</h3>
            <p className="mt-4 text-[14px] leading-[1.45] text-[#9f9f9f]">
              Crafting timeless elegance for
              <br />
              modern wrists.
            </p>
            <p className="mt-4 text-[14px] leading-[1.5] text-[#9f9f9f]">
              2 Bergrivier Boulevard South, Paarl,
              <br />
              Western Cape, South Africa, 7646
            </p>
            <p className="mt-3 text-[14px] text-[#c3c3c3]">info@swisswrist.com</p>
            <p className="mt-2 text-[14px] text-[#c3c3c3]">+91 9998887770</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[#1d2023] pt-5 sm:flex-row">
          <p className="text-[14px] text-[#b0b0b0]">© 2026 swisswrist. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#" aria-label="Instagram" className="text-[#e1306c] transition hover:opacity-80">
              <InstagramIcon />
            </a>
            <a href="#" aria-label="Facebook" className="text-[#1877f2] transition hover:opacity-80">
              <CircleIcon bg="currentColor" letter="f" />
            </a>
            <a href="#" aria-label="YouTube" className="text-[#ff0000] transition hover:opacity-80">
              <YouTubeIcon />
            </a>
            <a href="#" aria-label="Twitter" className="text-[#1d9bf0] transition hover:opacity-80">
              <CircleIcon bg="currentColor" letter="t" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-[17px] font-semibold uppercase tracking-[0.01em] text-white">{title}</h3>
      <ul className="mt-4 space-y-3 text-[14px] leading-none text-[#a9a9a9]">
        {items.map((item) => (
          <li key={item}>
            <a href="#" className="transition hover:text-white">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CircleIcon({ bg, letter }: { bg: string; letter: string }) {
  return (
    <span
      className="flex h-7 w-7 items-center justify-center rounded-full text-[15px] font-bold leading-none text-white"
      style={{ background: bg }}
      aria-hidden
    >
      {letter}
    </span>
  )
}

function YouTubeIcon() {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff0000]" aria-hidden>
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
        <path d="M9 8l7 4-7 4V8z" />
      </svg>
    </span>
  )
}

function InstagramIcon() {
  return (
    <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#0b0b0b]" aria-hidden>
      <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_120deg,#f9ce34,#ee2a7b,#6228d7,#f9ce34)]" />
      <span className="absolute inset-[2px] rounded-full bg-[#050607]" />
      <svg viewBox="0 0 24 24" className="relative z-[1] h-3.5 w-3.5 stroke-white" fill="none" strokeWidth="2">
        <rect x="4.5" y="4.5" width="15" height="15" rx="4" />
        <circle cx="12" cy="12" r="3.4" />
        <circle cx="17.3" cy="6.7" r="0.9" fill="white" stroke="none" />
      </svg>
    </span>
  )
}
