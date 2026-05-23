import type { EditorFieldDef, EditorSchemaDoc, SidebarNode } from './theme-editor-sidebar.types';

const PANEL_GROUPS = new Set(['Text', 'Layout', 'Typography', 'Appearance', 'Padding']);

const HEADING_PANEL_KEYS = new Set([
  'title',
  'headingWidth',
  'headingMaxWidth',
  'headingTypographyPreset',
  'headingColor',
  'headingBackgroundEnabled',
  'headingPaddingTop',
  'headingPaddingBottom',
  'headingPaddingLeft',
  'headingPaddingRight',
]);

export function isHeroHeadingBlockNodeId(nodeId: string): boolean {
  return /^template:[^:]+:hero_main(?:_\d+)?:block:heading$/.test(nodeId);
}

function fieldSortKey(path: string): number {
  const key = path.split('.').pop() ?? '';
  const rank: Record<string, number> = {
    title: 0,
    headingWidth: 1,
    headingMaxWidth: 2,
    headingTypographyPreset: 10,
    headingColor: 11,
    headingBackgroundEnabled: 20,
    headingPaddingTop: 30,
    headingPaddingBottom: 31,
    headingPaddingLeft: 32,
    headingPaddingRight: 33,
  };
  return rank[key] ?? 50;
}

export function isHeroHeadingPanelField(field: EditorFieldDef): boolean {
  const key = field.path.split('.').pop() ?? '';
  if (!HEADING_PANEL_KEYS.has(key)) return false;
  if (!/\.sections\.hero_main(?:_\d+)?\.settings\./.test(field.path)) return false;
  if (!field.group || !PANEL_GROUPS.has(field.group)) return false;
  return true;
}

export function sortHeroHeadingPanelFields(fields: EditorFieldDef[]): EditorFieldDef[] {
  const groupRank: Record<string, number> = {
    Text: 0,
    Layout: 1,
    Typography: 2,
    Appearance: 3,
    Padding: 4,
  };
  return [...fields].sort((a, b) => {
    const ga = groupRank[a.group ?? ''] ?? 9;
    const gb = groupRank[b.group ?? ''] ?? 9;
    if (ga !== gb) return ga - gb;
    return fieldSortKey(a.path) - fieldSortKey(b.path);
  });
}

export function prepareHeroHeadingSettingsNode(node: SidebarNode): SidebarNode {
  const fields = sortHeroHeadingPanelFields((node.fields ?? []).filter(isHeroHeadingPanelField));
  return { ...node, label: 'Heading', kind: 'block', fields };
}

export function heroHeadingFieldDefsFromSchema(editorSchema: EditorSchemaDoc): EditorFieldDef[] {
  const tpl = editorSchema.templates?.find((t) => t.id === 'index');
  const sec = tpl?.sections?.find((s) => s.id === 'hero_main');
  const heading = sec?.blocks?.find((b) => b.id === 'heading');
  return heading?.settingsFields ?? [];
}
