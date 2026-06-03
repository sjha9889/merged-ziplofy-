import type { ThemePreviewPage } from '../create-theme/chrome/CreateThemeLivePreview';

/**
 * Map theme editor preview page id → template JSON key in theme config.
 * Manifest templates (index, product, cart, …) are reused; other storefront pages
 * each get their own template bucket so merchants can build them from scratch.
 */
export function previewPageToTemplateId(page: ThemePreviewPage): string {
  const p = page || 'index';
  if (p === 'index') return 'index';
  if (p === 'product') return 'product';
  if (p === 'cart') return 'cart';
  if (p === 'signup') return 'signup';
  if (p === 'forgot_password' || p === 'password') return 'forgot_password';
  if (p === 'profile') return 'profile';
  if (p === 'orders') return 'orders';
  if (p === 'preferences') return 'preferences';
  if (p === 'login' || p === 'checkout') return 'login';
  return p;
}

/** @deprecated Prefer previewPageToTemplateId — kept for existing imports. */
export function templateIdForPage(page: ThemePreviewPage): string {
  return previewPageToTemplateId(page);
}
