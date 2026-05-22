import type { EditorFieldDef } from './theme-editor-sidebar.types';

export type ThemeEditorFieldType = 'text' | 'textarea' | 'color' | 'boolean' | 'number';

export function fieldTypeFromSchema(type: string): ThemeEditorFieldType {
  if (type === 'textarea') return 'textarea';
  if (type === 'boolean') return 'boolean';
  if (type === 'color') return 'color';
  if (type === 'number') return 'number';
  return 'text';
}

export function fieldInputId(path: string): string {
  return `theme-field-${path.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
}

export function fieldValueAsString(
  values: Record<string, string | boolean>,
  field: EditorFieldDef
): string {
  const raw = values[field.path];
  if (raw === undefined || raw === null) return '';
  return String(raw);
}
