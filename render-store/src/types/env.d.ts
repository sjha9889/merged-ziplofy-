/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_AUTH_MICROSERVICE_FRONTEND_URL: string;
  /** Full URL to built theme ESM (default: same-origin `/__remote_theme/theme.mjs` in dev/preview). */
  readonly VITE_LOCAL_REMOTE_THEME_URL?: string;
  /** Full URL to theme CSS from the library build (default: `/__remote_theme/theme.css`). */
  readonly VITE_LOCAL_REMOTE_THEME_CSS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
