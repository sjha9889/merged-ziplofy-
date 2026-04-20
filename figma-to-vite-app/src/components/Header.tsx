import { useState } from 'react'
import type { SVGProps } from 'react'

type HeaderProps = {
  logoSrc: string
}

const links = [
  { href: '#collections', label: 'Collections' },
  { href: '#rolex', label: 'Rolex' },
  { href: '#omega', label: 'Omega' },
  { href: '#hublot', label: 'Hublot' },
  { href: '#contact', label: 'Contact' },
]

export function Header({ logoSrc }: HeaderProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/90 bg-white/95 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <a href="#" className="flex shrink-0 items-center gap-2">
          <img
            src={logoSrc}
            alt="Boutique"
            className="h-9 w-auto object-contain sm:h-10"
          />
        </a>

        <nav
          className={`no-scrollbar absolute left-0 right-0 top-[72px] flex-col gap-0 border-b border-neutral-200 bg-white px-4 py-4 shadow-lg md:static md:flex md:flex-row md:items-center md:gap-8 md:border-0 md:bg-transparent md:p-0 md:shadow-none ${
            open ? 'flex' : 'hidden md:flex'
          }`}
          aria-label="Primary"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="border-b border-neutral-100 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-700 transition-colors hover:text-[#b8956c] md:border-0 md:py-0"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="hidden rounded-full border border-neutral-200/90 p-2.5 text-neutral-600 transition hover:border-[#b8956c]/50 hover:text-[#b8956c] sm:block"
            aria-label="Search"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="rounded-full border border-neutral-200/90 p-2.5 text-neutral-600 transition hover:border-[#b8956c]/50 hover:text-[#b8956c]"
            aria-label="Account"
          >
            <UserIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="relative rounded-full border border-neutral-200/90 p-2.5 text-neutral-600 transition hover:border-[#b8956c]/50 hover:text-[#b8956c]"
            aria-label="Cart"
          >
            <BagIcon className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b8956c] px-1 text-[10px] font-bold text-white">
              0
            </span>
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 md:hidden"
            aria-expanded={open}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  )
}

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" strokeLinecap="round" />
    </svg>
  )
}

function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <circle cx="12" cy="9" r="3.5" />
      <path d="M5 20c1.5-4 5-6 7-6s5.5 2 7 6" strokeLinecap="round" />
    </svg>
  )
}

function BagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M6 7h12l-1 12H7L6 7z" strokeLinejoin="round" />
      <path d="M9 7V5a3 3 0 016 0v2" strokeLinecap="round" />
    </svg>
  )
}

function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  )
}
