import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ThemeContract } from './contract';
import { loadRemoteTheme } from './loadRemoteTheme';

type LoadedThemeContextValue = {
  contract: ThemeContract;
  reload: () => Promise<void>;
};

const LoadedThemeContext = createContext<LoadedThemeContextValue | null>(null);

function defaultThemeModuleUrl(): string {
  const fromEnv = import.meta.env.VITE_LOCAL_REMOTE_THEME_URL;
  if (typeof fromEnv === 'string' && fromEnv.length > 0) {
    return fromEnv;
  }
  return `${window.location.origin}/__remote_theme/theme.mjs`;
}

function defaultThemeCssUrl(): string {
  const fromEnv = import.meta.env.VITE_LOCAL_REMOTE_THEME_CSS_URL;
  if (typeof fromEnv === 'string' && fromEnv.length > 0) {
    return fromEnv;
  }
  return `${window.location.origin}/__remote_theme/theme.css`;
}

/**
 * Loads the remote theme bundle once (local dev: `/__remote_theme/theme.mjs` served by Vite plugin).
 * Renders children only after a valid ThemeContract is available.
 */
export function RemoteThemeProvider({ children }: { children: ReactNode }) {
  const [contract, setContract] = useState<ThemeContract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const moduleUrl = useMemo(() => defaultThemeModuleUrl(), []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await loadRemoteTheme(moduleUrl);
      setContract(next);
    } catch (e) {
      setContract(null);
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [moduleUrl]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!contract) return;
    const href = defaultThemeCssUrl();
    const id = 'ziplofy-remote-theme-css';
    const existing = document.getElementById(id);
    if (existing) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, [contract]);

  /** Must run every render — never place after conditional returns (Rules of Hooks). */
  const providerValue = useMemo((): LoadedThemeContextValue | null => {
    if (loading || !contract) return null;
    return { contract, reload: load };
  }, [loading, contract, load]);

  if (loading) {
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
          Build the gaming theme first: <code>cd remote-themes/gaming && npm run build</code>, then reload. Optional: set{' '}
          <code>VITE_LOCAL_REMOTE_THEME_URL</code> to a full URL if you host <code>theme.js</code> elsewhere.
        </p>
        <button type="button" onClick={() => void load()} style={{ marginTop: 12, padding: '8px 14px' }}>
          Retry
        </button>
      </div>
    );
  }

  return <LoadedThemeContext.Provider value={providerValue}>{children}</LoadedThemeContext.Provider>;
}

export function useLoadedThemeContract(): ThemeContract {
  const ctx = useContext(LoadedThemeContext);
  if (!ctx) {
    throw new Error('useLoadedThemeContract must be used within RemoteThemeProvider');
  }
  return ctx.contract;
}
