import { createContext, useContext, useEffect, type ReactNode } from 'react';

export type ThemeConfig = Record<string, unknown>;

const ThemeConfigContext = createContext<ThemeConfig | null>(null);

declare global {
  interface Window {
    __ZIPLOFY_THEME_CONFIG__?: ThemeConfig;
  }
}

function applyThemeConfigCssVars(config: ThemeConfig | null): void {
  const root = document.documentElement;
  const colors = config?.colors as Record<string, string> | undefined;
  const typography = config?.typography as Record<string, string> | undefined;
  if (colors?.primary) root.style.setProperty('--ziplofy-primary', colors.primary);
  if (colors?.accent) root.style.setProperty('--ziplofy-accent', colors.accent);
  if (colors?.background) root.style.setProperty('--ziplofy-background', colors.background);
  if (typography?.fontFamily) root.style.setProperty('--ziplofy-font-family', typography.fontFamily);
}

export function ThemeConfigProvider({
  config,
  children,
}: {
  config: ThemeConfig | null;
  children: ReactNode;
}) {
  useEffect(() => {
    if (config && typeof config === 'object') {
      window.__ZIPLOFY_THEME_CONFIG__ = config;
    } else {
      delete window.__ZIPLOFY_THEME_CONFIG__;
    }
    applyThemeConfigCssVars(config);
    window.dispatchEvent(
      new CustomEvent('ziplofy-theme-config-changed', { detail: config ?? null })
    );
  }, [config]);

  return (
    <ThemeConfigContext.Provider value={config}>{children}</ThemeConfigContext.Provider>
  );
}

export function useThemeConfig(): ThemeConfig | null {
  return useContext(ThemeConfigContext);
}

/** Read nested config path, e.g. getConfigValue(config, 'hero.title') */
export function getThemeConfigValue(config: ThemeConfig | null, dotPath: string): unknown {
  if (!config) return undefined;
  const parts = dotPath.split('.');
  let cur: unknown = config;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}
