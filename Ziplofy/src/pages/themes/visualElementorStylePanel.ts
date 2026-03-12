/**
 * Visual Elementor – style panel integration.
 * From-scratch implementation: select element → show styles in panel → edit → apply to element.
 */

const STYLE_PANEL_ID = 'style-panel';

function getPanel(): HTMLElement | null {
  return document.getElementById(STYLE_PANEL_ID);
}

/** Apply a style property from the panel to the component and its DOM element */
function applyStyleToComponent(component: any, property: string, value: string): void {
  if (!component || !property) return;
  try {
    component.addStyle?.({ [property]: value });
    const el = component.getEl?.() || component.view?.el;
    if (el?.style?.setProperty) {
      const cssProp = property.replace(/([A-Z])/g, '-$1').toLowerCase();
      el.style.setProperty(cssProp, value, 'important');
    }
    if (component.view?.updateStyle) component.view.updateStyle();
  } catch {}
}

/** Check if a color value is black/default (should not be auto-applied – preserve theme color) */
export function isDefaultBlackColor(v: string | undefined | null): boolean {
  if (v == null || String(v).trim() === '') return true;
  const s = String(v).trim();
  return /^(rgb\(0,\s*0,\s*0\)|rgba\(0,\s*0,\s*0[^)]*\)|black|#000(?:000)?(?:ff)?)$/i.test(s);
}

/** Strip black/default color that GrapesJS/StyleManager applies on select – color persists until user explicitly changes it */
function clearBlackInlineColor(comp: any): void {
  if (!comp) return;
  try {
    const el = comp.getEl?.();
    const color = comp.getStyle?.()?.color ?? el?.style?.color;
    if (isDefaultBlackColor(color as string)) {
      if (el?.style) el.style.removeProperty('color');
      try { comp.removeStyle?.('color'); } catch {}
    }
    (comp.components?.() || []).forEach((c: any) => clearBlackInlineColor(c));
  } catch {}
}

/**
 * Sync StyleManager to the selected component and render into the style panel.
 * Call this when a component is selected so the panel shows its styles.
 */
export function syncStylePanelWithSelection(editor: any): void {
  const panel = getPanel();
  const sm = editor?.StyleManager;
  const selected = editor?.getSelected?.();
  if (!panel || !sm || !selected) return;

  const card = panel.closest('.elementor-panel-card[data-panel-type="style"]') as HTMLElement;
  if (card) {
    card.style.display = 'flex';
    card.style.visibility = 'visible';
    card.style.opacity = '1';
  }
  panel.style.display = 'block';
  panel.style.visibility = 'visible';
  panel.style.opacity = '1';
  panel.style.width = '100%';
  panel.style.minHeight = '300px';

  try {
    if (typeof sm.select === 'function') sm.select(selected);
    else if (typeof sm.setTarget === 'function') sm.setTarget(selected);

    const smEl = sm.render?.();
    if (smEl) {
      const node = (smEl as any).el ?? smEl;
      if (node?.nodeType === 1) {
        if (!panel.contains(node)) {
          panel.innerHTML = '';
          panel.appendChild(node);
        }
      }
    }
  } catch (_) {}
}

/**
 * Setup handlers so style changes from the panel apply to the selected component.
 * GrapesJS fires style:property:update; we also wire property change listeners.
 */
export function setupStyleChangeHandlers(editor: any, onHasChanges?: () => void): () => void {
  const unsub: Array<() => void> = [];

  const applyChange = (propName: string, value: string) => {
    const selected = editor.getSelected?.();
    if (selected && propName) applyStyleToComponent(selected, propName, value);
    onHasChanges?.();
  };

  editor.on('style:property:update', (data: any) => {
    try {
      const prop = data?.property ?? data;
      const propName = prop?.get?.('property') ?? prop?.getName?.();
      const value = prop?.getFullValue?.() ?? prop?.getValue?.() ?? data?.value;
      if (!propName || value === undefined) return;
      // Block default black color – preserve theme color until user explicitly changes it
      if (propName === 'color' && isDefaultBlackColor(String(value))) return;
      applyChange(propName, String(value));
    } catch {}
  });

  try {
    const sm = editor.StyleManager;
    if (sm?.getSectors) {
      sm.getSectors().forEach((sector: any) => {
        (sector.getProperties?.() || []).forEach((prop: any) => {
          if (prop?.on) {
            const handler = () => {
              const name = prop.get?.('property') || prop.getName?.();
              const val = prop.getFullValue?.() || prop.getValue?.() || prop.get?.('value');
              if (name && val !== undefined) applyChange(name, String(val));
            };
            prop.on('change:value', handler);
            unsub.push(() => { try { prop.off?.('change:value', handler); } catch {} });
          }
        });
      });
    }
  } catch (_) {}

  return () => unsub.forEach(f => f());
}

/**
 * Clear black/default inline color on component:deselected (StyleManager can leave it on previous element).
 * Ensures color persists until user explicitly changes it.
 */
export function onComponentDeselected(component: any): void {
  if (component) {
    clearBlackInlineColor(component);
    setTimeout(() => clearBlackInlineColor(component), 0);
    setTimeout(() => clearBlackInlineColor(component), 50);
    setTimeout(() => clearBlackInlineColor(component), 150);
    setTimeout(() => clearBlackInlineColor(component), 300);
    setTimeout(() => clearBlackInlineColor(component), 500);
  }
}

/**
 * Clear black/default inline color when component is selected (GrapesJS/StyleManager may apply it).
 * Run immediately and with delays to override StyleManager default – color persists until user changes it.
 */
export function onComponentSelected(component: any): void {
  if (component) {
    clearBlackInlineColor(component);
    setTimeout(() => clearBlackInlineColor(component), 0);
    setTimeout(() => clearBlackInlineColor(component), 50);
    setTimeout(() => clearBlackInlineColor(component), 100);
    setTimeout(() => clearBlackInlineColor(component), 200);
    setTimeout(() => clearBlackInlineColor(component), 400);
    setTimeout(() => clearBlackInlineColor(component), 600);
  }
}
