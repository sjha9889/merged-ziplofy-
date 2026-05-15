import React, { useCallback, useEffect, useRef, useState } from 'react';

const EDITOR_SOURCE = 'ziplofy-theme-editor';
const FRAME_SOURCE = 'ziplofy-theme-preview';

export type ThemePreviewPage = 'index' | 'product' | 'cart';

export type ThemeLivePreviewFrameProps = {
  storeId: string;
  storeName?: string;
  /** Live storefront URL for "View store" links only — never used as iframe src. */
  storefrontOrigin?: string | null;
  jsUrl: string | null | undefined;
  cssUrl?: string | null;
  config: Record<string, unknown>;
  page?: ThemePreviewPage;
  className?: string;
};

const DEFAULT_RENDER_STORE_PORT = '5180';

function readEnvOrigin(...keys: string[]): string | null {
  for (const key of keys) {
    const raw = import.meta.env[key] as string | undefined;
    if (typeof raw === 'string' && raw.trim()) {
      return raw.trim().replace(/\/$/, '');
    }
  }
  return null;
}

/**
 * Origin for the preview iframe (render-store `/theme-preview`).
 * Must NOT be a merchant store subdomain — those send X-Frame-Options: SAMEORIGIN.
 */
export function resolveThemePreviewOrigin(): string {
  const explicit = readEnvOrigin('VITE_RENDER_STORE_ORIGIN', 'VITE_THEME_PREVIEW_ORIGIN');
  if (explicit) return explicit;

  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;

    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.localhost')) {
      return `${protocol}//localhost:${DEFAULT_RENDER_STORE_PORT}`;
    }

    // Production admin on ziplofy.com → dedicated preview host (same render-store app, embeddable headers).
    if (hostname === 'admin.ziplofy.com' || hostname === 'dashboard.ziplofy.com') {
      return `${protocol}//preview.ziplofy.com`;
    }

    if (hostname.endsWith('.ziplofy.com')) {
      return `${protocol}//preview.ziplofy.com`;
    }
  }

  return `http://localhost:${DEFAULT_RENDER_STORE_PORT}`;
}

function buildPreviewSrc(): string {
  return `${resolveThemePreviewOrigin()}/theme-preview`;
}

export const ThemeLivePreviewFrame: React.FC<ThemeLivePreviewFrameProps> = ({
  storeId,
  storeName,
  storefrontOrigin: _storefrontOrigin,
  jsUrl,
  cssUrl,
  config,
  page = 'index',
  className = '',
}) => {
  const previewSrc = buildPreviewSrc();
  const previewOrigin = resolveThemePreviewOrigin();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const initSentRef = useRef(false);

  const postInit = useCallback(() => {
    const frame = iframeRef.current?.contentWindow;
    if (!frame || !jsUrl || !storeId) return;
    frame.postMessage(
      {
        source: EDITOR_SOURCE,
        type: 'ZIPLOFY_PREVIEW_INIT',
        payload: {
          storeId,
          storeName,
          jsUrl,
          cssUrl: cssUrl ?? null,
          config,
          page,
        },
      },
      '*'
    );
    initSentRef.current = true;
  }, [storeId, storeName, jsUrl, cssUrl, config, page]);

  const postConfig = useCallback(() => {
    const frame = iframeRef.current?.contentWindow;
    if (!frame || !initSentRef.current) return;
    frame.postMessage(
      {
        source: EDITOR_SOURCE,
        type: 'ZIPLOFY_PREVIEW_CONFIG',
        payload: { config },
      },
      '*'
    );
  }, [config]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data as { source?: string; type?: string; payload?: { message?: string } };
      if (data?.source !== FRAME_SOURCE) return;
      if (data.type === 'ZIPLOFY_PREVIEW_READY') {
        setReady(true);
        setLoadError(null);
        postInit();
      }
      if (data.type === 'ZIPLOFY_PREVIEW_LOADED') {
        setReady(true);
        setLoadError(null);
      }
      if (data.type === 'ZIPLOFY_PREVIEW_ERROR') {
        setLoadError(data.payload?.message ?? 'Preview failed to load');
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [postInit]);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => postConfig(), 120);
    return () => window.clearTimeout(timer);
  }, [ready, postConfig]);

  useEffect(() => {
    if (!ready) return;
    const frame = iframeRef.current?.contentWindow;
    if (!frame) return;
    frame.postMessage(
      { source: EDITOR_SOURCE, type: 'ZIPLOFY_PREVIEW_SET_PAGE', payload: { page } },
      '*'
    );
  }, [page, ready]);

  useEffect(() => {
    initSentRef.current = false;
    setReady(false);
  }, [jsUrl, storeId, previewSrc]);

  useEffect(() => {
    if (ready && jsUrl && storeId) {
      postInit();
    }
  }, [ready, jsUrl, storeId, postInit]);

  if (!jsUrl) {
    return (
      <div
        className={`flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500 ${className}`}
      >
        Upload and apply a theme with <code className="mx-1">theme.js</code> to enable live preview.
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border border-gray-200 bg-white ${className}`}>
      {!ready && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white/80 px-4 text-center text-sm text-gray-500">
          <span>Loading live preview…</span>
          <span className="text-xs text-gray-400">from {previewOrigin}</span>
        </div>
      )}
      {loadError && (
        <div className="absolute left-0 right-0 top-0 z-20 border-b border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {loadError}
        </div>
      )}
      <iframe
        ref={iframeRef}
        title="Theme live preview"
        src={previewSrc}
        className="block h-full min-h-[480px] w-full border-0 bg-white"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        onLoad={() => {
          window.setTimeout(() => postInit(), 50);
        }}
      />
    </div>
  );
};

export default ThemeLivePreviewFrame;
