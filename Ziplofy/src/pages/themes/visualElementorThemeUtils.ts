/**
 * Visual Elementor – shared theme utilities.
 * From-scratch implementation matching BasicElementor behavior.
 * Used for theme loading and style handling in CustomThemeBuilder only.
 */

/** Preserve text/editing visuals – do NOT use color: inherit (StyleManager would never apply changes) */
export const PRESERVE_TEXT_COLOR_CSS = `
  .gjs-selected,
  .gjs-selected *,
  .gjs-comp-selected,
  .gjs-comp-selected *,
  .gjs-editing,
  .gjs-editing *,
  .gjs-hovered,
  .gjs-hovered *,
  [contenteditable="true"],
  [contenteditable="true"] *,
  [data-gjs-type="text"],
  [data-gjs-editable="true"] {
    -webkit-text-fill-color: inherit !important;
    caret-color: currentColor !important;
    background-color: transparent !important;
  }
`;

/** Blue selection outline and hover – match Basic Elementor exactly */
export const SELECTION_HIGHLIGHT_BASIC_CSS = `
  .gjs-comp-selected,
  .gjs-selected {
    outline: 2px solid #2563eb !important;
    outline-offset: 2px !important;
  }
  .gjs-comp-hover,
  .gjs-hovered {
    outline: 1px dashed #2563eb !important;
    outline-offset: 1px !important;
  }
`;

/** Force pointer-events: auto so nav, header, footer, links are clickable for selection (match Basic Elementor) */
export const SELECTION_OVERRIDE_CSS = `
  * { pointer-events: auto !important; }
  html, html *, body, body * { pointer-events: auto !important; }
  nav, nav *, header, header *, footer, footer * { pointer-events: auto !important; }
  .navbar, .navbar *, .navigation, .navigation *, .nav-bar, .nav-bar * { pointer-events: auto !important; }
  [class*="nav"], [class*="nav"] *, [class*="menu"], [class*="menu"] * { pointer-events: auto !important; }
  [role="navigation"], [role="navigation"] * { pointer-events: auto !important; }
  div, span, p, h1, h2, h3, h4, h5, h6, a, button, section, main, article, aside, ul, ol, li, figure, figcaption, label { pointer-events: auto !important; }
  [contenteditable="true"] { pointer-events: auto !important; user-select: text !important; cursor: text !important; -webkit-user-select: text !important; }
  [class*="product"], [class*="product"] *, [class*="card"], [class*="card"] *, [class*="featured"], [class*="featured"] *,
  [class*="grid"], [class*="grid"] *, [class*="swiper"], [class*="swiper"] *, [class*="carousel"], [class*="carousel"] *,
  [class*="hero"], [class*="hero"] *, [class*="section"], [class*="section"] *, [class*="container"], [class*="container"] *,
  [class*="overlay"], [class*="overlay"] *, [class*="wrapper"], [class*="wrapper"] * { pointer-events: auto !important; }
  [style*="min-height"], [style*="min-height"] * { pointer-events: auto !important; }
`;

/** Hide non-active slider slides in iframe (slider JS doesn't run) */
export const ANIMATION_KEYFRAMES_CSS = [
  '@keyframes fadeIn{from{opacity:0}to{opacity:1}}',
  '@keyframes fadeOut{from{opacity:1}to{opacity:0}}',
  '@keyframes slideInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}',
  '@keyframes slideInDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}',
  '@keyframes slideOutUp{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-20px)}}',
  '@keyframes slideOutDown{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(20px)}}',
  '@keyframes bounce{0%,20%,53%,100%{transform:translateZ(0)}40%,43%{transform:translate3d(0,-8px,0)}70%{transform:translate3d(0,-4px,0)}}',
  '@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}',
  '@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}',
  '@keyframes zoomIn{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}',
  '@keyframes zoomOut{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(0.5)}}',
].join('\n');

export const SLIDER_FIX_CSS = `
  .swiper-slide:not(:first-child),
  .slick-slide:not(:first-child),
  .carousel-item:not(:first-child):not(.active),
  .slide:not(:first-child):not(.active),
  .hero-slide:not(:first-child),
  .slideshow__slide:not(:first-child),
  .hero__slide:not(:first-child),
  .splide__slide:not(:first-child),
  [class*="swiper-wrapper"] > *:not(:first-child),
  [class*="slick-track"] > *:not(:first-child),
  .owl-item:not(:first-child) {
    display: none !important;
    visibility: hidden !important;
  }
`;

const SKIP_TAGS = ['script', 'style', 'link', 'meta', 'head', 'title', 'path', 'svg', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon'];
const CONTAINER_TAGS = ['div', 'section', 'main', 'article', 'header', 'footer', 'nav', 'aside', 'form', 'ul', 'ol', 'li', 'figure', 'figcaption'];
const TEXT_TAGS = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'a', 'label', 'li', 'td', 'th', 'button', 'strong', 'em', 'b', 'i', 'u', 'small', 'sub', 'sup', 'blockquote', 'cite', 'img'];

/** Strip GrapesJS canvas CSS erroneously embedded in theme HTML */
export function stripGrapesJSCanvasCss(html: string): string {
  if (!html || typeof html !== 'string') return html;
  let h = html;
  const firstTag = h.search(/<[a-zA-Z][a-zA-Z0-9]*[\s>]/);
  if (firstTag > 0) {
    const leading = h.substring(0, firstTag);
    if (/body\s*\{/.test(leading) && /\.gjs-(?:dashed|selected|highlightable|selected-parent|plh-image)/.test(leading)) {
      h = h.substring(firstTag);
    }
  }
  h = h.replace(/<(div|pre|code|span)[^>]*>([\s\S]*?)<\/\1>/gi, (match: string, _tag: string, content: string) => {
    const c = (content || '').trim();
    if (c.length > 80 && /body\s*\{/.test(c) && /\.gjs-(?:dashed|selected|highlightable|plh-image|grabbing)/.test(c)) return '';
    return match;
  });
  h = h.replace(/(?:^|>)\s*(body\s*\{[\s\S]*?\.gjs-dashed[\s\S]*\}\s*)(?=\s*<)/gi, '');
  return h;
}

/** Add data-gjs-selectable, data-gjs-droppable, data-gjs-editable so elements are selectable */
export function preprocessHtmlForSelectability(html: string): string {
  if (!html || typeof html !== 'string') return html;
  return html.replace(/<([a-z][a-z0-9]*)(\s[^>]*)?>/gi, (match: string, tagName: string, rest: string) => {
    const tag = (tagName || '').toLowerCase();
    if (SKIP_TAGS.includes(tag)) return match;
    const attrs = rest || '';
    if (attrs.includes('data-gjs-selectable')) return match;
    let toAdd = ` data-gjs-selectable="true"`;
    if (CONTAINER_TAGS.includes(tag)) toAdd += ` data-gjs-droppable="*"`;
    if (TEXT_TAGS.includes(tag) && !attrs.includes('data-gjs-editable')) toAdd += ` data-gjs-editable="true" data-gjs-type="text"`;
    return `<${tagName}${attrs}${toAdd}>`;
  });
}

/** Fix gradient values incorrectly wrapped in url() */
export function cleanupCssGradients(css: string): string {
  if (!css) return css;
  const extractBalancedParens = (str: string, start: number): string => {
    let depth = 0;
    for (let i = start; i < str.length; i++) {
      if (str[i] === '(') depth++;
      else if (str[i] === ')') {
        depth--;
        if (depth === 0) return str.substring(start, i + 1);
      }
    }
    return str.substring(start);
  };
  let out = css;
  const re = /url\(\s*(['"]?)\s*(linear-gradient|radial-gradient|conic-gradient|repeating-linear-gradient|repeating-radial-gradient|repeating-conic-gradient)/gi;
  let m;
  const repl: Array<{ s: number; e: number; r: string }> = [];
  while ((m = re.exec(css)) !== null) {
    const gradStart = m.index + m[0].length - (m[2]?.length || 0);
    const gradContent = extractBalancedParens(css, gradStart + (m[2]?.length || 0));
    const full = (m[2] || '') + gradContent;
    repl.push({ s: m.index, e: gradStart + full.length, r: full });
  }
  for (let i = repl.length - 1; i >= 0; i--) {
    const { s, e, r } = repl[i];
    out = out.substring(0, s) + r + out.substring(e);
  }
  out = out.replace(/url\(\s*(['"]?)\s*(none|initial|inherit|unset|revert|transparent)\s*\1\s*\)/gi, (_: string, __: string, kw: string) => kw);
  return out;
}

/** Detect content that is CSS instead of HTML (corrupted state) */
export function isContentCssNotHtml(content: string): boolean {
  if (!content || typeof content !== 'string') return false;
  const t = content.trim();
  if (/^(body|html|\*|\.|#|@|:root)\s*\{/i.test(t)) return true;
  if (t.includes('{') && t.includes('}') && /\.gjs-(dashed|selected|wrapper|no-select|plh-image|selected-parent)/i.test(t)) return true;
  if (t.includes('{') && t.includes('}') && /\[data-gjs-type\s*[=\]]/.test(t)) return true;
  const firstTag = t.search(/<[a-zA-Z][a-zA-Z0-9]*[\s>]/);
  if (firstTag > 100 && /body\s*\{/.test(t) && /\.gjs-|::-webkit-scrollbar/.test(t)) return true;
  return false;
}
