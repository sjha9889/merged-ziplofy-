import { useEffect, useState, type SVGProps } from 'react';
import { Link, NavLink } from 'react-router-dom';

type HeaderUser = {
  firstName?: string;
  lastName?: string;
} | null;

type SwissWristHeaderProps = {
  storeName: string;
  user: HeaderUser;
  totalItems: number;
  onOpenCart: () => void;
  onLogout: () => void;
};

export function SwissWristHeader({
  storeName,
  user,
  totalItems,
  onOpenCart,
  onLogout,
}: SwissWristHeaderProps) {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onDocClick = () => setMenuOpen(false);
    if (menuOpen) document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [menuOpen]);

  const headerSurface = 'border-b border-neutral-900 bg-black';
  const positionClass = 'sticky top-0 z-50';
  const mobilePanelClass = 'border-b border-neutral-800 bg-black md:border-0 md:bg-transparent';

  return (
    <header className={`${positionClass} ${headerSurface} transition-colors duration-300`}>
      <div className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:h-[76px] lg:px-10">
        <Link
          to="/"
          className="z-20 flex shrink-0 items-center gap-2 sm:gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="max-w-[200px] truncate text-lg font-semibold tracking-tight text-white sm:max-w-xs sm:text-xl">
            {storeName}
          </span>
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
          <NavLink to="/products" className="whitespace-nowrap py-3 text-center text-[15px] font-medium text-white transition hover:text-white/80 md:py-0">
            Products
          </NavLink>
          <NavLink to="/collection" className="whitespace-nowrap py-3 text-center text-[15px] font-medium text-white transition hover:text-white/80 md:py-0">
            Collection
          </NavLink>
          <NavLink to="/blog" className="whitespace-nowrap py-3 text-center text-[15px] font-medium text-white transition hover:text-white/80 md:py-0">
            Blog
          </NavLink>
          <NavLink to="/contact" className="whitespace-nowrap py-3 text-center text-[15px] font-medium text-white transition hover:text-white/80 md:py-0">
            Contact
          </NavLink>
          <NavLink to="/wishlist" className="whitespace-nowrap py-3 text-center text-[15px] font-medium text-white transition hover:text-white/80 md:py-0">
            Wishlist
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
