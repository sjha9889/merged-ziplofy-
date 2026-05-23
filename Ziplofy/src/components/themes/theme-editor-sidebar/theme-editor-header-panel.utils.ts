import type { EditorFieldDef, SidebarNode } from './theme-editor-sidebar.types';
import { layoutBlueprintKey } from '../../../utils/theme-editor-insert-section';

/** Groups shown in the Header bottom settings sheet (Shopify-style). */
const HEADER_PANEL_GROUPS = new Set([
  'Logo',
  'Menu',
  'Customer account',
  'Search',
  'Localization',
  'Appearance',
  'Utilities',
  'Colors',
  'Page backgrounds',
  'Theme settings',
  'Custom CSS',
]);

const LAYOUT_ONLY_BLOCK_KEYS = new Set(['position', 'row']);

const FIELD_SORT: Record<string, number> = {
  position: 0,
  row: 1,
  menu: 10,
  searchIcon: 20,
  searchPosition: 21,
  searchRow: 22,
  searchPlaceholder: 23,
  customerAccountMenu: 30,
  countryRegionEnabled: 40,
  showFlag: 41,
  languageSelectorEnabled: 42,
  localizationFont: 43,
  localizationSize: 44,
  localizationPosition: 45,
  localizationRow: 46,
  sectionWidth: 50,
  headerHeight: 51,
  stickyMode: 52,
  borderThickness: 53,
  menuStyle: 60,
  colorScheme: 70,
  homeTransparentBackground: 80,
  productTransparentBackground: 81,
  collectionTransparentBackground: 82,
  defaultLogoUrl: 90,
  cartType: 91,
  productTitleCase: 92,
  emptyCartLink: 93,
  cartDrawerAutoOpen: 94,
  customCss: 100,
};

export function isHeaderLayoutNodeId(nodeId: string): boolean {
  const m = nodeId.match(/^layout:(header(?:_\d+)?)$/);
  return Boolean(m && layoutBlueprintKey(m[1]) === 'header');
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

/** Resolve layout header section node when a child row (block, field) is selected. */
export function findHeaderSectionInTree(nodeId: string, tree: SidebarNode[]): SidebarNode | null {
  if (isHeaderLayoutNodeId(nodeId)) {
    return findSidebarNodeById(tree, nodeId);
  }
  const m = nodeId.match(/^layout:(header(?:_\d+)?)/);
  if (!m) return null;
  return findSidebarNodeById(tree, `layout:${m[1]}`);
}

function fieldSortKey(path: string): number {
  return FIELD_SORT[path.split('.').pop() ?? ''] ?? 50;
}

function isHeaderPanelField(field: EditorFieldDef): boolean {
  if (!field.group || !HEADER_PANEL_GROUPS.has(field.group)) return false;
  const key = field.path.split('.').pop() ?? '';
  if (field.path.includes('.blocks.logo.') && !LAYOUT_ONLY_BLOCK_KEYS.has(key)) {
    if (key === 'text' || key === 'tagline') return false;
  }
  if (field.path.includes('.blocks.menu.settings.items')) return false;
  if (field.path.includes('.blocks.menu.blocks.')) return false;
  if (key === 'text' || key === 'tagline' || key === 'label' || key === 'href') return false;
  return true;
}

export function sortHeaderPanelFields(fields: EditorFieldDef[]): EditorFieldDef[] {
  const groupRank: Record<string, number> = {
    Logo: 0,
    Menu: 1,
    'Customer account': 2,
    Search: 3,
    Localization: 4,
    Appearance: 5,
    Utilities: 6,
    Colors: 7,
    'Page backgrounds': 8,
    'Theme settings': 9,
    'Custom CSS': 10,
  };
  return [...fields].sort((a, b) => {
    const ga = groupRank[a.group ?? ''] ?? 99;
    const gb = groupRank[b.group ?? ''] ?? 99;
    if (ga !== gb) return ga - gb;
    return fieldSortKey(a.path) - fieldSortKey(b.path);
  });
}

export function prepareHeaderSettingsNode(node: SidebarNode): SidebarNode {
  const fields = sortHeaderPanelFields((node.fields ?? []).filter(isHeaderPanelField));
  return { ...node, label: 'Header', kind: 'section', fields };
}

export function isHeaderLogoBlockNodeId(nodeId: string): boolean {
  return /^layout:header(?:_\d+)?:block:logo$/.test(nodeId);
}

export function isHeaderMenuBlockNodeId(nodeId: string): boolean {
  return /^layout:header(?:_\d+)?:block:menu$/.test(nodeId);
}

export function prepareHeaderLogoBlockSettingsNode(node: SidebarNode): SidebarNode {
  const fields = (node.fields ?? []).filter((f) => {
    const key = f.path.split('.').pop() ?? '';
    return key === 'text' || key === 'tagline';
  });
  return { ...node, label: 'Logo', fields };
}

export function prepareHeaderMenuBlockSettingsNode(node: SidebarNode): SidebarNode {
  const fields = (node.fields ?? []).filter((f) => f.group === 'Menu');
  return { ...node, label: 'Menu', fields };
}

/** Section + logo/menu layout fields for the Header settings sheet. */
export function collectHeaderPanelFieldDefs(
  sec: { settingsFields?: EditorFieldDef[]; blocks?: Array<{ id?: string; settingsFields?: EditorFieldDef[] }> },
  instanceId: string,
  remap: (fields: EditorFieldDef[] | undefined, id: string) => EditorFieldDef[]
): EditorFieldDef[] {
  const out: EditorFieldDef[] = [...remap(sec.settingsFields, instanceId)];
  for (const block of sec.blocks ?? []) {
    if (block.id !== 'logo' && block.id !== 'menu') continue;
    for (const f of remap(block.settingsFields, instanceId)) {
      const key = f.path.split('.').pop() ?? '';
      if (key === 'position' || key === 'row') out.push(f);
    }
  }
  return out;
}
