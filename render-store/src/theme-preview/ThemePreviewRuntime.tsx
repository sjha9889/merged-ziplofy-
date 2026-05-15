import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { ThemeContract } from '@/themes/contract';
import { loadRemoteTheme } from '@/themes/loadRemoteTheme';
import { rewriteRemoteThemeImports } from '@/themes/rewriteRemoteThemeImports';
import { getStorefrontAssetOrigin } from '@/config/storefrontAssetOrigin';
import { postToParent } from './previewBridge';
import type { ThemePreviewPage } from './previewBridge';

type ThemePreviewRuntimeProps = {
  jsUrl: string;
  cssUrl?: string | null;
  page: ThemePreviewPage;
  /** Bumped when live editor config changes to force theme pages to re-read window config. */
  configRevision: number;
};

function resolveAssetUrl(href: string): string {
  const trimmed = href.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  const viteApi = import.meta.env.VITE_API_URL;
  const base = typeof viteApi === 'string' && viteApi.trim() !== '' ? viteApi.replace(/\/$/, '') : '';
  if (base) return `${base}${trimmed.startsWith('/') ? trimmed : `/${trimmed}`}`;
  return `${window.location.origin}${trimmed.startsWith('/') ? trimmed : `/${trimmed}`}`;
}

export function ThemePreviewRuntime({ jsUrl, cssUrl, page, configRevision }: ThemePreviewRuntimeProps) {
  const [contract, setContract] = useState<ThemeContract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  const revokeBlob = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  };

  const loadTheme = useCallback(async () => {
    setLoading(true);
    setError(null);
    revokeBlob();
    try {
      const url = resolveAssetUrl(jsUrl);
      const isCrossOrigin =
        typeof window !== 'undefined' &&
        (() => {
          try {
            return new URL(url, window.location.href).origin !== window.location.origin;
          } catch {
            return true;
          }
        })();
      const res = await fetch(url, {
        credentials: isCrossOrigin ? 'omit' : 'include',
        mode: 'cors',
      });
      if (!res.ok) throw new Error(`Failed to fetch theme.js (${res.status})`);
      const raw = await res.text();
      const body = rewriteRemoteThemeImports(raw, getStorefrontAssetOrigin());
      const blob = new Blob([body], { type: 'application/javascript' });
      const blobUrl = URL.createObjectURL(blob);
      blobUrlRef.current = blobUrl;
      const next = await loadRemoteTheme(blobUrl);
      setContract(next);
      postToParent({ source: 'ziplofy-theme-preview', type: 'ZIPLOFY_PREVIEW_LOADED' });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      postToParent({ source: 'ziplofy-theme-preview', type: 'ZIPLOFY_PREVIEW_ERROR', payload: { message: msg } });
    } finally {
      setLoading(false);
    }
  }, [jsUrl]);

  useEffect(() => {
    void loadTheme();
    return () => revokeBlob();
  }, [loadTheme]);

  const cssHref = useMemo(() => (cssUrl ? resolveAssetUrl(cssUrl) : ''), [cssUrl]);

  useEffect(() => {
    const linkId = 'ziplofy-preview-theme-css';
    document.getElementById(linkId)?.remove();
    if (!contract || !cssHref) return;
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = cssHref;
    document.head.appendChild(link);
    return () => link.remove();
  }, [contract, cssHref]);

  if (loading && !contract) {
    return (
      <div style={{ padding: 32, textAlign: 'center', fontFamily: 'system-ui, sans-serif', color: '#666' }}>
        Loading theme preview…
      </div>
    );
  }

  if (!contract) {
    return (
      <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
        <p style={{ color: '#b91c1c', marginTop: 0 }}>Preview failed</p>
        <pre style={{ fontSize: 12, background: '#fef2f2', padding: 12, overflow: 'auto' }}>{error}</pre>
        <button type="button" onClick={() => void loadTheme()} style={{ marginTop: 8 }}>
          Retry
        </button>
      </div>
    );
  }

  const revisionKey = `${page}-${configRevision}`;
  const Home = contract.HomePage;
  const Product = contract.ProductPage;
  const Cart = contract.CartPage;

  return (
    <MemoryRouter initialEntries={[page === 'product' ? '/products/preview' : page === 'cart' ? '/cart' : '/']}>
      <Routes>
        <Route path="/" element={<Home key={revisionKey} />} />
        <Route path="/products" element={<Home key={revisionKey} />} />
        <Route path="/products/:id" element={<Product key={revisionKey} />} />
        <Route path="/cart" element={<Cart key={revisionKey} />} />
        <Route path="*" element={<Home key={revisionKey} />} />
      </Routes>
    </MemoryRouter>
  );
}
