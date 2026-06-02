import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

const REMOTE_THEMES_ROOT = path.resolve(__dirname, '../../remote-themes');
const URL_PREFIX = '/remote-themes/';

/**
 * Dev/preview: serve theme bundles from `remote-themes/{id}/dist/` (monorepo source)
 * instead of copying into `public/remote-themes/`.
 */
export function serveMonorepoRemoteThemesPlugin(): Plugin {
  return {
    name: 'serve-monorepo-remote-themes',
    configureServer(server) {
      server.middlewares.use(createMiddleware());
    },
    configurePreviewServer(server) {
      server.middlewares.use(createMiddleware());
    },
  };
}

function createMiddleware() {
  return (req: { url?: string }, res: import('http').ServerResponse, next: () => void) => {
    const urlPath = (req.url ?? '').split('?')[0];
    if (!urlPath.startsWith(URL_PREFIX)) {
      next();
      return;
    }

    const rel = urlPath.slice(URL_PREFIX.length);
    const slash = rel.indexOf('/');
    if (slash <= 0) {
      next();
      return;
    }

    const themeId = rel.slice(0, slash);
    const assetPath = rel.slice(slash + 1);
    if (!themeId || !assetPath || assetPath.includes('..')) {
      next();
      return;
    }

    const filePath = path.join(REMOTE_THEMES_ROOT, themeId, 'dist', assetPath);
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      next();
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const types: Record<string, string> = {
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.map': 'application/json',
    };
    res.statusCode = 200;
    res.setHeader('Content-Type', types[ext] ?? 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache');
    fs.createReadStream(filePath).pipe(res);
  };
}
