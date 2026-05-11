import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { ThemeContract } from './contract';
import { loadRemoteTheme } from './loadRemoteTheme';

export type RemoteThemeId = 'gaming' | 'beauty';

type LoadedThemeContextValue = {
  contract: ThemeContract;
  reload: () => Promise<void>;
  switchTheme: (id: RemoteThemeId) => void;
  switching: boolean;
};

const LoadedThemeContext = createContext<LoadedThemeContextValue | null>(null);

function themeModuleUrl(id: RemoteThemeId): string {
  const origin = window.location.origin;
  return id === 'beauty' ? `${origin}/__remote_theme/beauty.mjs` : `${origin}/__remote_theme/theme.mjs`;
}

function readStoredThemeId(): RemoteThemeId | null {
  try {
    const v = localStorage.getItem('ziplofyThemeId');
    if (v === 'gaming' || v === 'beauty') return v;
  } catch {
    /* ignore */
  }
  return null;
}

function normalizeToAbsoluteUrl(url: string): string {
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  const origin = window.location.origin;
  return `${origin}${trimmed.startsWith('/') ? trimmed : `/${trimmed}`}`;
}

function initialModuleUrl(): string {
  const stored = readStoredThemeId();
  if (stored) return themeModuleUrl(stored);
  const fromEnv = import.meta.env.VITE_LOCAL_REMOTE_THEME_URL;
  if (typeof fromEnv === 'string' && fromEnv.trim().length > 0) {
    return normalizeToAbsoluteUrl(fromEnv);
  }
  return themeModuleUrl('gaming');
}

function stylesheetHrefForContract(contract: ThemeContract): string {
  const fromEnv = import.meta.env.VITE_LOCAL_REMOTE_THEME_CSS_URL;
  if (typeof fromEnv === 'string' && fromEnv.trim().length > 0) {
    return normalizeToAbsoluteUrl(fromEnv);
  }
  const origin = window.location.origin;
  return contract.id === 'beauty' ? `${origin}/__remote_theme/beauty.css` : `${origin}/__remote_theme/theme.css`;
}

function ThemeSwitcherBar() {
  const ctx = useContext(LoadedThemeContext);
  const show =
    import.meta.env.DEV || String(import.meta.env.VITE_SHOW_THEME_SWITCHER ?? '').toLowerCase() === 'true';
  if (!ctx || !show) return null;

  const { contract, switchTheme, switching } = ctx;
  const active: RemoteThemeId = contract.id === 'beauty' ? 'beauty' : 'gaming';

  const btn = (id: RemoteThemeId, label: string) => {
    const on = active === id;
    return (
      <button
        type="button"
        disabled={switching || on}
        onClick={() => switchTheme(id)}
        style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.04em',
          padding: '8px 14px',
          borderRadius: 8,
          border: on ? '1px solid #111' : '1px solid #ddd',
          background: on ? '#111' : '#fff',
          color: on ? '#fff' : '#222',
          cursor: switching || on ? 'default' : 'pointer',
          opacity: switching && !on ? 0.55 : 1,
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div
      role="group"
      aria-label="Theme switcher"
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 12px',
        borderRadius: 12,
        background: 'rgba(255,255,255,0.92)',
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <span style={{ fontSize: 11, color: '#666', marginRight: 4, fontFamily: 'system-ui, sans-serif' }}>Theme</span>
      {btn('gaming', 'Gaming')}
      {btn('beauty', 'Beauty')}
      {switching ? (
        <span style={{ fontSize: 11, color: '#888', marginLeft: 4, fontFamily: 'system-ui, sans-serif' }}>Loading…</span>
      ) : null}
    </div>
  );
}

/**
 * Loads the remote theme bundle (local dev: `/__remote_theme/theme.mjs` or `beauty.mjs` from the Vite plugin).
 * Renders children only after a valid ThemeContract is available.
 */
export function RemoteThemeProvider({ children }: { children: ReactNode }) {
  const [moduleUrl, setModuleUrl] = useState(initialModuleUrl);
  const [contract, setContract] = useState<ThemeContract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const contractRef = useRef<ThemeContract | null>(null);

  useEffect(() => {
    contractRef.current = contract;
  }, [contract]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await loadRemoteTheme(moduleUrl);
      setContract(next);
      try {
        localStorage.setItem('ziplofyThemeId', next.id === 'beauty' ? 'beauty' : 'gaming');
      } catch {
        /* ignore */
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      const cur = contractRef.current;
      if (cur) {
        setModuleUrl(themeModuleUrl(cur.id === 'beauty' ? 'beauty' : 'gaming'));
      }
    } finally {
      setLoading(false);
    }
  }, [moduleUrl]);

  useEffect(() => {
    void load();
  }, [load]);

  const switchTheme = useCallback((id: RemoteThemeId) => {
    setModuleUrl(themeModuleUrl(id));
  }, []);

  const cssHref = useMemo(() => (contract ? stylesheetHrefForContract(contract) : ''), [contract]);

  useEffect(() => {
    const linkId = 'ziplofy-remote-theme-css';
    document.getElementById(linkId)?.remove();
    if (!contract || !cssHref) return;
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = cssHref;
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, [contract, cssHref]);

  useEffect(() => {
    if (!contract) return;
    document.documentElement.dataset.ziplofyTheme = contract.id;
    return () => {
      delete document.documentElement.dataset.ziplofyTheme;
    };
  }, [contract]);

  const providerValue = useMemo((): LoadedThemeContextValue | null => {
    if (!contract) return null;
    return { contract, reload: load, switchTheme, switching: loading };
  }, [contract, load, switchTheme, loading]);

  const blockingLoad = loading && !contract;

  if (blockingLoad) {
    return (
      <div style={{ padding: 48, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <p style={{ margin: 0 }}>Loading storefront theme…</p>
      </div>
    );
  }

  if (!providerValue) {
    return (
      <div style={{ padding: 24, maxWidth: 560, fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ fontSize: 18, marginTop: 0 }}>Theme load failed</h1>
        <p style={{ color: '#444' }}>Could not dynamically import the theme bundle.</p>
        <pre style={{ overflow: 'auto', background: '#f5f5f5', padding: 12, fontSize: 13 }}>{error?.message}</pre>
        <p style={{ color: '#666', fontSize: 14 }}>
          Build a theme bundle, then reload. Examples: <code>cd remote-themes/gaming && npm run build</code> or{' '}
          <code>cd remote-themes/beauty && npm run build</code>. Use <code>VITE_LOCAL_REMOTE_THEME_URL</code> for a custom module URL (e.g.{' '}
          <code>/__remote_theme/beauty.mjs</code>); optional <code>VITE_LOCAL_REMOTE_THEME_CSS_URL</code> overrides stylesheet detection.
        </p>
        <button type="button" onClick={() => void load()} style={{ marginTop: 12, padding: '8px 14px' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <LoadedThemeContext.Provider value={providerValue}>
      {children}
      <ThemeSwitcherBar />
    </LoadedThemeContext.Provider>
  );
}

export function useLoadedThemeContract(): ThemeContract {
  const ctx = useContext(LoadedThemeContext);
  if (!ctx) {
    throw new Error('useLoadedThemeContract must be used within RemoteThemeProvider');
  }
  return ctx.contract;
}

/** Switch theme at runtime (same origin `/__remote_theme/*.mjs` URLs). Only valid after the theme has loaded once. */
export function useRemoteThemeSwitcher(): Pick<LoadedThemeContextValue, 'switchTheme' | 'switching'> & { activeThemeId: RemoteThemeId } {
  const ctx = useContext(LoadedThemeContext);
  if (!ctx) {
    throw new Error('useRemoteThemeSwitcher must be used within RemoteThemeProvider after a successful theme load');
  }
  const activeThemeId: RemoteThemeId = ctx.contract.id === 'beauty' ? 'beauty' : 'gaming';
  return { switchTheme: ctx.switchTheme, switching: ctx.switching, activeThemeId };
}
