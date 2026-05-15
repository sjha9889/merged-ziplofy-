import { useMemo, type ReactNode } from 'react';
import StorefrontContext, { type StorefrontContextType } from '@/contexts/store.context';
import { ThemeConfigProvider } from '@/contexts/theme-config.context';
import { StorefrontProductProvider } from '@/contexts/product.context';
import { PreviewCollectionsLoader } from './PreviewCollectionsLoader';
import { PreviewProductsLoader } from './PreviewProductsLoader';

type PreviewStorefrontProviderProps = {
  storeId: string;
  storeName?: string;
  themeConfig: Record<string, unknown> | null;
  jsUrl?: string | null;
  cssUrl?: string | null;
  children: ReactNode;
};

/**
 * Bootstraps the same `useStorefront()` context remote themes expect (via @render-store/sdk),
 * without subdomain / theme-runtime API resolution.
 */
export function PreviewStorefrontProvider({
  storeId,
  storeName = 'Preview store',
  themeConfig,
  jsUrl = null,
  cssUrl = null,
  children,
}: PreviewStorefrontProviderProps) {
  const value = useMemo((): StorefrontContextType => {
    return {
      isStoreFront: true,
      storeFrontChecked: true,
      storeFrontMeta: { storeId, name: storeName, description: 'Theme editor live preview' },
      activeThemeId: null,
      activeThemeName: null,
      activeThemeEntryHtmlUrl: null,
      activeThemeCssUrls: [],
      activeThemeJsUrls: [],
      activeThemeHtmlUrls: [],
      remoteThemeJsUrl: jsUrl,
      remoteThemeCssUrl: cssUrl,
      themeRuntimeBaseUrl: null,
      liquidThemeEnabled: false,
      liquidRenderPagePath: null,
      liquidTemplateNames: [],
      liquidTemplatesListProvided: false,
      activeReactThemePackId: null,
      reactThemePacks: [],
      themeConfig,
    };
  }, [storeId, storeName, themeConfig, jsUrl, cssUrl]);

  return (
    <StorefrontContext.Provider value={value}>
      <ThemeConfigProvider config={themeConfig}>
        <StorefrontProductProvider>
          <PreviewProductsLoader storeId={storeId} />
          <PreviewCollectionsLoader storeId={storeId} />
          {children}
        </StorefrontProductProvider>
      </ThemeConfigProvider>
    </StorefrontContext.Provider>
  );
}
