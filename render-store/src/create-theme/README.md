# create-theme (copied from Ziplofy)

Section catalog, presets, and registry — synced from `Ziplofy/src/create-theme`.

**Live storefront preview today:** when `appliedCustomThemeId` is set, render-store loads the saved
`themeConfig` JSON from the API and renders it with the **Horizon** bundle
(`/remote-themes/horizon/theme.js`), same as the admin theme creator preview.

Re-copy after element changes:

```bash
node scripts/copy-create-theme-to-render-store.mjs
```

Admin-only UI (not copied): `chrome/`, `sidebar/`, `shell/`, `CreateThemePage.tsx`.
