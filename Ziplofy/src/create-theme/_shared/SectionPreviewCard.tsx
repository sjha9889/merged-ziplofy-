import React from 'react';
import { PreviewShell } from './PreviewShell';

type Props = {
  label: string;
  variant?: string;
};

/** Create-theme section thumbnail (variant-specific art can replace this per element). */
export function SectionPreviewCard({ label, variant = 'text-block' }: Props) {
  if (variant === 'announcement-bar') {
    return (
      <PreviewShell className="bg-gray-900 py-3 text-center">
        <p className="text-[0.55rem] font-medium text-white">Announcement</p>
      </PreviewShell>
    );
  }
  if (variant === 'header') {
    return (
      <div className="mx-auto w-full max-w-[420px] rounded-lg border-2 border-[#4a8fe8] bg-[#f3f3f3] px-3 py-2">
        <p className="text-[0.55rem] font-bold text-gray-900">My Store</p>
      </div>
    );
  }
  if (variant === 'divider') {
    return (
      <div className="mx-auto flex h-[140px] w-full max-w-[420px] items-center justify-center bg-[#e8e8e8]">
        <div className="h-2 w-[90%] bg-white" role="presentation" />
      </div>
    );
  }
  if (variant === 'policies-links' || variant === 'footer-section') {
    return (
      <PreviewShell className="flex items-center justify-between gap-4 bg-[#f6f6f7]">
        <span className="text-[0.5rem] text-gray-600">© Store</span>
        <span className="text-[0.5rem] text-gray-700">Policies</span>
      </PreviewShell>
    );
  }
  return (
    <PreviewShell className="flex min-h-[72px] flex-col justify-center bg-white">
      <p className="text-[0.7rem] font-semibold text-gray-900">{label}</p>
      {variant !== 'text-block' ? (
        <p className="mt-1 text-[0.5rem] text-gray-500">{variant}</p>
      ) : null}
    </PreviewShell>
  );
}
