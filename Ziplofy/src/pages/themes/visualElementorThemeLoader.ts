/**
 * Visual Elementor – theme load flow.
 * From-scratch implementation matching BasicElementor loadThemeIntoEditor behavior.
 * Single entry point for loading theme content into the editor.
 */

import { stripGrapesJSCanvasCss, preprocessHtmlForSelectability, cleanupCssGradients } from './visualElementorThemeUtils';
import { runExpandAndConfigureSelectability } from './visualElementorEditorSetup';
import { scheduleThemeStyleInjection } from './visualElementorStyleInjection';

export interface LoadThemeContentOptions {
  /** HTML body content */
  html: string;
  /** CSS from inline <style> tags */
  css?: string;
  /** Fetched/external CSS combined (used when stylesheetUrls present) */
  inlineCssForStyleBlock?: string;
  /** External stylesheet URLs */
  stylesheetUrls?: string[];
  /** Base URL for resolving @import in CSS */
  baseUrl?: string;
  /** Fallback when html is empty */
  defaultContent?: string;
}

/**
 * Load theme content into the GrapesJS editor.
 * Matches BasicElementor: strip, preprocess, setComponents, expand+configure (100ms), inject styles.
 */
export function loadThemeContentIntoEditor(editor: any, options: LoadThemeContentOptions): void {
  const {
    html = '',
    css = '',
    inlineCssForStyleBlock,
    stylesheetUrls = [],
    baseUrl = '',
    defaultContent = '',
  } = options;

  const rawHtml = html || defaultContent;
  let processedHtml = stripGrapesJSCanvasCss(rawHtml);
  processedHtml = preprocessHtmlForSelectability(processedHtml);

  let cssContent = css;
  if (stylesheetUrls.length && inlineCssForStyleBlock) {
    cssContent = inlineCssForStyleBlock;
  }
  const hasCss = (cssContent && typeof cssContent === 'string' && cssContent.trim()) || stylesheetUrls.length > 0;
  if (hasCss && cssContent) {
    cssContent = cleanupCssGradients(cssContent);
  }
  const styleBlockContent = (stylesheetUrls.length && inlineCssForStyleBlock) ? inlineCssForStyleBlock : (cssContent || '');

  editor.setComponents(processedHtml || defaultContent);

  setTimeout(() => {
    try {
      runExpandAndConfigureSelectability(editor);
    } catch (e) {
      console.warn('Configure selectability:', e);
    }
  }, 100);

  scheduleThemeStyleInjection(editor, {
    styleBlockContent,
    stylesheetUrls,
    baseUrl,
  });
}
