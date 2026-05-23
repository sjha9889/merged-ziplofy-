import type { EditorFieldDef, EditorSchemaDoc } from '../components/themes/theme-editor-sidebar/theme-editor-sidebar.types';
import { fieldTypeFromSchema } from '../components/themes/theme-editor-sidebar/theme-editor-field.utils';
import { layoutBlueprintKey, remapLayoutSchemaPath } from './theme-editor-insert-section';

export type SchemaFieldPath = { path: string; type: string; label: string };

type BlockLike = {
  settingsFields?: EditorFieldDef[];
  blocks?: BlockLike[];
};

function pushBlockFields(blocks: BlockLike[] | undefined, out: SchemaFieldPath[], seen: Set<string>): void {
  for (const block of blocks ?? []) {
    for (const field of block.settingsFields ?? []) {
      if (!field.path || seen.has(field.path)) continue;
      seen.add(field.path);
      out.push({ path: field.path, type: field.type, label: field.label || field.path });
    }
    pushBlockFields(block.blocks, out, seen);
  }
}

/** Every editable path declared in theme.schema.json (including nested blocks). */
export function flattenSchemaFieldPaths(schema: EditorSchemaDoc): SchemaFieldPath[] {
  const out: SchemaFieldPath[] = [];
  const seen = new Set<string>();

  for (const group of schema.globalSettings?.groups ?? []) {
    for (const field of group.fields ?? []) {
      if (!field.path || seen.has(field.path)) continue;
      seen.add(field.path);
      out.push({ path: field.path, type: field.type, label: field.label || field.path });
    }
  }

  for (const layout of Object.values(schema.layout ?? {})) {
    for (const field of layout.settingsFields ?? []) {
      if (!field.path || seen.has(field.path)) continue;
      seen.add(field.path);
      out.push({ path: field.path, type: field.type, label: field.label || field.path });
    }
    pushBlockFields(layout.blocks, out, seen);
  }

  for (const tpl of schema.templates ?? []) {
    for (const sec of tpl.sections ?? []) {
      for (const field of sec.settingsFields ?? []) {
        if (!field.path || seen.has(field.path)) continue;
        seen.add(field.path);
        out.push({ path: field.path, type: field.type, label: field.label || field.path });
      }
      pushBlockFields(sec.blocks, out, seen);
    }
  }

  return out;
}

function pushRemappedFields(
  fields: EditorFieldDef[] | undefined,
  instanceId: string,
  out: SchemaFieldPath[],
  seen: Set<string>
): void {
  for (const field of fields ?? []) {
    if (!field.path) continue;
    const path = remapLayoutSchemaPath(field.path, instanceId);
    if (seen.has(path)) continue;
    seen.add(path);
    out.push({ path, type: field.type, label: field.label || path });
  }
}

function pushRemappedBlockFields(
  blocks: BlockLike[] | undefined,
  instanceId: string,
  out: SchemaFieldPath[],
  seen: Set<string>
): void {
  for (const block of blocks ?? []) {
    pushRemappedFields(block.settingsFields, instanceId, out, seen);
    pushRemappedBlockFields(block.blocks, instanceId, out, seen);
  }
}

/**
 * Schema blueprint paths plus remapped paths for extra layout instances
 * (e.g. sections.announcement_bar_2.* added via "Add section").
 */
export function collectEditableFieldPaths(
  schema: EditorSchemaDoc,
  config: Record<string, unknown>
): SchemaFieldPath[] {
  const out = flattenSchemaFieldPaths(schema);
  const seen = new Set(out.map((f) => f.path));
  const sections = (config.sections ?? {}) as Record<string, unknown>;

  for (const instanceId of Object.keys(sections)) {
    const blueprint = layoutBlueprintKey(instanceId);
    if (blueprint === instanceId) continue;
    const layout = schema.layout?.[blueprint];
    if (!layout) continue;
    pushRemappedFields(layout.settingsFields, instanceId, out, seen);
    pushRemappedBlockFields(layout.blocks, instanceId, out, seen);
  }

  return out;
}

function resolveFieldTypeForPath(
  path: string,
  typeByPath: Map<string, string>
): string | undefined {
  const direct = typeByPath.get(path);
  if (direct) return direct;

  const m = path.match(/^sections\.([^.]+)\.(.+)$/);
  if (!m) return undefined;
  const [, instanceId, rest] = m;
  const blueprint = layoutBlueprintKey(instanceId);
  if (blueprint === instanceId) return undefined;
  return typeByPath.get(`sections.${blueprint}.${rest}`);
}

/** Write a value at a dot path; numeric segments use real arrays when the parent is a list. */
export function setConfigAtPath(
  obj: Record<string, unknown>,
  dotPath: string,
  value: unknown
): void {
  const parts = dotPath.split('.');
  let cur: Record<string, unknown> | unknown[] = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    const next = parts[i + 1];
    const nextIsIndex = /^\d+$/.test(next);

    if (Array.isArray(cur)) {
      const idx = Number(p);
      if (cur[idx] == null || typeof cur[idx] !== 'object') {
        cur[idx] = nextIsIndex ? [] : {};
      }
      cur = cur[idx] as Record<string, unknown>;
      continue;
    }

    const record = cur as Record<string, unknown>;
    if (record[p] == null || typeof record[p] !== 'object') {
      record[p] = nextIsIndex ? [] : {};
    }
    cur = record[p] as Record<string, unknown>;
  }

  const last = parts[parts.length - 1];
  if (Array.isArray(cur)) {
    cur[Number(last)] = value;
  } else {
    (cur as Record<string, unknown>)[last] = value;
  }
}

function coerceFieldValue(
  raw: string | boolean | undefined,
  type: string
): string | boolean | number | undefined {
  if (raw === undefined) return undefined;
  const normalized = fieldTypeFromSchema(type);
  if (normalized === 'boolean') {
    if (typeof raw === 'boolean') return raw;
    if (raw === 'false' || raw === '0' || raw === '') return false;
    return raw === 'true' || raw === '1';
  }
  if (normalized === 'number') {
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  }
  return String(raw);
}

/** Merge sidebar `values` into a full theme config (used for preview + save). */
export function applyValuesToThemeConfig(
  baseConfig: Record<string, unknown>,
  values: Record<string, string | boolean>,
  schema: EditorSchemaDoc
): Record<string, unknown> {
  const config = JSON.parse(JSON.stringify(baseConfig)) as Record<string, unknown>;
  const typeByPath = new Map(
    collectEditableFieldPaths(schema, baseConfig).map((f) => [f.path, f.type])
  );

  for (const [path, raw] of Object.entries(values)) {
    const type = resolveFieldTypeForPath(path, typeByPath);
    if (!type) continue;
    const coerced = coerceFieldValue(raw, type);
    if (coerced === undefined) continue;
    setConfigAtPath(config, path, coerced);
  }

  return config;
}
