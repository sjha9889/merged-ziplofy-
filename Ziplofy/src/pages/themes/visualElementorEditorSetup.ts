/**
 * Visual Elementor – editor setup after theme HTML is loaded.
 * From-scratch implementation matching BasicElementor:
 * - expandComponentContent: expand nested HTML so children become components
 * - configureAllNested: set selectable, droppable, editable, stylable on all
 */

const CONTAINER_TAGS = new Set(['div', 'section', 'main', 'article', 'header', 'footer', 'nav', 'aside', 'form', 'ul', 'ol', 'li', 'figure', 'figcaption']);
const TEXT_TAGS = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'a', 'label', 'li', 'td', 'th', 'button', 'strong', 'em', 'b', 'i', 'u', 'small', 'sub', 'sup', 'blockquote', 'cite', 'img']);

function expandComponentContent(comp: any): boolean {
  if (!comp) return false;
  let changed = false;
  const content = comp.get?.('content');
  const children = comp.components?.();
  const hasHtmlContent = typeof content === 'string' && /<[a-z][a-z0-9]*[\s>]/i.test(content);
  if (hasHtmlContent && (!children || children.length === 0)) {
    try {
      comp.set('content', '', { silent: true });
      const appended = comp.append?.(content);
      if (appended?.length) changed = true;
    } catch {}
  }
  (comp.components?.() || []).forEach((c: any) => { if (expandComponentContent(c)) changed = true; });
  return changed;
}

function configureAllNested(comp: any): void {
  if (!comp) return;
  try {
    const tagName = (comp.get?.('tagName') || '').toLowerCase();
    const attrs = comp.getAttributes?.() || {};
    const isDroppable = attrs['data-gjs-droppable'] === '*' || CONTAINER_TAGS.has(tagName);
    const hasText = typeof comp.get?.('content') === 'string' && (comp.get('content') || '').trim().length > 0;
    const isEditable = attrs['data-gjs-editable'] === 'true' || attrs['data-gjs-type'] === 'text' || TEXT_TAGS.has(tagName) || (hasText && (!comp.components?.() || comp.components().length === 0));
    comp.set({
      selectable: true,
      hoverable: true,
      draggable: true,
      stylable: true,
      droppable: isDroppable ? '*' : false,
      editable: isEditable,
    }, { silent: true });
    (comp.components?.() || []).forEach((c: any) => configureAllNested(c));
  } catch {}
}

/** Run after setComponents(html): expand nested HTML and configure all components. Matches BasicElementor. */
export function runExpandAndConfigureSelectability(editor: any): void {
  try {
    const wrapper = editor.getWrapper();
    if (!wrapper) return;
    wrapper.components?.().forEach((c: any) => expandComponentContent(c));
    wrapper.set({ droppable: true, selectable: true, editable: false, draggable: false, hoverable: true, stylable: true }, { silent: true });
    if (!wrapper.getClasses().includes('gjs-wrapper-body')) wrapper.addClass('gjs-wrapper-body');
    wrapper.components?.().forEach((c: any) => configureAllNested(c));
    if (wrapper.view?.render) wrapper.view.render();
    console.log('✓ Configured all elements for full selectability');
  } catch (e) {
    console.warn('Configure selectability:', e);
  }
}
