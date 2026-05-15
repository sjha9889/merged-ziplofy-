import React, { useCallback, useEffect, useRef, useState } from 'react';

const EDITOR_SOURCE = 'ziplofy-theme-editor';
const FRAME_SOURCE = 'ziplofy-theme-preview';

export type ThemePreviewPage = 'index' | 'product' | 'cart';

export type ThemeLivePreviewFrameProps = {
  storeId: string;
  storeName?: string;
  /** Storefront base URL from subdomain API, e.g. http://developer-pgdp.localhost:5180 */
  storefrontOrigin?: string | null;
  jsUrl: string | null | undefined;
  cssUrl?: string | null;
  config: Record<string, unknown>;
  page?: ThemePreviewPage;
  className?: string;
};

const DEFAULT_RENDER_STORE_PORT = '5180';

function originFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.origin;
  } catch {
    return null;
  }
}

/** Resolve render-store origin — never fall back to admin (5173). */
function resolvePreviewOrigin(storefrontOrigin?: string | null): string {
  const fromEnv = import.meta.env.VITE_RENDER_STORE_ORIGIN as string | undefined;
  if (fromEnv?.trim()) return fromEnv.trim().replace(/\/$/, '');

  const fromStorefront = storefrontOrigin ? originFromUrl(storefrontOrigin) : null;
  if (fromStorefront) return fromStorefront;

  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    // Admin often runs on *.localhost:5173; render-store uses :5180 (see storeRenderMicroserviceUrlSuffix).
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.localhost')) {
      return `${protocol}//localhost:${DEFAULT_RENDER_STORE_PORT}`;
    }
    if (port === '5173') {
      return `${protocol}//${hostname.replace(/^admin\./, '')}:${DEFAULT_RENDER_STORE_PORT}`;
    }
  }

  return `http://localhost:${DEFAULT_RENDER_STORE_PORT}`;
}

function buildPreviewSrc(storefrontOrigin?: string | null): string {
  const origin = resolvePreviewOrigin(storefrontOrigin);
  return `${origin}/theme-preview`;
}

export const ThemeLivePreviewFrame: React.FC<ThemeLivePreviewFrameProps> = ({
  storeId,
  storeName,
  storefrontOrigin,
  jsUrl,
  cssUrl,
  config,
  page = 'index',
  className = '',
}) => {
  const previewSrc = buildPreviewSrc(storefrontOrigin);
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
  }, [jsUrl, storeId]);

  /** Re-send init when jsUrl arrives after the iframe already signaled ready. */
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
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 text-sm text-gray-500">
          Loading live preview…
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
      />
    </div>
  );
};

export default ThemeLivePreviewFrame;
