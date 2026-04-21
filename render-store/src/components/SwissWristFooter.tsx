import { Link } from 'react-router-dom';

type Props = {
  storeName: string;
};

export function SwissWristFooter({ storeName }: Props) {
  return (
    <footer className="bg-[#050607] text-[#b8b8b8]">
      <div className="mx-auto max-w-[1472px] px-10 pb-6 pt-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-14">
          <FooterCol
            title="Watches"
            items={['New Release', 'Best Sellers', "Men's Watches", "Women's Watches", 'Accessories', 'Shop All Watches']}
          />
          <FooterCol title="The story" items={['Our Philosophies', 'Ambassadors & Partners', 'Our Town', 'The Journal', 'Careers']} />
          <FooterCol
            title="Yours Swisswrist"
            items={['My Club Swisswrist', 'FAQs', 'Servicing & Repairs', 'Delivery & Returns', 'Privacy Policy', 'Terms and Conditions']}
          />

          <div>
            <h3 className="text-[17px] font-semibold uppercase leading-none tracking-[0.01em] text-white">
              {storeName}
            </h3>
            <p className="mt-5 text-[14px] leading-[1.4] text-[#9f9f9f]">
              Crafting timeless elegance for
              <br />
              modern wrists.
            </p>
            <p className="mt-5 text-[14px] leading-[1.45] text-[#9f9f9f]">
              2 Bergrivier Boulevard South, Paarl,
              <br />
              Western Cape, South Africa, 7646
            </p>
            <p className="mt-4 text-[14px] text-[#c3c3c3]">info@swisswrist.com</p>
            <p className="mt-2 text-[14px] text-[#c3c3c3]">+91 9998887770</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-[#1d2023] pt-8 sm:flex-row">
          <p className="text-[14px] text-[#d0d0d0]">
            © {new Date().getFullYear()} swisswrist. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
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
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-[17px] font-semibold uppercase leading-none tracking-[0.01em] text-white">
        {title}
      </h3>
      <ul className="mt-5 space-y-4 text-[14px] leading-none text-[#a9a9a9]">
        {items.map((item) => (
          <li key={item}>
            <Link to="#" className="transition hover:text-white">
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CircleIcon({ bg, letter }: { bg: string; letter: string }) {
  return (
    <span
      className="flex h-8 w-8 items-center justify-center rounded-full text-[16px] font-bold leading-none text-white"
      style={{ background: bg }}
      aria-hidden
    >
      {letter}
    </span>
  );
}

function YouTubeIcon() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff0000]" aria-hidden>
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-white">
        <path d="M9 8l7 4-7 4V8z" />
      </svg>
    </span>
  );
}

function InstagramIcon() {
  return (
    <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#0b0b0b]" aria-hidden>
      <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_120deg,#f9ce34,#ee2a7b,#6228d7,#f9ce34)]" />
      <span className="absolute inset-[2px] rounded-full bg-[#050607]" />
      <svg viewBox="0 0 24 24" className="relative z-[1] h-4 w-4 stroke-white" fill="none" strokeWidth="2">
        <rect x="4.5" y="4.5" width="15" height="15" rx="4" />
        <circle cx="12" cy="12" r="3.4" />
        <circle cx="17.3" cy="6.7" r="0.9" fill="white" stroke="none" />
      </svg>
    </span>
  );
}
