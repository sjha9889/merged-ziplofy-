/**
 * Rewrites bare imports in a built remote theme `theme.js` so it can run in the browser
 * when loaded from the API (same transforms the old Vite `localRemoteThemePlugin` applied).
 *
 * @param appOrigin — e.g. `window.location.origin` so imports work when the theme runs from a `blob:` module URL.
 */
export function rewriteRemoteThemeImports(source: string, appOrigin: string): string {
  const origin = appOrigin.replace(/\/$/, '');
  const jsx = `${origin}/src/themes/remote-runtime-shims/react-jsx-runtime.ts`;
  const react = `${origin}/src/themes/remote-runtime-shims/react.ts`;
  const rrd = `${origin}/src/themes/remote-runtime-shims/react-router-dom.ts`;
  const sdk = `${origin}/src/sdk/index.ts`;

  return source
    .replaceAll('from "react/jsx-runtime"', `from "${jsx}"`)
    .replaceAll('from "react-router-dom"', `from "${rrd}"`)
    .replaceAll('from "@render-store/sdk"', `from "${sdk}"`)
    .replaceAll('from "react"', `from "${react}"`);
}
