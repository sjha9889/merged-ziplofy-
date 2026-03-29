// Re-run AOS and theme scripts on SPA route changes
const anyWindow = window as unknown as { AOS?: { init: () => void; refreshHard?: () => void } };

export function reinitThemeRuntime() {
  try {
    anyWindow.AOS?.init?.();
    anyWindow.AOS?.refreshHard?.();
  } catch {
    // ignore
  }
}
