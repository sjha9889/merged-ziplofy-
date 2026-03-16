/**
 * Visual Elementor – theme style injection into the canvas iframe.
 * From-scratch implementation matching BasicElementor injectCSS:
 * - removal selector
 * - inject order: preserve-text-color, slider-fix, selection-override, theme-styles, link tags, @import
 * - retry schedule and editor.setStyle fallback
 */

import { PRESERVE_TEXT_COLOR_CSS, SELECTION_HIGHLIGHT_BASIC_CSS, SELECTION_OVERRIDE_CSS, SLIDER_FIX_CSS } from './visualElementorThemeUtils';

export interface InjectThemeStylesOptions {
  styleBlockContent: string;
  stylesheetUrls?: string[];
  baseUrl?: string;
}

const REMOVAL_SELECTOR = '#ziplofy-theme-styles, #ziplofy-preserve-text-color, #ziplofy-selection-highlight, #ziplofy-selection-override, #ziplofy-slider-fix, style[data-ziplofy-theme], link[data-ziplofy-theme]';

function doInject(editor: any, options: InjectThemeStylesOptions): boolean {
  const { styleBlockContent: cssContent = '', stylesheetUrls = [], baseUrl = '' } = options;
  try {
    const canvas = editor.Canvas;
    if (!canvas) return false;
    const frame = canvas.getFrameEl();
    if (!frame?.contentDocument) return false;
    const doc = frame.contentDocument;
    const head = doc.head || doc.getElementsByTagName('head')[0];
    if (!head) return false;

    head.querySelectorAll(REMOVAL_SELECTOR).forEach((el) => el.remove());

    const append = (id: string, text: string) => {
      const el = doc.createElement('style');
      el.id = id;
      el.setAttribute('data-ziplofy-theme', 'true');
      el.textContent = text;
      head.appendChild(el);
    };

    append('ziplofy-preserve-text-color', PRESERVE_TEXT_COLOR_CSS);
    append('ziplofy-selection-highlight', SELECTION_HIGHLIGHT_BASIC_CSS);
    append('ziplofy-selection-override', SELECTION_OVERRIDE_CSS);
    append('ziplofy-slider-fix', SLIDER_FIX_CSS);

    if (cssContent.trim()) {
      const styleEl = doc.createElement('style');
      styleEl.id = 'ziplofy-theme-styles';
      styleEl.setAttribute('data-ziplofy-theme', 'true');
      styleEl.textContent = cssContent;
      head.appendChild(styleEl);
    }

    stylesheetUrls.forEach((url) => {
      const link = doc.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.setAttribute('data-ziplofy-theme', 'true');
      link.crossOrigin = 'anonymous';
      head.appendChild(link);
    });

    if (cssContent) {
      const imports = cssContent.matchAll(/@import\s+(?:url\()?['"]?([^'")]+)['"]?\)?/gi);
      for (const m of imports) {
        let url = m[1];
        if (!url.startsWith('http') && !url.startsWith('//')) {
          if (url.startsWith('./') || url.startsWith('../')) {
            const parts = baseUrl.split('/').filter(Boolean);
            const path = url.split('/').filter(Boolean);
            for (const p of path) {
              if (p === '..') parts.pop();
              else if (p !== '.') parts.push(p);
            }
            url = parts.join('/');
            if (!url.startsWith('http')) url = baseUrl.replace(/\/[^/]*$/, '/') + url;
          } else {
            url = baseUrl + url;
          }
        }
        if (url && !Array.from(head.querySelectorAll('link[rel="stylesheet"]')).some((l: Element) => (l as HTMLAnchorElement).href === url || (l as HTMLAnchorElement).href?.endsWith?.(url))) {
          const link = doc.createElement('link');
          link.rel = 'stylesheet';
          link.href = url;
          link.setAttribute('data-ziplofy-theme', 'true');
          link.crossOrigin = 'anonymous';
          head.appendChild(link);
        }
      }
    }
    return true;
  } catch {
    return false;
  }
}

export function injectThemeStylesIntoFrame(editor: any, options: InjectThemeStylesOptions): boolean {
  return doInject(editor, options);
}

const RETRY_DELAYS_MS = [100, 300, 500, 800, 1200, 2000];
const MAX_RETRIES = 15;
const RETRY_INTERVAL_MS = 200;

export function scheduleThemeStyleInjection(editor: any, options: InjectThemeStylesOptions): void {
  const { styleBlockContent = '' } = options;
  let retries = 0;

  const tryInject = () => {
    if (doInject(editor, options)) return;
    retries++;
    if (retries < MAX_RETRIES) {
      setTimeout(tryInject, RETRY_INTERVAL_MS);
    } else if (styleBlockContent.trim()) {
      try {
        editor.setStyle(styleBlockContent);
      } catch {}
    }
  };

  RETRY_DELAYS_MS.forEach((d) => setTimeout(tryInject, d));
}
