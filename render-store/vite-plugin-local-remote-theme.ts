import fs from 'node:fs';
import path from 'node:path';
import type { Plugin, PreviewServer, ViteDevServer } from 'vite';

type ThemeKey = 'gaming' | 'beauty';

const THEMES: Record<
  ThemeKey,
  { distDir: string; mjsPath: string; cssPath: string }
> = {
  gaming: {
    distDir: path.resolve(__dirname, '../remote-themes/gaming/dist'),
    mjsPath: '/__remote_theme/theme.mjs',
    cssPath: '/__remote_theme/theme.css',
  },
  beauty: {
    distDir: path.resolve(__dirname, '../remote-themes/beauty/dist'),
    mjsPath: '/__remote_theme/beauty.mjs',
    cssPath: '/__remote_theme/beauty.css',
  },
};

/**
 * Serves built remote theme ESM at `/__remote_theme/*.mjs` and rewrites bare module specifiers to
 * **in-app shim URLs** (`/src/themes/remote-runtime-shims/...`).
 *
 * Why: rewriting to `/@fs/.../node_modules/react-router-dom` makes transitive deps (e.g. `cookie`)
 * resolve to bare `/node_modules/...` URLs that the dev server does not serve. Shims are normal
 * project modules so Vite applies the usual dep pre-bundling / resolution.
 */
export function localRemoteThemePlugin(): Plugin {
  function rewriteThemeSource(source: string): string {
    const jsx = '/src/themes/remote-runtime-shims/react-jsx-runtime.ts';
    const react = '/src/themes/remote-runtime-shims/react.ts';
    const rrd = '/src/themes/remote-runtime-shims/react-router-dom.ts';
    const sdk = '/src/sdk/index.ts';

    return source
      .replaceAll('from "react/jsx-runtime"', `from "${jsx}"`)
      .replaceAll('from "react-router-dom"', `from "${rrd}"`)
      .replaceAll('from "@render-store/sdk"', `from "${sdk}"`)
      .replaceAll('from "react"', `from "${react}"`);
  }

  function serveThemeMjs(res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (b: string) => void }, theme: ThemeKey) {
    const themeJsPath = path.join(THEMES[theme].distDir, 'theme.js');
    if (!fs.existsSync(themeJsPath)) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      const hint =
        theme === 'gaming'
          ? '// cd remote-themes/gaming && npm install && npm run build\n'
          : '// cd remote-themes/beauty && npm install && npm run build\n';
      res.end(hint);
      return;
    }
    const raw = fs.readFileSync(themeJsPath, 'utf8');
    const body = rewriteThemeSource(raw);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(body);
  }

  function serveThemeCss(res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (b: string) => void }, theme: ThemeKey) {
    const themeCssPath = path.join(THEMES[theme].distDir, 'theme.css');
    if (!fs.existsSync(themeCssPath)) {
      res.statusCode = 404;
      res.end('');
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(fs.readFileSync(themeCssPath, 'utf8'));
  }

  function mount(server: ViteDevServer | PreviewServer) {
    const middlewares = server.middlewares;

    middlewares.use((req, res, next) => {
      const url = req.url?.split('?')[0] ?? '';
      const normalized = url.endsWith('/') ? url.slice(0, -1) : url;

      if (normalized === THEMES.gaming.mjsPath) {
        serveThemeMjs(res, 'gaming');
        return;
      }
      if (normalized === THEMES.gaming.cssPath) {
        serveThemeCss(res, 'gaming');
        return;
      }
      if (normalized === THEMES.beauty.mjsPath) {
        serveThemeMjs(res, 'beauty');
        return;
      }
      if (normalized === THEMES.beauty.cssPath) {
        serveThemeCss(res, 'beauty');
        return;
      }
      next();
    });
  }

  return {
    name: 'local-remote-theme',
    configureServer(server) {
      mount(server);
    },
    configurePreviewServer(server) {
      mount(server);
    },
  };
}
