/** postMessage contract between Ziplofy theme editor (parent) and render-store preview iframe. */

export const PREVIEW_MESSAGE_SOURCE = 'ziplofy-theme-editor' as const;
export const PREVIEW_FRAME_SOURCE = 'ziplofy-theme-preview' as const;

export type ThemePreviewPage = 'index' | 'product' | 'cart';

export type ThemePreviewInitPayload = {
  storeId: string;
  storeName?: string;
  jsUrl: string;
  cssUrl?: string | null;
  config: Record<string, unknown>;
  page?: ThemePreviewPage;
};

export type ThemePreviewConfigPayload = {
  config: Record<string, unknown>;
};

export type ParentToPreviewMessage =
  | { source: typeof PREVIEW_MESSAGE_SOURCE; type: 'ZIPLOFY_PREVIEW_INIT'; payload: ThemePreviewInitPayload }
  | { source: typeof PREVIEW_MESSAGE_SOURCE; type: 'ZIPLOFY_PREVIEW_CONFIG'; payload: ThemePreviewConfigPayload }
  | { source: typeof PREVIEW_MESSAGE_SOURCE; type: 'ZIPLOFY_PREVIEW_SET_PAGE'; payload: { page: ThemePreviewPage } };

export type PreviewToParentMessage =
  | { source: typeof PREVIEW_FRAME_SOURCE; type: 'ZIPLOFY_PREVIEW_READY' }
  | { source: typeof PREVIEW_FRAME_SOURCE; type: 'ZIPLOFY_PREVIEW_LOADED' }
  | { source: typeof PREVIEW_FRAME_SOURCE; type: 'ZIPLOFY_PREVIEW_ERROR'; payload: { message: string } };

export function isParentPreviewMessage(data: unknown): data is ParentToPreviewMessage {
  if (!data || typeof data !== 'object') return false;
  const m = data as { source?: string; type?: string };
  return m.source === PREVIEW_MESSAGE_SOURCE && typeof m.type === 'string';
}

export function postToParent(message: PreviewToParentMessage, targetOrigin = '*'): void {
  if (typeof window === 'undefined' || window.parent === window) return;
  window.parent.postMessage(message, targetOrigin);
}
