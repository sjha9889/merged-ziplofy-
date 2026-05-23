import type { EditorFieldDef, SidebarNode } from './theme-editor-sidebar.types';
import { layoutBlueprintKey } from '../../../utils/theme-editor-insert-section';

const PANEL_GROUPS = new Set(['General', 'Padding', 'Custom CSS']);

const FIELD_SORT: Record<string, number> = {
  sectionWidth: 0,
  gap: 1,
  colorScheme: 2,
  paddingTop: 20,
  paddingBottom: 21,
  customCss: 30,
};

export function isFooterLayoutNodeId(nodeId: string): boolean {
  const m = nodeId.match(/^layout:(footer(?:_\d+)?)$/);
  return Boolean(m && layoutBlueprintKey(m[1]) === 'footer');
}

function findSidebarNodeById(nodes: SidebarNode[], id: string): SidebarNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children?.length) {
      const hit = findSidebarNodeById(n.children, id);
      if (hit) return hit;
    }
  }
  return null;
}

export function findFooterSectionInTree(nodeId: string, tree: SidebarNode[]): SidebarNode | null {
  if (isFooterLayoutNodeId(nodeId)) {
    return findSidebarNodeById(tree, nodeId);
  }
  const m = nodeId.match(/^layout:(footer(?:_\d+)?)/);
  if (!m) return null;
  return findSidebarNodeById(tree, `layout:${m[1]}`);
}

function fieldSortKey(path: string): number {
  return FIELD_SORT[path.split('.').pop() ?? ''] ?? 50;
}

export function isFooterPanelField(field: EditorFieldDef): boolean {
  if (!field.group || !PANEL_GROUPS.has(field.group)) return false;
  return /\.sections\.footer(?!_utilities)[^.]*\.settings\./.test(field.path);
}

export function sortFooterPanelFields(fields: EditorFieldDef[]): EditorFieldDef[] {
  const groupRank: Record<string, number> = {
    General: 0,
    Padding: 1,
    'Custom CSS': 2,
  };
  return [...fields].sort((a, b) => {
    const ga = groupRank[a.group ?? ''] ?? 9;
    const gb = groupRank[b.group ?? ''] ?? 9;
    if (ga !== gb) return ga - gb;
    return fieldSortKey(a.path) - fieldSortKey(b.path);
  });
}

export function prepareFooterSettingsNode(node: SidebarNode): SidebarNode {
  const fields = sortFooterPanelFields((node.fields ?? []).filter(isFooterPanelField));
  return { ...node, label: 'Footer', kind: 'section', fields };
}

export function collectFooterPanelFieldDefs(
  sec: { settingsFields?: EditorFieldDef[] },
  instanceId: string,
  remap: (fields: EditorFieldDef[] | undefined, id: string) => EditorFieldDef[]
): EditorFieldDef[] {
  return remap(sec.settingsFields, instanceId);
}
