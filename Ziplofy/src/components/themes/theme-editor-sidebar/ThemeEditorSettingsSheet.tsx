import type { ReactNode } from 'react';

type ThemeEditorSettingsSheetProps = {
  children: ReactNode;
};

/** Bottom settings panel — opacity-only entrance (no height animation / scroll jitter). */
export function ThemeEditorSettingsSheet({ children }: ThemeEditorSettingsSheetProps) {
  return (
    <div className="theme-editor-settings-sheet absolute inset-x-0 bottom-0 z-10 flex max-h-[min(58vh,420px)] min-h-[180px] flex-col overflow-hidden border-t border-[#e1e1e1] bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
      {children}
    </div>
  );
}
