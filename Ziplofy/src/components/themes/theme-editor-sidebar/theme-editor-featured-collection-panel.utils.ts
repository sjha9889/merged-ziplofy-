import type { EditorFieldDef, SidebarNode } from './theme-editor-sidebar.types';

const PANEL_GROUPS = new Set(['Collection', 'Section layout', 'Padding', 'Custom CSS']);

const FIELD_SORT: Record<string, number> = {
  collectionHandle: 0,
  layoutType: 1,
  carouselOnMobile: 2,
  productsToShow: 3,
  columns: 4,
  mobileColumns: 5,
  horizontalGap: 6,
  verticalGap: 7,
  sectionWidth: 10,
  alignment: 11,
  sectionGap: 12,
  colorScheme: 13,
  paddingTop: 20,
  paddingBottom: 21,
  customCss: 30,
  subtitle: 40,
  showRating: 41,
  emptyMessage: 42,
};

export function isFeaturedCollectionSectionNodeId(nodeId: string): boolean {
  return /^template:[^:]+:featured_collection(?:_\d+)?$/.test(nodeId);
}

function fieldSortKey(path: string): number {
  return FIELD_SORT[path.split('.').pop() ?? ''] ?? 50;
}

export function isFeaturedCollectionPanelField(field: EditorFieldDef): boolean {
  if (!/\.sections\.featured_collection(?:_\d+)?\.settings\./.test(field.path)) return false;
  if (!field.group || !PANEL_GROUPS.has(field.group)) return false;
  return true;
}

export function sortFeaturedCollectionPanelFields(fields: EditorFieldDef[]): EditorFieldDef[] {
  const groupRank: Record<string, number> = {
    Collection: 0,
    'Section layout': 1,
    Padding: 2,
    'Custom CSS': 3,
  };
  return [...fields].sort((a, b) => {
    const ga = groupRank[a.group ?? ''] ?? 9;
    const gb = groupRank[b.group ?? ''] ?? 9;
    if (ga !== gb) return ga - gb;
    return fieldSortKey(a.path) - fieldSortKey(b.path);
  });
}

export function prepareFeaturedCollectionSettingsNode(node: SidebarNode): SidebarNode {
  const fields = sortFeaturedCollectionPanelFields((node.fields ?? []).filter(isFeaturedCollectionPanelField));
  return { ...node, label: 'Featured collection', kind: 'section', fields };
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

/** Resolve featured collection section when a block/child row is selected. */
export function findFeaturedCollectionSectionInTree(
  nodeId: string,
  tree: SidebarNode[]
): SidebarNode | null {
  if (isFeaturedCollectionSectionNodeId(nodeId)) {
    return findSidebarNodeById(tree, nodeId);
  }
  const m = nodeId.match(/^template:([^:]+):(featured_collection(?:_\d+)?)/);
  if (!m) return null;
  return findSidebarNodeById(tree, `template:${m[1]}:${m[2]}`);
}
