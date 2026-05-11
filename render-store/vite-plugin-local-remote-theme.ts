import fs from 'node:fs';
import path from 'node:path';
import type { Plugin, PreviewServer, ViteDevServer } from 'vite';

/**
 * Serves `remote-themes/gaming/dist/theme.js` at `/__remote_theme/theme.mjs` and rewrites bare
 * module specifiers to **in-app shim URLs** (`/src/themes/remote-runtime-shims/...`).
 *
 * Why: rewriting to `/@fs/.../node_modules/react-router-dom` makes transitive deps (e.g. `cookie`)
 * resolve to bare `/node_modules/...` URLs that the dev server does not serve. Shims are normal
 * project modules so Vite applies the usual dep pre-bundling / resolution.
 */
export function localRemoteThemePlugin(): Plugin {
  const themeDist = path.resolve(__dirname, '../remote-themes/gaming/dist');
  const themeJsPath = path.join(themeDist, 'theme.js');
  const themeCssPath = path.join(themeDist, 'theme.css');

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

  function mount(server: ViteDevServer | PreviewServer) {
    const middlewares = server.middlewares;

    middlewares.use((req, res, next) => {
      const url = req.url?.split('?')[0] ?? '';
      if (url === '/__remote_theme/theme.mjs' || url === '/__remote_theme/theme.mjs/') {
        if (!fs.existsSync(themeJsPath)) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end(
            '// Build the gaming theme first:\n// cd remote-themes/gaming && npm install && npm run build\n',
          );
          return;
        }
        const raw = fs.readFileSync(themeJsPath, 'utf8');
        const body = rewriteThemeSource(raw);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.end(body);
        return;
      }
      if (url === '/__remote_theme/theme.css' || url === '/__remote_theme/theme.css/') {
        if (!fs.existsSync(themeCssPath)) {
          res.statusCode = 404;
          res.end('');
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.end(fs.readFileSync(themeCssPath, 'utf8'));
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
