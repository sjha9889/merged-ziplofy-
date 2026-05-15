import { useCallback, useEffect, useState } from 'react';
import { PreviewProviders } from './PreviewProviders';
import { PreviewErrorBoundary } from './PreviewErrorBoundary';
import { ThemePreviewRuntime } from './ThemePreviewRuntime';
import {
  isParentPreviewMessage,
  postToParent,
  type ThemePreviewInitPayload,
  type ThemePreviewPage,
} from './previewBridge';

export function ThemePreviewApp() {
  const [init, setInit] = useState<ThemePreviewInitPayload | null>(null);
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [page, setPage] = useState<ThemePreviewPage>('index');
  const [configRevision, setConfigRevision] = useState(0);

  const applyConfig = useCallback((next: Record<string, unknown>) => {
    setConfig(next);
    setConfigRevision((n) => n + 1);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add('ziplofy-theme-preview-root');
    document.body.style.margin = '0';
    document.body.style.background = 'transparent';

    let readyInterval: number | undefined;

    const onMessage = (event: MessageEvent) => {
      if (!isParentPreviewMessage(event.data)) return;
      const msg = event.data;
      if (msg.type === 'ZIPLOFY_PREVIEW_INIT') {
        if (readyInterval !== undefined) {
          window.clearInterval(readyInterval);
          readyInterval = undefined;
        }
        setInit(msg.payload);
        applyConfig(msg.payload.config);
        setPage(msg.payload.page ?? 'index');
      }
      if (msg.type === 'ZIPLOFY_PREVIEW_CONFIG') {
        applyConfig(msg.payload.config);
      }
      if (msg.type === 'ZIPLOFY_PREVIEW_SET_PAGE') {
        setPage(msg.payload.page);
        setConfigRevision((n) => n + 1);
      }
    };

    const signalReady = () =>
      postToParent({ source: 'ziplofy-theme-preview', type: 'ZIPLOFY_PREVIEW_READY' });

    window.addEventListener('message', onMessage);
    signalReady();
    readyInterval = window.setInterval(signalReady, 400);

    return () => {
      if (readyInterval !== undefined) window.clearInterval(readyInterval);
      window.removeEventListener('message', onMessage);
      document.documentElement.classList.remove('ziplofy-theme-preview-root');
    };
  }, [applyConfig]);

  if (!init || !config) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          color: '#78716c',
          fontSize: 14,
        }}
      >
        Waiting for theme editor…
      </div>
    );
  }

  return (
    <PreviewProviders
      storeId={init.storeId}
      storeName={init.storeName}
      themeConfig={config}
      jsUrl={init.jsUrl}
      cssUrl={init.cssUrl}
    >
      <PreviewErrorBoundary>
        <ThemePreviewRuntime
          jsUrl={init.jsUrl}
          cssUrl={init.cssUrl}
          page={page}
          configRevision={configRevision}
        />
      </PreviewErrorBoundary>
    </PreviewProviders>
  );
}
