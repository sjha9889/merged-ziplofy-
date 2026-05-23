import type { ThemePreviewSelectionHint } from './previewBridge';

const TEXT_SELECTOR =
  'h1,h2,h3,h4,h5,h6,p,button,a,span,label,figcaption,li,strong,em';

const SECTION_SELECTOR =
  'section,header,footer,main,article,[data-section-id],[data-ziplofy-section]';

function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function clearAnnotations(root: ParentNode): void {
  root.querySelectorAll('[data-ziplofy-node]').forEach((el) => {
    // Keep precise markers from theme components (EditorField) — do not re-tag by fuzzy matchText.
    if (el.getAttribute('data-ziplofy-kind') === 'field') return;
    el.removeAttribute('data-ziplofy-node');
    el.removeAttribute('data-ziplofy-label');
    el.removeAttribute('data-ziplofy-kind');
  });
}

function tagElement(el: Element, hint: ThemePreviewSelectionHint): void {
  if (el.closest('[data-ziplofy-node]')) return;
  el.setAttribute('data-ziplofy-node', hint.nodeId);
  el.setAttribute('data-ziplofy-label', hint.label);
  el.setAttribute('data-ziplofy-kind', hint.kind);
}

function findBySectionId(sectionId: string): Element | null {
  const slug = sectionId.replace(/_/g, '-');
  const selectors = [
    `[data-ziplofy-section="${sectionId}"]`,
    `[data-section-id="${sectionId}"]`,
    `[id="${sectionId}"]`,
    `[id="${slug}"]`,
    `[class*="${sectionId}"]`,
    `[class*="${slug}"]`,
  ];
  for (const sel of selectors) {
    try {
      const el = document.querySelector(sel);
      if (el) return el;
    } catch {
      /* invalid selector */
    }
  }
  return null;
}

/** Stamp data-ziplofy-node attributes so hover/click selection can resolve sidebar nodes. */
export function annotatePreviewSelectionHints(
  hints: ThemePreviewSelectionHint[],
  options?: { incremental?: boolean }
): void {
  if (typeof document === 'undefined') return;
  if (!options?.incremental) {
    clearAnnotations(document);
  }

  const textHints = hints.filter((h) => h.matchText && h.matchText.trim().length >= 2);
  const sectionHints = hints.filter((h) => h.sectionId && h.kind === 'section');

  for (const hint of textHints) {
    const existing = document.querySelector(`[data-ziplofy-node="${CSS.escape(hint.nodeId)}"]`);
    if (existing) continue;

    const target = normalizeText(hint.matchText!);
    const nodes = document.querySelectorAll(TEXT_SELECTOR);
    let best: { el: Element; score: number } | null = null;

    for (const el of nodes) {
      if (el.closest('[data-ziplofy-node]')) continue;
      const content = normalizeText(el.textContent ?? '');
      if (!content) continue;

      const exact = content === target;
      const contains = target.length >= 4 && content.includes(target);
      if (!exact && !contains) continue;

      // Prefer the smallest matching element so parent <a> does not swallow logo + tagline.
      const score = exact ? content.length : content.length + 1000;
      if (!best || score < best.score) {
        best = { el, score };
      }
    }

    if (best) tagElement(best.el, hint);
  }

  for (const hint of sectionHints) {
    if (!hint.sectionId) continue;
    const root = findBySectionId(hint.sectionId);
    if (root && !root.hasAttribute('data-ziplofy-node')) {
      tagElement(root, hint);
    }
  }

  // Layout sections (announcement bar, header, footer, duplicates)
  for (const hint of hints.filter((h) => h.nodeId.startsWith('layout:'))) {
    if (hint.kind !== 'section') continue;
    const id = hint.nodeId.replace(/^layout:/, '').split(':')[0];
    const root =
      findBySectionId(id) ??
      (id === 'footer' ? document.querySelector('footer,[role="contentinfo"]') : null);
    if (root && !root.hasAttribute('data-ziplofy-node')) {
      tagElement(root, hint);
    }
  }
}

export function findEditableTargetFromPoint(x: number, y: number): HTMLElement | null {
  const stack = document.elementsFromPoint(x, y) as HTMLElement[];
  for (const el of stack) {
    if (el.id === 'ziplofy-preview-selection-root') continue;
    const marked = el.closest('[data-ziplofy-node]') as HTMLElement | null;
    if (marked) return marked;
    const semantic = el.closest(TEXT_SELECTOR) as HTMLElement | null;
    if (semantic && semantic !== document.body) return semantic;
    const section = el.closest(SECTION_SELECTOR) as HTMLElement | null;
    if (section && section !== document.body) return section;
  }
  return null;
}

export function resolveSelectionFromElement(
  el: HTMLElement,
  hints: ThemePreviewSelectionHint[]
): { nodeId: string; label: string; kind: ThemePreviewSelectionHint['kind'] } | null {
  const marked = el.closest('[data-ziplofy-node]') as HTMLElement | null;
  if (marked) {
    const nodeId = marked.getAttribute('data-ziplofy-node');
    if (nodeId) {
      return {
        nodeId,
        label: marked.getAttribute('data-ziplofy-label') ?? 'Element',
        kind: (marked.getAttribute('data-ziplofy-kind') as ThemePreviewSelectionHint['kind']) ?? 'element',
      };
    }
  }

  const text = normalizeText(el.textContent ?? '');
  if (text.length >= 2) {
    const hint = hints.find((h) => h.matchText && normalizeText(h.matchText) === text);
    if (hint) return { nodeId: hint.nodeId, label: hint.label, kind: hint.kind };
  }

  const section = el.closest(SECTION_SELECTOR) as HTMLElement | null;
  if (section) {
    const sectionHint = hints.find(
      (h) =>
        h.kind === 'section' &&
        h.sectionId &&
        (section.id.includes(h.sectionId) ||
          section.className.includes(h.sectionId) ||
          section.matches(`[data-section-id="${h.sectionId}"]`))
    );
    if (sectionHint) return { nodeId: sectionHint.nodeId, label: sectionHint.label, kind: 'section' };
  }

  return null;
}

function resolveSectionElementForNodeId(nodeId: string): HTMLElement | null {
  if (nodeId.startsWith('field:')) {
    const marked = document.querySelector(`[data-ziplofy-node="${CSS.escape(nodeId)}"]`);
    return (marked?.closest(SECTION_SELECTOR) as HTMLElement | null) ?? null;
  }

  if (nodeId.startsWith('layout:')) {
    const layoutKey = nodeId.slice('layout:'.length).split(':')[0];
    if (layoutKey === 'header') {
      return document.querySelector('header,[role="banner"]') as HTMLElement | null;
    }
    if (layoutKey === 'footer' || layoutKey === 'footer_utilities') {
      const footer = document.querySelector('footer,[role="contentinfo"]');
      if (footer) return footer as HTMLElement;
    }
    const byId = findBySectionId(layoutKey);
    if (byId) return byId as HTMLElement;
  }

  if (nodeId.startsWith('template:')) {
    const parts = nodeId.split(':');
    if (parts.length >= 3) {
      const secId = parts[2];
      const byId = findBySectionId(secId);
      if (byId) return byId as HTMLElement;
    }
  }

  return null;
}

function scrollTargetForElement(el: HTMLElement): HTMLElement {
  if (el.matches(SECTION_SELECTOR) || el.hasAttribute('data-ziplofy-section')) {
    return el;
  }
  const section = el.closest(SECTION_SELECTOR) as HTMLElement | null;
  return section ?? el;
}

/** Smoothly scroll the preview so the selected sidebar node is visible. */
export function scrollPreviewToNodeId(nodeId: string): boolean {
  const el = findElementForNodeId(nodeId) ?? resolveSectionElementForNodeId(nodeId);
  if (!el?.isConnected) return false;

  const target = scrollTargetForElement(el);
  target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  return true;
}

export function findElementForNodeId(nodeId: string): HTMLElement | null {
  const marked = document.querySelector(`[data-ziplofy-node="${CSS.escape(nodeId)}"]`);
  if (marked) return marked as HTMLElement;
  return resolveSectionElementForNodeId(nodeId);
}
