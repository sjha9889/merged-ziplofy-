import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStorefront } from '../contexts/store.context';

/**
 * When `VITE_API_URL` is unset, the Vite dev server proxies `/api` — use same-origin URLs
 * so theme HTML fetches are not blocked by CORS (unlike cross-origin `fetch` to :5000).
 */
export function normalizeThemeResourceUrl(url: string): string {
  try {
    const u = new URL(url, window.location.origin);
    if (!u.pathname.startsWith('/api')) return url;
    const configured = import.meta.env.VITE_API_URL;
    if (typeof configured === 'string' && configured.trim() !== '') return url;
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    return url;
  }
}

const THEME_HEAD_MARK = 'data-ziplofy-theme-head';

function resolveAssetBase(
  themeRuntimeBaseUrl: string | null,
  cssUrls: string[],
  fetchUrl: string
): string {
  if (themeRuntimeBaseUrl && themeRuntimeBaseUrl.length > 0) {
    return themeRuntimeBaseUrl.endsWith('/') ? themeRuntimeBaseUrl : `${themeRuntimeBaseUrl}/`;
  }
  const css0 = cssUrls[0];
  if (css0) {
    try {
      return new URL('.', css0).href;
    } catch {
      /* ignore */
    }
  }
  try {
    const u = new URL(fetchUrl);
    u.search = '';
    u.hash = '';
    const path = u.pathname;
    const i = path.lastIndexOf('/');
    u.pathname = i >= 0 ? `${path.slice(0, i)}/` : '/';
    return u.href;
  } catch {
    return '';
  }
}

function absolutizeUrl(href: string, base: string): string {
  if (!href || !base) return href;
  if (/^(https?:|\/\/|mailto:|tel:|data:|#)/i.test(href)) return href;
  try {
    return new URL(href, base).href;
  } catch {
    return href;
  }
}

function injectHeadAssets(doc: Document, assetBase: string, injected: HTMLElement[]) {
  doc.head.querySelectorAll('link[rel="stylesheet"], link[rel="preconnect"], style').forEach((node) => {
    const el = node.cloneNode(true) as HTMLElement;
    if (el instanceof HTMLLinkElement) {
      const href = el.getAttribute('href');
      if (href) el.setAttribute('href', absolutizeUrl(href, assetBase));
    }
    el.setAttribute(THEME_HEAD_MARK, '1');
    document.head.appendChild(el);
    injected.push(el);
  });
  doc.head.querySelectorAll('script[src]').forEach((node) => {
    const old = node as HTMLScriptElement;
    const s = document.createElement('script');
    s.src = absolutizeUrl(old.getAttribute('src') || '', assetBase);
    if (old.async) s.async = true;
    if (old.defer) s.defer = true;
    s.setAttribute(THEME_HEAD_MARK, '1');
    document.head.appendChild(s);
    injected.push(s);
  });
}

function cleanupHeadAssets(injected: HTMLElement[]) {
  injected.forEach((el) => {
    try {
      el.remove();
    } catch {
      /* ignore */
    }
  });
  injected.length = 0;
}

export type LiquidThemePageProps = {
  candidates: string[];
  fallback: React.ReactNode;
  liquidTemplate?: string;
  liquidQuery?: Record<string, string | undefined>;
};

/**
 * Fetches server-rendered Liquid (or static theme HTML) and mounts it in the document.
 * Resolves relative theme assets using `themeRuntimeBaseUrl` from theme-runtime.
 */
export function LiquidThemePage({ candidates, fallback, liquidTemplate, liquidQuery }: LiquidThemePageProps) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headInjectedRef = useRef<HTMLElement[]>([]);

  const {
    activeThemeHtmlUrls,
    activeThemeCssUrls,
    themeRuntimeBaseUrl,
    liquidThemeEnabled,
    liquidRenderPagePath,
    liquidTemplateNames,
    liquidTemplatesListProvided,
  } = useStorefront();

  const themedPageUrl = useMemo(() => {
    const envApi = typeof import.meta.env.VITE_API_URL === 'string' ? import.meta.env.VITE_API_URL.trim() : '';
    const hasExplicitApi = envApi !== '';
    const apiRoot = hasExplicitApi ? envApi.replace(/\/$/, '') : '';
    const liquidAllowed =
      liquidTemplate && (!liquidTemplatesListProvided || liquidTemplateNames.includes(liquidTemplate));
    if (liquidThemeEnabled && liquidAllowed && liquidTemplate && liquidRenderPagePath) {
      const path = liquidRenderPagePath.startsWith('/') ? liquidRenderPagePath : `/${liquidRenderPagePath}`;
      const u = hasExplicitApi
        ? new URL(`${apiRoot}/api${path}`)
        : new URL(`/api${path}`, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
      u.searchParams.set('template', liquidTemplate);
      if (liquidQuery) {
        Object.entries(liquidQuery).forEach(([k, v]) => {
          if (v != null && v !== '') u.searchParams.set(k, v);
        });
      }
      u.searchParams.set('_v', String(Date.now()));
      return u.toString();
    }
    if (!activeThemeHtmlUrls?.length) return null;
    const lower = activeThemeHtmlUrls.map((url) => ({ url, lower: url.toLowerCase() }));
    const match = candidates
      .map((candidate) => candidate.toLowerCase())
      .map((candidate) => lower.find((entry) => entry.lower.endsWith(`/${candidate}`) || entry.lower.endsWith(candidate)))
      .find(Boolean);
    if (!match) return null;
    const cacheBuster = `v=${Date.now()}`;
    return match.url.includes('?') ? `${match.url}&${cacheBuster}` : `${match.url}?${cacheBuster}`;
  }, [
    activeThemeHtmlUrls,
    candidates,
    liquidThemeEnabled,
    liquidRenderPagePath,
    liquidTemplateNames,
    liquidTemplatesListProvided,
    liquidTemplate,
    liquidQuery,
  ]);

  const [phase, setPhase] = useState<'idle' | 'loading' | 'error' | 'ready'>('idle');

  useEffect(() => {
    if (!themedPageUrl) {
      setPhase('idle');
      return;
    }

    const ac = new AbortController();
    const headBuf = headInjectedRef.current;
    cleanupHeadAssets(headBuf);

    setPhase('loading');
    const fetchUrl = normalizeThemeResourceUrl(themedPageUrl);

    (async () => {
      try {
        const { data: html } = await axios.get<string>(fetchUrl, {
          responseType: 'text',
          transitional: { forcedJSONParsing: false },
          transformResponse: [(r) => r],
          withCredentials: true,
          signal: ac.signal,
          headers: { Accept: 'text/html,application/xhtml+xml,*/*' },
        });
        if (typeof html !== 'string') throw new Error('Invalid theme response');

        const parsed = new DOMParser().parseFromString(html, 'text/html');
        const assetBase = resolveAssetBase(
          themeRuntimeBaseUrl ? normalizeThemeResourceUrl(themeRuntimeBaseUrl) : null,
          activeThemeCssUrls.map(normalizeThemeResourceUrl),
          fetchUrl
        );

        injectHeadAssets(parsed, assetBase, headBuf);

        const titleEl = parsed.querySelector('title');
        const t = titleEl?.textContent?.trim();
        if (t) document.title = t;

        const mount = containerRef.current;
        if (!mount) {
          if (!ac.signal.aborted) setPhase('error');
          return;
        }

        mount.innerHTML = '';
        const bodyRoot = parsed.body.cloneNode(true) as HTMLElement;
        const scripts = Array.from(bodyRoot.querySelectorAll('script'));
        scripts.forEach((s) => s.remove());
        mount.innerHTML = bodyRoot.innerHTML;

        scripts.forEach((old) => {
          const s = document.createElement('script');
          Array.from(old.attributes).forEach((attr) => {
            if (attr.name === 'src' && attr.value) {
              s.setAttribute(attr.name, absolutizeUrl(attr.value, assetBase));
            } else {
              s.setAttribute(attr.name, attr.value);
            }
          });
          if (old.textContent && !old.getAttribute('src')) s.textContent = old.textContent;
          s.setAttribute(THEME_HEAD_MARK, '1');
          mount.appendChild(s);
        });

        if (!ac.signal.aborted) setPhase('ready');
      } catch (e) {
        if (axios.isCancel(e)) return;
        const err = e as Error & { name?: string };
        if (err?.name === 'CanceledError' || err?.name === 'AbortError') return;
        cleanupHeadAssets(headBuf);
        if (!ac.signal.aborted) setPhase('error');
      }
    })();

    return () => {
      ac.abort();
      cleanupHeadAssets(headBuf);
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [themedPageUrl, themeRuntimeBaseUrl, activeThemeCssUrls]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || phase !== 'ready') return;

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (!href || href.startsWith('#')) return;
      if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (href.startsWith('http://') || href.startsWith('https://')) {
        try {
          const u = new URL(href);
          if (u.origin === window.location.origin) {
            e.preventDefault();
            navigate(`${u.pathname}${u.search}${u.hash}`);
          }
        } catch {
          /* allow default */
        }
        return;
      }
      e.preventDefault();
      navigate(href.startsWith('/') ? href : `/${href}`);
    };

    el.addEventListener('click', onClick);
    return () => el.removeEventListener('click', onClick);
  }, [phase, navigate]);

  if (!themedPageUrl) return <>{fallback}</>;
  if (phase === 'error') return <>{fallback}</>;

  /* Keep mount node in the tree whenever we have a URL so the ref is set before the async HTML request completes. */
  return (
    <div className="relative min-h-screen w-full bg-white">
      {(phase === 'loading' || phase === 'idle') && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white text-neutral-500">
          Loading storefront…
        </div>
      )}
      <div ref={containerRef} className="ziplofy-liquid-theme min-h-screen w-full bg-white" />
    </div>
  );
}
