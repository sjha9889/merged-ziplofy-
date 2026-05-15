import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { StorefrontContextType } from '@/contexts/store.context';
import { ThemeConfigProvider } from '@/contexts/theme-config.context';
import { StorefrontProductProvider } from '@/contexts/product.context';
import { PreviewProductsLoader } from './PreviewProductsLoader';

const PreviewStorefrontContext = createContext<StorefrontContextType | null>(null);

type PreviewStorefrontProviderProps = {
  storeId: string;
  storeName?: string;
  themeConfig: Record<string, unknown> | null;
  children: ReactNode;
};

/** Minimal storefront context for iframe preview (no subdomain resolution). */
export function PreviewStorefrontProvider({
  storeId,
  storeName = 'Preview store',
  themeConfig,
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
      themeRuntimeBaseUrl: null,
      remoteThemeJsUrl: null,
      remoteThemeCssUrl: null,
      liquidThemeEnabled: false,
      liquidRenderPagePath: null,
      liquidTemplateNames: [],
      liquidTemplatesListProvided: false,
      activeReactThemePackId: null,
      reactThemePacks: [],
      themeConfig,
    };
  }, [storeId, storeName, themeConfig]);

  return (
    <PreviewStorefrontContext.Provider value={value}>
      <ThemeConfigProvider config={themeConfig}>
        <StorefrontProductProvider>
          <PreviewProductsLoader storeId={storeId} />
          {children}
        </StorefrontProductProvider>
      </ThemeConfigProvider>
    </PreviewStorefrontContext.Provider>
  );
}

export function usePreviewStorefront(): StorefrontContextType {
  const ctx = useContext(PreviewStorefrontContext);
  if (!ctx) throw new Error('usePreviewStorefront must be used within PreviewStorefrontProvider');
  return ctx;
}
