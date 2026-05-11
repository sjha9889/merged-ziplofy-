# @ziplofy/theme-gaming

Independent **Vite library** build of the gaming storefront theme. This is **not** a standalone React app: it produces `dist/theme.js` (+ `dist/theme.css`) for future runtime loading inside **render-store**, which owns React, the router, providers, and `@render-store/sdk`.

## Build

From this directory:

```bash
npm install
npm run build
```

Outputs:

- `dist/theme.js` — ES module, default export = `ThemeContract` object
- `dist/theme.css` — theme stylesheet (minimal placeholder today)

Peer dependencies (`react`, `react-dom`, `react-router-dom`) are **not** bundled. The module id `@render-store/sdk` is also **external** (it is not published on npm; the host maps it to its public SDK entry, e.g. `render-store/src/sdk/index.ts`).

## Source layout

- `src/index.ts` — library entry: `import './theme.css'`, `export default gamingThemeContract`
- `src/gamingTheme.ts` — assembles the `ThemeContract` object
- `src/Gaming*.tsx` — page/section components (import hooks only from `@render-store/sdk`)

## render-store (local dynamic load)

After `npm run build` in this folder, **render-store** (dev or `vite preview`) serves the built bundle at:

- `http(s)://<host>/__remote_theme/theme.mjs` — ESM with imports rewritten so React, `react-router-dom`, and `@render-store/sdk` resolve from the host Vite app.
- `http(s)://<host>/__remote_theme/theme.css` — optional stylesheet from the library build.

The app uses `import()` on that URL and renders the default-exported `ThemeContract` inside existing providers. Override URLs with `VITE_LOCAL_REMOTE_THEME_URL` / `VITE_LOCAL_REMOTE_THEME_CSS_URL` if you host the files elsewhere (still local-only milestone; no CDN product).
