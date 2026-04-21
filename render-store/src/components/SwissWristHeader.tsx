import { useEffect, useState, type SVGProps } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logoMark from '../assets/img/logo (3).png';

type HeaderUser = {
  firstName?: string;
  lastName?: string;
} | null;

type SwissWristHeaderProps = {
  storeName: string;
  user: HeaderUser;
  totalItems: number;
  variant?: 'default' | 'hero';
  onOpenCart: () => void;
  onLogout: () => void;
};

export function SwissWristHeader({
  storeName,
  user,
  totalItems,
  variant = 'default',
  onOpenCart,
  onLogout,
}: SwissWristHeaderProps) {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (variant !== 'hero') return;
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [variant]);

  useEffect(() => {
    const onDocClick = () => setMenuOpen(false);
    if (menuOpen) document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [menuOpen]);

  const heroTransparent = variant === 'hero' && !scrolled && !open;
  const headerSurface = heroTransparent
    ? 'border-b border-white/20 bg-transparent'
    : 'border-b border-neutral-900 bg-black';
  const positionClass = variant === 'hero' ? 'fixed left-0 right-0 top-0 z-[60]' : 'sticky top-0 z-50';
  const mobilePanelClass = heroTransparent
    ? 'border-b border-white/15 bg-[#0b2114]/97 backdrop-blur-md md:border-0 md:bg-transparent md:backdrop-blur-none'
    : 'border-b border-neutral-800 bg-black md:border-0 md:bg-transparent';

  return (
    <header className={`${positionClass} ${headerSurface} transition-colors duration-300`}>
      <div className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:h-[76px] lg:px-10">
        <Link to="/" className="z-20 flex shrink-0 items-center gap-2 sm:gap-3" onClick={() => setOpen(false)}>
          {variant === 'hero' ? (
            <img src={logoMark} alt={storeName} className="h-12 w-auto object-contain sm:h-[56px]" width={210} height={56} />
          ) : (
            <>
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#f0d78c] via-[#c9a050] to-[#7a5c20] shadow-[inset_0_2px_4px_rgba(255,255,255,0.35)] ring-1 ring-black/20">
                <svg className="h-7 w-7 text-[#2a1a08]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 12V7M12 12l4 2.5" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
                </svg>
              </span>
              <span className="text-[11px] font-semibold uppercase leading-none tracking-[0.36em] text-white">
                {storeName}
              </span>
            </>
          )}
        </Link>

        <nav
          className={`no-scrollbar absolute left-0 right-0 top-full z-10 flex-col gap-0 px-4 py-4 shadow-xl ${mobilePanelClass} ${
            open ? 'flex' : 'hidden'
          } md:left-1/2 md:right-auto md:top-1/2 md:flex md:w-max md:-translate-x-1/2 md:-translate-y-1/2 md:flex-row md:items-center md:gap-10 md:px-0 md:py-0 md:shadow-none lg:gap-12`}
          aria-label="Primary"
        >
          <NavLink to="/" className="whitespace-nowrap py-3 text-center text-[15px] font-medium text-white transition hover:text-white/80 md:py-0" end>
            Home
          </NavLink>
          <NavLink to="/category" className="whitespace-nowrap py-3 text-center text-[15px] font-medium text-white transition hover:text-white/80 md:py-0">
            Product
          </NavLink>
          <NavLink to="/wishlist" className="whitespace-nowrap py-3 text-center text-[15px] font-medium text-white transition hover:text-white/80 md:py-0">
            Collection
          </NavLink>
          <NavLink to="/blog" className="whitespace-nowrap py-3 text-center text-[15px] font-medium text-white transition hover:text-white/80 md:py-0">
            Blog
          </NavLink>
        </nav>

        <div className="z-20 flex items-center gap-0.5 sm:gap-1">
          <button type="button" className="rounded-md p-2.5 text-white transition hover:bg-white/10" aria-label="Search">
            <SearchIcon className="h-[22px] w-[22px]" strokeWidth={1.5} />
          </button>

          {user ? (
            <div className="relative">
              <button
                type="button"
                className="rounded-md p-2.5 text-white transition hover:bg-white/10"
                aria-label="Account"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((v) => !v);
                }}
              >
                <UserIcon className="h-[22px] w-[22px]" strokeWidth={1.5} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 min-w-[160px] rounded-md bg-white p-2 text-sm text-black shadow-lg">
                  <Link className="block rounded px-2 py-1.5 hover:bg-neutral-100" to="/profile">
                    My Profile
                  </Link>
                  <Link className="block rounded px-2 py-1.5 hover:bg-neutral-100" to="/my-orders">
                    My Orders
                  </Link>
                  <button type="button" className="w-full rounded px-2 py-1.5 text-left hover:bg-neutral-100" onClick={onLogout}>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth/login" className="rounded-md p-2.5 text-white transition hover:bg-white/10" aria-label="Account">
              <UserIcon className="h-[22px] w-[22px]" strokeWidth={1.5} />
            </Link>
          )}

          <button
            type="button"
            className="relative rounded-md p-2.5 text-white transition hover:bg-white/10"
            aria-label="Cart"
            onClick={onOpenCart}
          >
            <BagIcon className="h-[22px] w-[22px]" strokeWidth={1.5} />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b8956c] px-1 text-[10px] font-bold text-white">
              {totalItems}
            </span>
          </button>
          <button type="button" className="rounded-md p-2 text-white md:hidden" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </header>
  );
}

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="9" r="3.5" />
      <path d="M5 20c1.5-4 5-6 7-6s5.5 2 7 6" strokeLinecap="round" />
    </svg>
  );
}

function BagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M6 7h12l-1 12H7L6 7z" strokeLinejoin="round" />
      <path d="M9 7V5a3 3 0 016 0v2" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
