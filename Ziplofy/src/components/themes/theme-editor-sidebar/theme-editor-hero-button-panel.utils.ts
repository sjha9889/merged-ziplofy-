import { remapTemplateHeroSchemaPath } from '../../../utils/theme-editor-insert-section';
import type { EditorFieldDef, EditorSchemaDoc, SidebarNode } from './theme-editor-sidebar.types';

const PANEL_GROUPS = new Set(['Content', 'Appearance', 'Size']);

const BUTTON_PANEL_KEYS = new Set([
  'label',
  'href',
  'openInNewTab',
  'buttonStyle',
  'desktopWidth',
  'mobileWidth',
]);

export function isHeroButtonBlockNodeId(nodeId: string): boolean {
  return /^(?:template:[^:]+:hero_main(?:_\d+)?|layout:hero_main(?:_\d+)?):block:(?:primary_button|secondary_button|button_\d+)$/.test(
    nodeId
  );
}

function fieldSortKey(path: string): number {
  const key = path.split('.').pop() ?? '';
  const rank: Record<string, number> = {
    label: 0,
    href: 1,
    openInNewTab: 2,
    buttonStyle: 10,
    desktopWidth: 11,
    mobileWidth: 12,
  };
  return rank[key] ?? 50;
}

export function isHeroButtonPanelField(field: EditorFieldDef): boolean {
  const key = field.path.split('.').pop() ?? '';
  if (!BUTTON_PANEL_KEYS.has(key)) return false;
  if (!/\.blocks\.(?:primary_button|secondary_button|button_\d+)\.settings\./.test(field.path)) return false;
  if (!/\.sections\.hero_main(?:_\d+)?\./.test(field.path)) return false;
  if (!field.group || !PANEL_GROUPS.has(field.group)) return false;
  return true;
}

export function sortHeroButtonPanelFields(fields: EditorFieldDef[]): EditorFieldDef[] {
  const groupRank: Record<string, number> = { Content: 0, Appearance: 1, Size: 2 };
  return [...fields].sort((a, b) => {
    const ga = groupRank[a.group ?? ''] ?? 9;
    const gb = groupRank[b.group ?? ''] ?? 9;
    if (ga !== gb) return ga - gb;
    return fieldSortKey(a.path) - fieldSortKey(b.path);
  });
}

export function prepareHeroButtonSettingsNode(node: SidebarNode): SidebarNode {
  const fields = sortHeroButtonPanelFields((node.fields ?? []).filter(isHeroButtonPanelField));
  return { ...node, label: 'Button', kind: 'block', fields };
}

export function heroButtonFieldDefsFromSchema(
  editorSchema: EditorSchemaDoc,
  blockId: string,
  layoutInstanceId?: string | null
): EditorFieldDef[] {
  const tpl = editorSchema.templates?.find((t) => t.id === 'index');
  const sec = tpl?.sections?.find((s) => s.id === 'hero_main');
  const sourceBlock =
    sec?.blocks?.find((b) => b.id === blockId) ??
    sec?.blocks?.find((b) => b.id === 'primary_button') ??
    sec?.blocks?.find((b) => (b.id ?? '').includes('button'));
  const sourceFields = sourceBlock?.settingsFields ?? [];
  if (!sourceFields.length) return [];

  const sourceBlockId = sourceBlock?.id ?? blockId;
  const remappedToTarget = sourceFields.map((f) => ({
    ...f,
    path:
      sourceBlockId !== blockId
        ? f.path.replace(`.blocks.${sourceBlockId}.`, `.blocks.${blockId}.`)
        : f.path,
  }));

  if (!layoutInstanceId) return remappedToTarget;
  return remappedToTarget.map((f) => ({
    ...f,
    path: remapTemplateHeroSchemaPath(f.path, layoutInstanceId),
  }));
}
