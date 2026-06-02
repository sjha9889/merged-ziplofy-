import {
  remapTemplateHeroSchemaPath,
  remapTemplateSchemaPath,
} from '../../../utils/theme-editor-insert-section';
import type { EditorFieldDef, EditorSchemaDoc, SidebarNode } from './theme-editor-sidebar.types';

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
  'overlayGradientDirection',
  'blurredReflection',
  'paddingTop',
  'paddingBottom',
  'customCss',
]);

export const HERO_PANEL_GROUP_ORDER = [
  'Media 1',
  'Media 2',
  'Mobile media',
  'Section link',
  'Layout',
  'Appearance',
  'Padding',
  'Custom CSS',
] as const;

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
  return (
    /^template:[^:]+:hero_main(?:_\d+)?$/.test(nodeId) ||
    /^layout:hero_main(?:_\d+)?$/.test(nodeId)
  );
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
    overlayGradientDirection: 54,
    blurredReflection: 55,
    paddingTop: 60,
    paddingBottom: 61,
    customCss: 70,
  };
  return rank[key] ?? 50;
}

export function isHeroSettingsPath(path: string): boolean {
  return (
    /\.sections\.hero_main(?:_\d+)?\.settings\./.test(path) ||
    /^sections\.hero_main(?:_\d+)?\.settings\./.test(path)
  );
}

export function isHeroPanelField(field: EditorFieldDef): boolean {
  const key = field.path.split('.').pop() ?? '';
  if (HEADING_SETTING_KEYS.has(key)) return false;
  if (!HERO_PANEL_KEYS.has(key)) return false;
  if (!isHeroSettingsPath(field.path)) return false;
  if (!field.group || !PANEL_GROUPS.has(field.group)) return false;
  return true;
}

export function enrichHeroPanelField(field: EditorFieldDef): EditorFieldDef {
  const key = field.path.split('.').pop() ?? '';
  if (key === 'media1ImageUrl' || key === 'media2ImageUrl' || key === 'mobileImageUrl') {
    return { ...field, widget: 'image', label: key === 'mobileImageUrl' ? 'Mobile image' : 'Image' };
  }
  if (
    key === 'mobileStackMedia' ||
    key === 'mobileDifferentMedia' ||
    key === 'alignTextBaseline' ||
    key === 'sectionLinkNewTab' ||
    key === 'mediaOverlay' ||
    key === 'blurredReflection'
  ) {
    return { ...field, widget: 'toggle' };
  }
  if (key === 'overlayColor') {
    return { ...field, widget: 'color' };
  }
  if (key === 'media1Type' || key === 'media2Type' || key === 'overlayGradientDirection') {
    return { ...field, widget: 'segmented' };
  }
  if (key === 'overlayStyle' && !field.widget) {
    return { ...field, widget: 'segmented' };
  }
  if (key === 'customCss') {
    return { ...field, widget: 'accordion' };
  }
  if (
    (key === 'direction' || key === 'layoutAlignment' || key === 'sectionWidth') &&
    !field.widget
  ) {
    return { ...field, widget: 'segmented' };
  }
  if ((key === 'position' || key === 'height') && !field.widget) {
    return { ...field, widget: 'select-inline' };
  }
  return field;
}

export function enrichHeroPanelFields(fields: EditorFieldDef[]): EditorFieldDef[] {
  return fields.map(enrichHeroPanelField);
}

/** Hero section settings from index template schema (layout + template instances). */
export function heroSectionFieldDefsFromSchema(
  editorSchema: EditorSchemaDoc,
  nodeId: string
): EditorFieldDef[] {
  const tplHero = editorSchema.templates?.find((t) => t.id === 'index')?.sections?.find((s) => s.id === 'hero_main');
  const raw = tplHero?.settingsFields ?? [];
  if (!raw.length) return [];

  const layout = nodeId.match(/^layout:(hero_main(?:_\d+)?)$/);
  if (layout) {
    return raw.map((f) => ({
      ...f,
      path: remapTemplateHeroSchemaPath(f.path, layout[1]),
    }));
  }

  const tpl = nodeId.match(/^template:([^:]+):(hero_main(?:_\d+)?)$/);
  if (tpl) {
    const [, tplId, instanceId] = tpl;
    return raw.map((f) => ({
      ...f,
      path: remapTemplateSchemaPath(f.path, tplId, instanceId),
    }));
  }

  return raw;
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
  const fields = enrichHeroPanelFields(
    sortHeroPanelFields((node.fields ?? []).filter(isHeroPanelField))
  );
  return { ...node, label: node.label || 'Hero', kind: 'section', fields };
}

/** Shopify-style section panel for Hero: Bottom aligned (Media 1 → Custom CSS). */
export function prepareHeroBottomAlignedSettingsNode(node: SidebarNode): SidebarNode {
  const fields = enrichHeroPanelFields(
    sortHeroPanelFields((node.fields ?? []).filter(isHeroPanelField))
  );
  return { ...node, label: 'Hero: Bottom aligned', kind: 'section', fields };
}

export function isHeroBottomAlignedSidebarSection(node: SidebarNode | null): boolean {
  return node?.label === 'Hero: Bottom aligned';
}

export function isHeroMarqueeSidebarSection(node: SidebarNode | null): boolean {
  return node?.label === 'Hero: Marquee';
}

export function isHeroLargeLogoSidebarSection(node: SidebarNode | null): boolean {
  return node?.label === 'Large logo';
}

export function isHeroSplitShowcaseSidebarSection(node: SidebarNode | null): boolean {
  return node?.label === 'Split showcase';
}

export { prepareSplitShowcaseSettingsNode as prepareHeroSplitShowcaseSettingsNode } from './theme-editor-split-showcase-panel.utils';

/** Shopify-style section panel for Hero: Marquee (Media 1 → Custom CSS). */
export function prepareHeroMarqueeSettingsNode(node: SidebarNode): SidebarNode {
  const fields = enrichHeroPanelFields(
    sortHeroPanelFields((node.fields ?? []).filter(isHeroPanelField))
  );
  return { ...node, label: 'Hero: Marquee', kind: 'section', fields };
}

export { prepareLargeLogoSettingsNode as prepareHeroLargeLogoSettingsNode } from './theme-editor-large-logo-panel.utils';

export function isHeroSettingsPanelFields(fields: EditorFieldDef[]): boolean {
  if (!fields.length) return false;
  return fields.every(isHeroPanelField);
}

/** Group hero panel fields in Shopify editor order (Media 1 → Custom CSS). */
export function groupHeroPanelFields(
  fields: EditorFieldDef[]
): Map<string, EditorFieldDef[]> {
  const sorted = sortHeroPanelFields(enrichHeroPanelFields(fields.filter(isHeroPanelField)));
  const map = new Map<string, EditorFieldDef[]>();
  for (const field of sorted) {
    const group = field.group ?? 'Settings';
    const list = map.get(group) ?? [];
    list.push(field);
    map.set(group, list);
  }
  return map;
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
  const tpl = nodeId.match(/^template:([^:]+):(hero_main(?:_\d+)?)/);
  if (tpl) return findSidebarNodeById(tree, `template:${tpl[1]}:${tpl[2]}`);
  const layout = nodeId.match(/^layout:(hero_main(?:_\d+)?):/);
  if (layout) return findSidebarNodeById(tree, `layout:${layout[1]}`);
  return null;
}
