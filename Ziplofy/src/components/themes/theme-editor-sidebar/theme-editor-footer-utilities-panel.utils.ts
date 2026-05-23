import type { EditorFieldDef, SidebarNode } from './theme-editor-sidebar.types';
import { layoutBlueprintKey } from '../../../utils/theme-editor-insert-section';

const PANEL_GROUPS = new Set(['General', 'Padding', 'Theme settings', 'Custom CSS']);

const FIELD_SORT: Record<string, number> = {
  sectionWidth: 0,
  gap: 1,
  dividerThickness: 2,
  colorScheme: 3,
  paddingTop: 20,
  paddingBottom: 21,
  paymentIcons: 30,
  followOnShop: 31,
  customCss: 40,
};

export function isFooterUtilitiesLayoutNodeId(nodeId: string): boolean {
  const m = nodeId.match(/^layout:(footer_utilities(?:_\d+)?)$/);
  return Boolean(m && layoutBlueprintKey(m[1]) === 'footer_utilities');
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

export function findFooterUtilitiesSectionInTree(
  nodeId: string,
  tree: SidebarNode[]
): SidebarNode | null {
  if (isFooterUtilitiesLayoutNodeId(nodeId)) {
    return findSidebarNodeById(tree, nodeId);
  }
  const m = nodeId.match(/^layout:(footer_utilities(?:_\d+)?)/);
  if (!m) return null;
  return findSidebarNodeById(tree, `layout:${m[1]}`);
}

function fieldSortKey(path: string): number {
  return FIELD_SORT[path.split('.').pop() ?? ''] ?? 50;
}

export function isFooterUtilitiesPanelField(field: EditorFieldDef): boolean {
  if (!field.group || !PANEL_GROUPS.has(field.group)) return false;
  return /\.sections\.footer_utilities[^.]*\.settings\./.test(field.path);
}

export function sortFooterUtilitiesPanelFields(fields: EditorFieldDef[]): EditorFieldDef[] {
  const groupRank: Record<string, number> = {
    General: 0,
    Padding: 1,
    'Theme settings': 2,
    'Custom CSS': 3,
  };
  return [...fields].sort((a, b) => {
    const ga = groupRank[a.group ?? ''] ?? 9;
    const gb = groupRank[b.group ?? ''] ?? 9;
    if (ga !== gb) return ga - gb;
    return fieldSortKey(a.path) - fieldSortKey(b.path);
  });
}

export function prepareFooterUtilitiesSettingsNode(node: SidebarNode): SidebarNode {
  const fields = sortFooterUtilitiesPanelFields(
    (node.fields ?? []).filter(isFooterUtilitiesPanelField)
  );
  return { ...node, label: 'Utilities', kind: 'section', fields };
}

export function collectFooterUtilitiesPanelFieldDefs(
  sec: { settingsFields?: EditorFieldDef[] },
  instanceId: string,
  remap: (fields: EditorFieldDef[] | undefined, id: string) => EditorFieldDef[]
): EditorFieldDef[] {
  return remap(sec.settingsFields, instanceId);
}
