import React from 'react';

/** Flat landscape scene (mountains, lake, boat) — Shopify hero add-section art. */
export function HeroLandscapeIllustration() {
  return (
    <>
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#ebe6dc] via-[#e0d9ce] to-[#c5d4b8]"
        aria-hidden
      />
      <div
        className="absolute left-1/2 top-[9%] h-11 w-11 -translate-x-1/2 rounded-full bg-white shadow-sm"
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[48%] bg-[#5f9468]/88"
        style={{
          clipPath:
            'polygon(0% 100%, 0% 50%, 18% 58%, 38% 38%, 58% 52%, 78% 32%, 100% 48%, 100% 100%)',
        }}
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[32%] bg-[#4a7d56]/92"
        style={{
          clipPath: 'polygon(0% 100%, 12% 62%, 35% 72%, 55% 55%, 78% 68%, 100% 58%, 100% 100%)',
        }}
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-1/2 flex h-[58%] w-[42%] -translate-x-[8%] justify-center"
        aria-hidden
      >
        <div className="relative h-full w-full">
          <div className="absolute left-1/2 top-[4%] h-[20%] w-[36%] -translate-x-1/2 rounded-full bg-[#e8c4a8]" />
          <div className="absolute left-1/2 top-[18%] h-[22%] w-[50%] -translate-x-1/2 rounded-t-md bg-white" />
          <div className="absolute left-1/2 top-[24%] h-[76%] w-[94%] -translate-x-1/2 overflow-hidden rounded-t-[26%] bg-[#4a7fc4]">
            <div className="absolute left-[9%] top-0 h-full w-[13%] bg-[#3a6dad]" />
            <div className="absolute right-[9%] top-0 h-full w-[13%] bg-[#3a6dad]" />
          </div>
        </div>
      </div>
    </>
  );
}

type FrameProps = {
  children: React.ReactNode;
  size?: 'modal' | 'compact';
};

export function HeroSceneFrame({ children, size = 'modal' }: FrameProps) {
  const maxW = size === 'modal' ? 'max-w-[540px]' : 'max-w-[400px]';
  return (
    <div
      className={`relative mx-auto w-full ${maxW} overflow-hidden rounded-xl border-2 border-white shadow-[0_8px_28px_rgba(0,0,0,0.14)] ring-1 ring-black/[0.06]`}
    >
      <div className="relative aspect-[4/3] w-full bg-[#ddd6c8]">
        <HeroLandscapeIllustration />
        {children}
      </div>
    </div>
  );
}

/** Default Hero section preview — centered copy + Shop now CTA. */
export function HeroDefaultPreviewArt({ size = 'modal' }: { size?: 'modal' | 'compact' }) {
  const titleCls =
    size === 'modal'
      ? 'text-[1.75rem] font-bold leading-tight tracking-tight text-white drop-shadow-md'
      : 'text-[1.1rem] font-bold leading-tight tracking-tight text-white drop-shadow-sm';
  const bodyCls =
    size === 'modal'
      ? 'mt-3 max-w-[22rem] text-[0.95rem] leading-snug text-white drop-shadow-sm'
      : 'mt-2 max-w-[14rem] text-[0.65rem] leading-snug text-white/95';
  const btnCls =
    size === 'modal'
      ? 'mt-6 inline-flex rounded-md bg-white px-6 py-2.5 text-sm font-medium text-gray-900 shadow-md'
      : 'mt-4 inline-flex rounded-md bg-white px-4 py-1.5 text-[0.65rem] font-medium text-gray-900 shadow-sm';

  return (
    <HeroSceneFrame size={size}>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
        <h3 className={titleCls}>New arrivals</h3>
        <p className={bodyCls}>Made with care and unconditionally loved by our customers.</p>
        <span className={btnCls}>Shop now</span>
      </div>
    </HeroSceneFrame>
  );
}
