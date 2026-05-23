import type { EditorFieldDef, SidebarNode } from './theme-editor-sidebar.types';

const PANEL_GROUPS = new Set([
  'Media 1',
  'Media 2',
  'Mobile media',
  'Section link',
  'Layout',
  'Appearance',
  'Padding',
  'Custom CSS',
]);

const HERO_PANEL_KEYS = new Set([
  'media1Type',
  'media1ImageUrl',
  'media2Type',
  'media2ImageUrl',
  'mobileStackMedia',
  'mobileDifferentMedia',
  'mobileImageUrl',
  'sectionLink',
  'sectionLinkNewTab',
  'direction',
  'alignTextBaseline',
  'layoutAlignment',
  'position',
  'layoutGap',
  'sectionWidth',
  'height',
  'colorScheme',
  'mediaOverlay',
  'overlayColor',
  'overlayStyle',
  'blurredReflection',
  'paddingTop',
  'paddingBottom',
  'customCss',
]);

const HEADING_SETTING_KEYS = new Set([
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

export function isHeroSectionNodeId(nodeId: string): boolean {
  return /^template:[^:]+:hero_main(?:_\d+)?$/.test(nodeId);
}

function fieldSortKey(path: string): number {
  const key = path.split('.').pop() ?? '';
  const rank: Record<string, number> = {
    media1Type: 0,
    media1ImageUrl: 1,
    media2Type: 10,
    media2ImageUrl: 11,
    mobileStackMedia: 20,
    mobileDifferentMedia: 21,
    mobileImageUrl: 22,
    sectionLink: 30,
    sectionLinkNewTab: 31,
    direction: 40,
    alignTextBaseline: 41,
    layoutAlignment: 42,
    position: 43,
    layoutGap: 44,
    sectionWidth: 45,
    height: 46,
    colorScheme: 50,
    mediaOverlay: 51,
    overlayColor: 52,
    overlayStyle: 53,
    blurredReflection: 54,
    paddingTop: 60,
    paddingBottom: 61,
    customCss: 70,
  };
  return rank[key] ?? 50;
}

export function isHeroPanelField(field: EditorFieldDef): boolean {
  const key = field.path.split('.').pop() ?? '';
  if (HEADING_SETTING_KEYS.has(key)) return false;
  if (!HERO_PANEL_KEYS.has(key)) return false;
  if (!/\.sections\.hero_main(?:_\d+)?\.settings\./.test(field.path)) return false;
  if (!field.group || !PANEL_GROUPS.has(field.group)) return false;
  return true;
}

export function sortHeroPanelFields(fields: EditorFieldDef[]): EditorFieldDef[] {
  const groupRank: Record<string, number> = {
    'Media 1': 0,
    'Media 2': 1,
    'Mobile media': 2,
    'Section link': 3,
    Layout: 4,
    Appearance: 5,
    Padding: 6,
    'Custom CSS': 7,
  };
  return [...fields].sort((a, b) => {
    const ga = groupRank[a.group ?? ''] ?? 9;
    const gb = groupRank[b.group ?? ''] ?? 9;
    if (ga !== gb) return ga - gb;
    return fieldSortKey(a.path) - fieldSortKey(b.path);
  });
}

export function prepareHeroSettingsNode(node: SidebarNode): SidebarNode {
  const fields = sortHeroPanelFields((node.fields ?? []).filter(isHeroPanelField));
  return { ...node, label: 'Hero', kind: 'section', fields };
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

export function findHeroSectionInTree(nodeId: string, tree: SidebarNode[]): SidebarNode | null {
  if (isHeroSectionNodeId(nodeId)) {
    return findSidebarNodeById(tree, nodeId);
  }
  const m = nodeId.match(/^template:([^:]+):(hero_main(?:_\d+)?)/);
  if (!m) return null;
  return findSidebarNodeById(tree, `template:${m[1]}:${m[2]}`);
}
