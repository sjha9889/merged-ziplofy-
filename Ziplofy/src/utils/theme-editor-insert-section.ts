import { ANNOUNCEMENT_BAR_DEFAULT_SETTINGS } from '../config/theme-editor-announcement-schema';
import type { ThemePreviewPage } from '../components/themes/ThemeLivePreviewFrame';
import type { SectionCatalogItem, SectionInsertContext } from '../components/themes/theme-editor-sidebar/add-section-catalog';
import type { EditorSchemaDoc } from '../components/themes/theme-editor-sidebar/theme-editor-sidebar.types';
import {
  listKeyHeaderSections,
  listKeyFooterSections,
  listKeyTemplateSections,
} from '../components/themes/theme-editor-sidebar/theme-editor-structure-order';

export type LayoutOrder = {
  header?: string[];
  footer?: string[];
};

const CATALOG_BLUEPRINT: Record<string, { blueprintId: string; type: string; label: string }> = {
  'announcement-bar': { blueprintId: 'announcement_bar', type: 'announcement-bar', label: 'Announcement bar' },
  divider: { blueprintId: 'divider', type: 'divider', label: 'Divider' },
  hero: { blueprintId: 'hero_main', type: 'hero', label: 'Hero' },
  'featured-collection': { blueprintId: 'featured_collection', type: 'featured-collection', label: 'Featured collection' },
  footer: { blueprintId: 'footer', type: 'footer', label: 'Footer' },
};

function templateIdForPage(page: ThemePreviewPage): string {
  return page || 'index';
}

function getNested(obj: Record<string, unknown>, path: string[]): unknown {
  let cur: unknown = obj;
  for (const p of path) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

function setNested(obj: Record<string, unknown>, path: string[], value: unknown): void {
  let cur = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const p = path[i];
    if (cur[p] == null || typeof cur[p] !== 'object') cur[p] = {};
    cur = cur[p] as Record<string, unknown>;
  }
  cur[path[path.length - 1]] = value;
}

export function getLayoutOrder(config: Record<string, unknown> | null): LayoutOrder {
  const raw = getNested(config ?? {}, ['layout_order']) as LayoutOrder | undefined;
  return raw ?? {};
}

export function defaultHeaderSectionOrder(config: Record<string, unknown>): string[] {
  const sections = config.sections as Record<string, unknown> | undefined;
  if (!sections) return ['announcement_bar', 'header'];
  const keys = Object.keys(sections);
  const announcements = keys.filter((k) => k === 'announcement_bar' || k.startsWith('announcement_bar_'));
  const header = keys.includes('header') ? ['header'] : [];
  return [...announcements, ...header];
}

export function defaultFooterSectionOrder(config: Record<string, unknown>): string[] {
  const sections = config.sections as Record<string, unknown> | undefined;
  if (!sections) return ['footer', 'footer_utilities'];
  const out: string[] = [];
  if (sections.footer) out.push('footer');
  if (sections.footer_utilities) out.push('footer_utilities');
  return out.length ? out : ['footer'];
}

export function ensureLayoutOrder(config: Record<string, unknown>): LayoutOrder {
  const order = getLayoutOrder(config);
  if (!order.header?.length) {
    order.header = defaultHeaderSectionOrder(config);
    setNested(config, ['layout_order'], order);
  }
  if (!order.footer?.length) {
    order.footer = defaultFooterSectionOrder(config);
    const lo = getLayoutOrder(config);
    lo.footer = order.footer;
    setNested(config, ['layout_order'], lo);
  }
  return getLayoutOrder(config);
}

/** Map instance id (e.g. announcement_bar_2) to schema layout blueprint key. */
export function layoutBlueprintKey(sectionId: string): string {
  if (sectionId === 'header' || sectionId === 'footer' || sectionId === 'footer_utilities') {
    return sectionId;
  }
  if (sectionId === 'announcement_bar' || sectionId.startsWith('announcement_bar_')) {
    return 'announcement_bar';
  }
  if (sectionId.startsWith('divider')) return 'divider';
  return sectionId;
}

export function remapLayoutSchemaPath(path: string, instanceId: string): string {
  const blueprint = layoutBlueprintKey(instanceId);
  if (blueprint === instanceId) return path;
  return path.replace(`sections.${blueprint}.`, `sections.${instanceId}.`);
}

function newInstanceId(config: Record<string, unknown>, blueprintId: string): string {
  const sections = (config.sections ?? {}) as Record<string, unknown>;
  if (!sections[blueprintId]) return blueprintId;
  let n = 2;
  while (sections[`${blueprintId}_${n}`]) n += 1;
  return `${blueprintId}_${n}`;
}

function defaultAnnouncementSection(type: string, id: string): Record<string, unknown> {
  return {
    id,
    type,
    enabled: true,
    settings: { ...ANNOUNCEMENT_BAR_DEFAULT_SETTINGS },
    blocks: {
      announcement: {
        type: 'announcement',
        settings: {
          text: String(ANNOUNCEMENT_BAR_DEFAULT_SETTINGS.message ?? ''),
        },
      },
    },
    block_order: ['announcement'],
  };
}

function defaultDividerSection(id: string): Record<string, unknown> {
  return {
    id,
    type: 'divider',
    enabled: true,
    settings: {},
  };
}

function cloneBlueprintSection(
  config: Record<string, unknown>,
  blueprintId: string,
  instanceId: string,
  meta: { type: string }
): Record<string, unknown> {
  const sections = (config.sections ?? {}) as Record<string, unknown>;
  const src = sections[blueprintId];
  if (src && typeof src === 'object') {
    const clone = JSON.parse(JSON.stringify(src)) as Record<string, unknown>;
    clone.id = instanceId;
    if (!clone.type) clone.type = meta.type;
    return clone;
  }
  if (blueprintId === 'announcement_bar') {
    return defaultAnnouncementSection(meta.type, instanceId);
  }
  if (blueprintId === 'divider') {
    return defaultDividerSection(instanceId);
  }
  return { id: instanceId, type: meta.type, enabled: true, settings: {} };
}

function insertIntoOrder(order: string[], instanceId: string, ctx: SectionInsertContext): string[] {
  const next = [...order];
  const anchorAfter = ctx.afterNodeId?.startsWith('layout:')
    ? ctx.afterNodeId.slice('layout:'.length)
    : null;
  const anchorBefore = ctx.beforeNodeId?.startsWith('layout:')
    ? ctx.beforeNodeId.slice('layout:'.length)
    : null;

  if (anchorBefore && anchorBefore !== 'add-section') {
    const idx = next.indexOf(anchorBefore);
    if (idx >= 0) {
      next.splice(idx, 0, instanceId);
      return next;
    }
  }
  if (anchorAfter && anchorAfter !== 'add-section') {
    const idx = next.indexOf(anchorAfter);
    if (idx >= 0) {
      next.splice(idx + 1, 0, instanceId);
      return next;
    }
  }
  next.push(instanceId);
  return next;
}

function resolveTemplateBlueprint(
  catalogId: string,
  schema: EditorSchemaDoc,
  page: ThemePreviewPage
): { blueprintId: string; type: string; label: string } | null {
  const tpl = schema.templates?.find((t) => t.id === templateIdForPage(page));
  if (!tpl?.sections?.length) return null;

  const typeByCatalog: Record<string, string> = {
    hero: 'hero',
    'featured-collection': 'featured-collection',
  };
  const targetType = typeByCatalog[catalogId];
  const sec =
    tpl.sections.find((s) => s.type === targetType) ??
    tpl.sections.find((s) => s.id === catalogId);
  if (!sec?.id) return null;
  return {
    blueprintId: sec.id,
    type: sec.type ?? catalogId,
    label: sec.label ?? catalogId,
  };
}

function cloneTemplateSection(
  config: Record<string, unknown>,
  tplId: string,
  blueprintId: string,
  instanceId: string,
  meta: { type: string }
): void {
  const tpl = getNested(config, ['templates', tplId]) as Record<string, unknown> | undefined;
  if (!tpl) return;
  const sections = (tpl.sections ?? {}) as Record<string, unknown>;
  const src = sections[blueprintId];
  if (src && typeof src === 'object') {
    sections[instanceId] = JSON.parse(JSON.stringify(src));
    (sections[instanceId] as Record<string, unknown>).type = meta.type;
  } else {
    sections[instanceId] = { type: meta.type, enabled: true, settings: {}, blocks: {}, block_order: [] };
  }
  tpl.sections = sections;
  const order = Array.isArray(tpl.section_order) ? [...(tpl.section_order as string[])] : [];
  if (!order.includes(instanceId)) {
    order.push(instanceId);
  }
  tpl.section_order = order;
}

export type InsertSectionResult = {
  config: Record<string, unknown>;
  instanceId: string;
  nodeId: string;
  listKey: string;
};

/** Copy schema field paths from blueprint instance to a new layout instance for `values` map. */
export function extendValuesForLayoutInstance(
  values: Record<string, string | boolean>,
  schema: EditorSchemaDoc,
  blueprintId: string,
  instanceId: string,
  config: Record<string, unknown>
): Record<string, string | boolean> {
  if (blueprintId === instanceId) return values;
  const blueprint = layoutBlueprintKey(blueprintId);
  const layout = schema.layout?.[blueprint];
  if (!layout) return values;

  const next = { ...values };
  const walkFields = (fields: { path: string; type: string }[] | undefined) => {
    for (const field of fields ?? []) {
      if (!field.path?.startsWith(`sections.${blueprint}.`)) continue;
      const newPath = remapLayoutSchemaPath(field.path, instanceId);
      const raw = getNested(config, newPath.split('.').filter(Boolean));
      if (raw === undefined) continue;
      next[newPath] =
        field.type === 'boolean' ? Boolean(raw) : raw == null ? '' : String(raw);
    }
  };

  walkFields(layout.settingsFields);
  const walkBlocks = (blocks: typeof layout.blocks) => {
    for (const block of blocks ?? []) {
      walkFields(block.settingsFields);
      walkBlocks(block.blocks);
    }
  };
  walkBlocks(layout.blocks);
  return next;
}

export function insertSectionFromCatalog(
  config: Record<string, unknown>,
  item: SectionCatalogItem,
  ctx: SectionInsertContext,
  schema: EditorSchemaDoc,
  previewPage: ThemePreviewPage
): InsertSectionResult | null {
  const next = JSON.parse(JSON.stringify(config)) as Record<string, unknown>;
  ensureLayoutOrder(next);

  if (ctx.groupId === 'header' || ctx.groupId === 'footer') {
    const meta = CATALOG_BLUEPRINT[item.id];
    if (!meta) return null;

    const instanceId = newInstanceId(next, meta.blueprintId);
    const sections = { ...((next.sections ?? {}) as Record<string, unknown>) };
    sections[instanceId] = cloneBlueprintSection(next, meta.blueprintId, instanceId, meta);
    next.sections = sections;

    const order = getLayoutOrder(next);
    const key = ctx.groupId === 'header' ? 'header' : 'footer';
    const current = [...(order[key] ?? (key === 'header' ? defaultHeaderSectionOrder(next) : defaultFooterSectionOrder(next)))];
    order[key] = insertIntoOrder(current, instanceId, ctx);
    setNested(next, ['layout_order'], order);

    return {
      config: next,
      instanceId,
      nodeId: `layout:${instanceId}`,
      listKey: key === 'header' ? listKeyHeaderSections() : listKeyFooterSections(),
    };
  }

  if (ctx.groupId === 'template') {
    const tplId = templateIdForPage(previewPage);
    let meta = CATALOG_BLUEPRINT[item.id] ?? null;
    if (!meta) {
      const fromTpl = resolveTemplateBlueprint(item.id, schema, previewPage);
      if (!fromTpl) return null;
      meta = fromTpl;
    }

    const tpl = getNested(next, ['templates', tplId]) as Record<string, unknown> | undefined;
    if (!tpl) return null;

    const sections = (tpl.sections ?? {}) as Record<string, unknown>;
    const instanceId = newInstanceId(
      { sections } as Record<string, unknown>,
      meta.blueprintId
    );
    cloneTemplateSection(next, tplId, meta.blueprintId, instanceId, meta);

    const order = Array.isArray(tpl.section_order) ? [...(tpl.section_order as string[])] : Object.keys(sections);
    const anchorAfter = ctx.afterNodeId?.match(/^template:[^:]+:([^:]+)$/)?.[1];
    const anchorBefore = ctx.beforeNodeId?.match(/^template:[^:]+:([^:]+)$/)?.[1];
    let newOrder = [...order];
    if (anchorBefore && anchorBefore !== 'add-section') {
      const idx = newOrder.indexOf(anchorBefore);
      if (idx >= 0) newOrder.splice(idx, 0, instanceId);
      else newOrder.push(instanceId);
    } else if (anchorAfter && anchorAfter !== 'add-section') {
      const idx = newOrder.indexOf(anchorAfter);
      if (idx >= 0) newOrder.splice(idx + 1, 0, instanceId);
      else newOrder.push(instanceId);
    } else if (!newOrder.includes(instanceId)) {
      newOrder.push(instanceId);
    }
    tpl.section_order = newOrder;

    return {
      config: next,
      instanceId,
      nodeId: `template:${tplId}:${instanceId}`,
      listKey: listKeyTemplateSections(tplId),
    };
  }

  return null;
}

const PROTECTED_LAYOUT_SECTIONS = new Set(['header', 'footer', 'footer_utilities']);

/** Remove a header/footer layout section instance and update layout_order. */
export function removeLayoutSection(
  config: Record<string, unknown>,
  instanceId: string,
  groupId: 'header' | 'footer'
): Record<string, unknown> | null {
  if (PROTECTED_LAYOUT_SECTIONS.has(instanceId)) return null;

  const next = JSON.parse(JSON.stringify(config)) as Record<string, unknown>;
  const sections = (next.sections ?? {}) as Record<string, unknown>;
  if (!sections[instanceId]) return null;

  delete sections[instanceId];
  next.sections = sections;

  const order = ensureLayoutOrder(next);
  const key = groupId === 'header' ? 'header' : 'footer';
  const current = [...(order[key] ?? [])];
  order[key] = current.filter((id) => id !== instanceId);
  setNested(next, ['layout_order'], order);

  return next;
}

/** Drop value paths for a removed layout section instance. */
export function pruneValuesForLayoutInstance(
  values: Record<string, string | boolean>,
  instanceId: string
): Record<string, string | boolean> {
  const prefix = `sections.${instanceId}.`;
  const next: Record<string, string | boolean> = {};
  for (const [path, val] of Object.entries(values)) {
    if (!path.startsWith(prefix)) next[path] = val;
  }
  return next;
}
