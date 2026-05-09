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

function clearAppliedThemeAssets() {
  document
    .querySelectorAll('[data-store-theme-asset="true"]')
    .forEach((node) => node.parentNode?.removeChild(node));
}

export function applyInstalledThemeAssets(cssUrls: string[], jsUrls: string[]) {
  if ((!cssUrls || cssUrls.length === 0) && (!jsUrls || jsUrls.length === 0)) return;

  clearAppliedThemeAssets();
  const cacheBuster = `v=${Date.now()}`;

  cssUrls.forEach((assetUrl) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = assetUrl.includes("?") ? `${assetUrl}&${cacheBuster}` : `${assetUrl}?${cacheBuster}`;
    link.dataset.storeThemeAsset = "true";
    link.onerror = () => {
      link.parentNode?.removeChild(link);
    };
    document.head.appendChild(link);
  });

  jsUrls.forEach((assetUrl) => {
    const script = document.createElement("script");
    script.src = assetUrl.includes("?") ? `${assetUrl}&${cacheBuster}` : `${assetUrl}?${cacheBuster}`;
    script.defer = true;
    script.dataset.storeThemeAsset = "true";
    script.onerror = () => {
      script.parentNode?.removeChild(script);
    };
    document.body.appendChild(script);
  });
}
