import type { ThemeBlockCatalogPayload, ThemeEditorLoadResult } from './theme-editor-load';
import {
  configLocalStorageKeyForPack,
  displayNameForDevPack,
  getStaticDevPackId,
  type DevStaticThemePackId,
} from '../config/theme-editor-static.config';
import { THEME_EDITOR_STATIC_CONFIG } from '../config/theme-editor-static.config';
import { resolveThemePreviewOrigin } from '../components/themes/ThemeLivePreviewFrame';
import type { EditorSchemaDoc } from '../components/themes/theme-editor-sidebar/theme-editor-sidebar.types';
import {
  collectEditableFieldPaths,
  flattenSchemaFieldPaths,
} from './theme-editor-config.utils';

const PACK_MODULES: Record<
  string,
  () => Promise<{
    schema: unknown;
    defaultConfig: Record<string, unknown>;
    manifest: Record<string, unknown> | null;
  }>
> = {
  makeup: async () => {
    const [schema, defaultConfig, manifest] = await Promise.all([
      import('../theme-packs/makeup/theme.schema.json'),
      import('../theme-packs/makeup/theme.default-config.json'),
      import('../theme-packs/makeup/theme.manifest.json').catch(() => ({ default: null })),
    ]);
    return {
      schema: schema.default,
      defaultConfig: defaultConfig.default as Record<string, unknown>,
      manifest: (manifest.default as Record<string, unknown> | null) ?? null,
    };
  },
  horizon: async () => {
    const [schema, defaultConfig, manifest] = await Promise.all([
      import('../theme-packs/horizon/theme.schema.json'),
      import('../theme-packs/horizon/theme.default-config.json'),
      import('../theme-packs/horizon/theme.manifest.json').catch(() => ({ default: null })),
    ]);
    return {
      schema: schema.default,
      defaultConfig: defaultConfig.default as Record<string, unknown>,
      manifest: (manifest.default as Record<string, unknown> | null) ?? null,
    };
  },
};

function editorFieldType(type: string): string {
  if (type === 'textarea') return 'textarea';
  if (type === 'boolean') return 'boolean';
  if (type === 'color') return 'color';
  if (type === 'number') return 'number';
  if (type === 'select') return 'select';
  return 'text';
}

function getNested(obj: Record<string, unknown>, dotKey: string): unknown {
  const parts = dotKey.split('.');
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

export function flattenEditorFields(schema: EditorSchemaDoc) {
  return flattenSchemaFieldPaths(schema).map((f) => ({
    key: f.path,
    label: f.label,
    type: editorFieldType(f.type),
    default: f.type === 'boolean' ? false : '',
  }));
}

export function formValuesFromEditorConfig(
  schema: EditorSchemaDoc,
  config: Record<string, unknown>
): Record<string, string | boolean> {
  const values: Record<string, string | boolean> = {};
  for (const field of collectEditableFieldPaths(schema, config)) {
    const v = getNested(config, field.path);
    if (field.type === 'boolean') {
      values[field.path] = v === true || v === 'true' || v === 1 || v === '1';
    } else if (v == null || v === '') {
      values[field.path] = field.type === 'number' ? '0' : '';
    } else {
      values[field.path] = String(v);
    }
  }
  return values;
}

/** Merge pack default header settings into saved config (handles stale localStorage). */
/** Merge default template section settings (e.g. featured collection on index). */
export function mergeTemplateSectionDefaults(
  config: Record<string, unknown>,
  packDefault: Record<string, unknown>,
  templateId: string,
  sectionId: string
): void {
  const templates = config.templates as Record<string, { sections?: Record<string, Record<string, unknown>> }> | undefined;
  const defTemplates = packDefault.templates as Record<string, { sections?: Record<string, Record<string, unknown>> }> | undefined;
  const curSec = templates?.[templateId]?.sections?.[sectionId];
  const defSec = defTemplates?.[templateId]?.sections?.[sectionId];
  if (!curSec || !defSec) return;
  curSec.settings = { ...(defSec.settings ?? {}), ...(curSec.settings ?? {}) };
  const curBlocks = curSec.blocks as Record<string, { settings?: Record<string, unknown> }> | undefined;
  const defBlocks = defSec.blocks as Record<string, { settings?: Record<string, unknown> }> | undefined;
  if (!curBlocks || !defBlocks) return;
  for (const [blockId, defBlock] of Object.entries(defBlocks)) {
    if (!curBlocks[blockId]) {
      curBlocks[blockId] = JSON.parse(JSON.stringify(defBlock)) as { settings?: Record<string, unknown> };
      continue;
    }
    curBlocks[blockId].settings = {
      ...(defBlock.settings ?? {}),
      ...(curBlocks[blockId].settings ?? {}),
    };
  }
}

export function mergeLayoutSectionDefaults(
  config: Record<string, unknown>,
  packDefault: Record<string, unknown>,
  blueprintId: string,
  instanceId = blueprintId
): void {
  const sections = config.sections as Record<string, Record<string, unknown>> | undefined;
  const defSections = packDefault.sections as Record<string, Record<string, unknown>> | undefined;
  if (!sections?.[instanceId] || !defSections?.[blueprintId]) return;

  const cur = sections[instanceId];
  const def = defSections[blueprintId];
  cur.settings = { ...(def.settings ?? {}), ...(cur.settings ?? {}) };

  const curBlocks = cur.blocks as Record<string, { settings?: Record<string, unknown> }> | undefined;
  const defBlocks = def.blocks as Record<string, { settings?: Record<string, unknown> }> | undefined;
  if (!curBlocks || !defBlocks) return;
  for (const [blockId, defBlock] of Object.entries(defBlocks)) {
    if (!curBlocks[blockId]) {
      curBlocks[blockId] = JSON.parse(JSON.stringify(defBlock)) as { settings?: Record<string, unknown> };
      continue;
    }
    curBlocks[blockId].settings = {
      ...(defBlock.settings ?? {}),
      ...(curBlocks[blockId].settings ?? {}),
    };
  }
}

function resolveStaticAssetUrl(relativePath: string): string {
  const base = THEME_EDITOR_STATIC_CONFIG.staticBaseUrl.replace(/\/$/, '');
  if (!base) return relativePath;
  if (base.startsWith('http://') || base.startsWith('https://')) {
    return `${base}/${relativePath}`;
  }
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}${base.startsWith('/') ? base : `/${base}`}/${relativePath}`;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch ${url} (${res.status})`);
  return res.json() as Promise<T>;
}

async function loadPackFromBaseUrl(): Promise<{
  schema: unknown;
  defaultConfig: Record<string, unknown>;
  manifest: Record<string, unknown> | null;
}> {
  const base = THEME_EDITOR_STATIC_CONFIG.staticBaseUrl.replace(/\/$/, '');
  const schemaUrl = resolveStaticAssetUrl('theme.schema.json');
  const configUrl = resolveStaticAssetUrl('theme.default-config.json');
  const manifestUrl = resolveStaticAssetUrl('theme.manifest.json');

  const [schema, defaultConfig, manifest] = await Promise.all([
    fetchJson<unknown>(schemaUrl),
    fetchJson<Record<string, unknown>>(configUrl),
    fetch(manifestUrl, { cache: 'no-store' })
      .then((r) => (r.ok ? (r.json() as Promise<Record<string, unknown>>) : null))
      .catch(() => null),
  ]);

  return { schema, defaultConfig, manifest };
}

async function loadPackFromBundled(packId: string) {
  const loader = PACK_MODULES[packId];
  if (!loader) {
    throw new Error(
      `Unknown static theme pack "${packId}". Add it under src/theme-packs/${packId}/ or set VITE_THEME_EDITOR_STATIC_BASE_URL.`
    );
  }
  return loader();
}

export function buildBlockCatalogFromManifest(
  manifest: Record<string, unknown> | null,
  editorSchema: EditorSchemaDoc | null
): ThemeBlockCatalogPayload | null {
  if (!manifest) return null;

  const blockTypes = manifest.blockTypes as
    | Record<string, Array<{ id: string; label: string; extendedOnly?: boolean }>>
    | undefined;
  if (!blockTypes || typeof blockTypes !== 'object') return null;

  const blocks: ThemeBlockCatalogPayload['blocks'] = [];
  const categoryIds = new Set<string>();

  for (const [category, items] of Object.entries(blockTypes)) {
    categoryIds.add(category);
    for (const item of items) {
      blocks.push({
        id: item.id,
        label: item.label,
        category,
        icon: item.id,
        extendedOnly: item.extendedOnly,
      });
    }
  }

  const categories = Array.from(categoryIds).map((id) => ({
    id,
    label: id.charAt(0).toUpperCase() + id.slice(1),
  }));

  const sectionBlockAllowlist = {
    ...((manifest.sectionBlocks as Record<string, string[]>) ?? {}),
  };

  for (const tpl of editorSchema?.templates ?? []) {
    for (const sec of tpl.sections ?? []) {
      const secType = sec.type ?? sec.id ?? '';
      if (sectionBlockAllowlist[secType]?.length) continue;
      if (sec.blocks?.length) {
        sectionBlockAllowlist[secType] = sec.blocks.map((b) => b.id ?? '').filter(Boolean);
      }
    }
  }

  return { categories, blocks, sectionBlockAllowlist };
}

export function previewUrlsForPack(packId: string): { jsUrl: string; cssUrl: string } {
  const origin = resolveThemePreviewOrigin();
  const pathJs = `/remote-themes/${packId}/theme.js`;
  const pathCss = `/remote-themes/${packId}/theme.css`;
  return {
    jsUrl: `${origin}${pathJs}`,
    cssUrl: `${origin}${pathCss}`,
  };
}

function readLocalConfig(packId: string): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(configLocalStorageKeyForPack(packId));
    if (!raw) return null;
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function saveStaticThemeConfigLocal(
  config: Record<string, unknown>,
  packId: string = getStaticDevPackId()
): void {
  localStorage.setItem(configLocalStorageKeyForPack(packId), JSON.stringify(config));
}

/** Load the static reference theme for editor dev mode (no API / S3). */
export async function loadStaticThemeEditorPack(
  packId: DevStaticThemePackId = getStaticDevPackId()
): Promise<ThemeEditorLoadResult> {
  const { jsUrl: envJs, cssUrl: envCss, staticBaseUrl } = THEME_EDITOR_STATIC_CONFIG;

  const loaded = staticBaseUrl
    ? await loadPackFromBaseUrl()
    : await loadPackFromBundled(packId);

  const editorSchema = loaded.schema as EditorSchemaDoc;
  const defaultConfig = loaded.defaultConfig;
  const saved = readLocalConfig(packId);
  const config = saved
    ? (JSON.parse(JSON.stringify(saved)) as Record<string, unknown>)
    : (JSON.parse(JSON.stringify(defaultConfig)) as Record<string, unknown>);
  mergeLayoutSectionDefaults(config, defaultConfig, 'header');
  mergeLayoutSectionDefaults(config, defaultConfig, 'announcement_bar');
  mergeLayoutSectionDefaults(config, defaultConfig, 'footer');
  mergeLayoutSectionDefaults(config, defaultConfig, 'footer_utilities');
  mergeTemplateSectionDefaults(config, defaultConfig, 'index', 'hero_main');
  mergeTemplateSectionDefaults(config, defaultConfig, 'index', 'featured_collection');
  const values = formValuesFromEditorConfig(editorSchema, config);

  const packPreview = previewUrlsForPack(packId);
  const runtimeJs = staticBaseUrl ? envJs || resolveStaticAssetUrl('theme.js') : packPreview.jsUrl;
  const runtimeCss = staticBaseUrl ? envCss || resolveStaticAssetUrl('theme.css') : packPreview.cssUrl;

  return {
    themeName: displayNameForDevPack(packId),
    themePath: staticBaseUrl || `theme-packs/${packId}`,
    editorSchema,
    defaultConfig,
    manifest: loaded.manifest,
    blockCatalog: buildBlockCatalogFromManifest(loaded.manifest, editorSchema),
    packLoadedFromS3: false,
    storeOverrides: {},
    config,
    values,
    configMode: 'sections',
    themeRuntime: { jsUrl: runtimeJs, cssUrl: runtimeCss },
    installed: false,
    canPersist: true,
    notice: null,
    staticPackId: packId,
  };
}
