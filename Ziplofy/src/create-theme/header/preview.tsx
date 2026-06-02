import React from 'react';

function HeaderPreviewArt() {
  const iconCls = 'h-4 w-4 text-gray-700';
  return (
    <div className="mx-auto w-full max-w-[520px] px-4">
      <div className="relative overflow-hidden rounded-xl border-2 border-[#4a8fe8] bg-[#f3f3f3] shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
        <div className="absolute left-0 top-0 flex items-center gap-1 rounded-br-lg bg-[#4a8fe8] px-2.5 py-1 text-[10px] font-semibold text-white">
          <svg className="h-3 w-3 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden>
            <rect x="2" y="2" width="5" height="5" rx="0.5" fill="currentColor" opacity="0.9" />
            <rect x="9" y="2" width="5" height="5" rx="0.5" fill="currentColor" opacity="0.9" />
            <rect x="2" y="9" width="5" height="5" rx="0.5" fill="currentColor" opacity="0.9" />
            <rect x="9" y="9" width="5" height="5" rx="0.5" fill="currentColor" opacity="0.9" />
          </svg>
          Header
        </div>
        <div className="flex items-center justify-between gap-2 px-3 pb-3 pt-8 sm:gap-3 sm:px-4 sm:pb-3.5">
          <span className="shrink-0 text-xs font-bold tracking-tight text-gray-900 sm:text-sm">My Store</span>
          <nav className="flex min-w-0 flex-1 items-center justify-center gap-2 sm:gap-4" aria-hidden>
            <span className="text-[10px] font-medium text-gray-600 sm:text-[11px]">Home</span>
            <span className="text-[10px] font-medium text-gray-600 sm:text-[11px]">Catalog</span>
            <span className="text-[10px] font-medium text-gray-600 sm:text-[11px]">Contact</span>
          </nav>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
            <svg className={iconCls} viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.75" />
              <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
            <svg className={iconCls} viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.75" />
              <path
                d="M6 19c0-3.3 2.7-6 6-6s6 2.7 6 6"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
            <svg className={iconCls} viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M8 8V6a4 4 0 118 0v2"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
              <path
                d="M6 8h12l-1 12H7L6 8z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeaderPreview() {
  return <HeaderPreviewArt />;
}

export { HeaderPreviewArt };
