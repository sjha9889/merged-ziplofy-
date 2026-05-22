import type { EditorFieldDef, EditorSchemaDoc } from '../components/themes/theme-editor-sidebar/theme-editor-sidebar.types';
import { fieldTypeFromSchema } from '../components/themes/theme-editor-sidebar/theme-editor-field.utils';

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
  if (normalized === 'boolean') return Boolean(raw);
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

  for (const field of flattenSchemaFieldPaths(schema)) {
    const raw = values[field.path];
    if (raw === undefined) continue;
    const coerced = coerceFieldValue(raw, field.type);
    if (coerced === undefined) continue;
    setConfigAtPath(config, field.path, coerced);
  }

  return config;
}
