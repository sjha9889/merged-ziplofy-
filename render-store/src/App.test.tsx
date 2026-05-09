import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

vi.mock('./contexts/store.context', async (importOriginal) => {
  const mod = await importOriginal<typeof import('./contexts/store.context')>();
  const Ctx = mod.default;
  const { StorefrontProductProvider } = await import('./contexts/product.context');
  const mockValue = {
    isStoreFront: true,
    storeFrontChecked: true,
    storeFrontMeta: { storeId: 's1', name: 'Store', description: '' },
    activeThemeId: null,
    activeThemeName: null,
    activeThemeEntryHtmlUrl: null,
    activeThemeCssUrls: [],
    activeThemeJsUrls: [],
    activeThemeHtmlUrls: [],
    liquidThemeEnabled: false,
    liquidRenderPagePath: null,
    liquidTemplateNames: [],
    liquidTemplatesListProvided: false,
    themeRuntimeBaseUrl: null,
  };
  return {
    ...mod,
    StorefrontProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(Ctx.Provider, { value: mockValue },
        React.createElement(StorefrontProductProvider, null, children)),
  };
});

vi.mock('./pages/StorefrontApp', () => ({ default: () => <div data-testid="storefront-app">Storefront</div> }));

describe('App', () => {
  it('renders app when store is valid', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toBeTruthy();
    expect(screen.getByTestId('storefront-app')).toBeInTheDocument();
  });
});
