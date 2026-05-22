import { ANNOUNCEMENT_BAR_SETTINGS_FIELDS } from '../../../config/theme-editor-announcement-schema';
import type { EditorFieldDef, EditorSchemaDoc, SidebarIcon, SidebarNode } from './theme-editor-sidebar.types';
import type { ThemePreviewPage } from '../ThemeLivePreviewFrame';
import {
  defaultFooterSectionOrder,
  defaultHeaderSectionOrder,
  ensureLayoutOrder,
  getLayoutOrder,
  layoutBlueprintKey,
  remapLayoutSchemaPath,
} from '../../../utils/theme-editor-insert-section';
import {
  listKeyBlockChildren,
  listKeyFooterSections,
  listKeyHeaderSections,
  listKeyLayoutBlocks,
  listKeyLayoutSectionChildren,
  listKeySectionChildren,
  listKeyTemplateSections,
  reorderSidebarChildren,
} from './theme-editor-structure-order';

function templateIdForPage(previewPage: ThemePreviewPage): string {
  return previewPage || 'index';
}

type LayoutSectionDef = NonNullable<EditorSchemaDoc['layout']>[string];
type BlockDef = NonNullable<LayoutSectionDef['blocks']>[number];

function announcementBarSettingsFields(): EditorFieldDef[] {
  return ANNOUNCEMENT_BAR_SETTINGS_FIELDS;
}

function iconForFieldLabel(label: string, path: string, type: string): SidebarIcon {
  const key = `${label} ${path} ${type}`.toLowerCase();
  if (key.includes('media') || key.includes('image') || key.includes('showmedia')) return 'image';
  if (key.includes('price') || key.includes('showprice')) return 'price';
  if (key.includes('button') || key.includes('viewall')) return 'button';
  if (key.includes('product card') || key.includes('product-card')) return 'product-card';
  if (key.includes('title') || key.includes('heading') || key.includes('eyebrow') || key.includes('collection')) return 'text';
  if (key.includes('menu') || key.includes('logo') || key.includes('tagline')) return 'text';
  return 'default';
}

function iconForBlockLabel(label: string): SidebarIcon {
  const l = label.toLowerCase();
  if (l.includes('product card') || l.includes('product')) return 'product-card';
  if (l.includes('button')) return 'button';
  if (l.includes('header')) return 'text';
  if (l.includes('media') || l.includes('image')) return 'image';
  if (l.includes('price')) return 'price';
  return 'section';
}

function fieldPreview(field: EditorFieldDef, values: Record<string, string | boolean>): string | undefined {
  const raw = values[field.path];
  if (raw === undefined || raw === null || raw === '') return undefined;
  if (field.type === 'boolean') return undefined;
  const text = String(raw).trim();
  if (!text) return undefined;
  return text.length > 28 ? `${text.slice(0, 28)}…` : text;
}

function remapFields(
  fields: EditorFieldDef[] | undefined,
  instanceId: string
): EditorFieldDef[] {
  if (!fields?.length) return [];
  const blueprint = layoutBlueprintKey(instanceId);
  if (blueprint === instanceId) return fields;
  return fields.map((field) => ({
    ...field,
    path: remapLayoutSchemaPath(field.path, instanceId),
  }));
}

function remapBlockDef(block: BlockDef, instanceId: string): BlockDef {
  const settingsFields = remapFields(block.settingsFields, instanceId);
  return {
    ...block,
    settingsFields: settingsFields.length ? settingsFields : undefined,
    blocks: block.blocks?.map((child) => remapBlockDef(child, instanceId)),
  };
}

/** Leaf field rows under a section or block (Shopify-style). */
function mapFieldNodes(
  fields: EditorFieldDef[] | undefined,
  values: Record<string, string | boolean>
): SidebarNode[] {
  const visible = (fields ?? []).filter((f) => f.sidebar !== false);
  if (!visible.length) return [];
  return visible.map((field) => ({
    id: `field:${field.path}`,
    label: field.label,
    kind: 'field' as const,
    icon: iconForFieldLabel(field.label, field.path, field.type),
    fields: [field],
    preview: fieldPreview(field, values),
  }));
}

function blockChildren(
  block: BlockDef,
  prefix: string,
  blockId: string,
  values: Record<string, string | boolean>,
  itemOrder: Record<string, string[]>
): { children: SidebarNode[]; childrenListKey: string } {
  const blockPrefix = `${prefix}:block:${blockId}`;
  const childrenListKey = listKeyBlockChildren(blockPrefix);
  const innerAddBlockId = `${blockPrefix}:inner-add-block`;

  const fieldNodes = mapFieldNodes(block.settingsFields, values);
  const nestedListKey = listKeyBlockChildren(`${blockPrefix}:nested`);
  const nestedBlocks: SidebarNode[] = (block.blocks ?? []).map((child) => {
    const nestedId = child.id ?? child.label ?? 'nested';
    const nestedPrefix = `${blockPrefix}:nested:${nestedId}`;
    const nestedFields = mapFieldNodes(child.settingsFields, values);
    return {
      id: nestedPrefix,
      label: child.label ?? nestedId,
      kind: 'block' as const,
      icon: iconForBlockLabel(child.label ?? nestedId),
      children: nestedFields.length ? nestedFields : undefined,
      childrenListKey: listKeyBlockChildren(nestedPrefix),
    };
  });
  const orderedNested = reorderSidebarChildren(nestedBlocks, nestedListKey, itemOrder);

  const addBlockRow: SidebarNode = { id: innerAddBlockId, label: 'Add block', kind: 'add-block' };
  const merged = reorderSidebarChildren(
    [addBlockRow, ...fieldNodes, ...orderedNested, addBlockRow],
    childrenListKey,
    itemOrder
  );

  return { children: merged, childrenListKey };
}

/** Section blocks with expandable field children under each block. */
function mapBlockNodes(
  blocks: BlockDef[],
  prefix: string,
  sectionAddBlockId: string,
  values: Record<string, string | boolean>,
  itemOrder: Record<string, string[]>,
  blocksListKey: string
): SidebarNode[] {
  const blockNodes: SidebarNode[] = blocks.map((block) => {
    const blockId = block.id ?? block.label ?? 'block';
    const { children, childrenListKey } = blockChildren(block, prefix, blockId, values, itemOrder);

    return {
      id: `${prefix}:block:${blockId}`,
      label: block.label ?? blockId,
      kind: 'block' as const,
      icon: iconForBlockLabel(block.label ?? blockId),
      showVisibilityToggle: (block.label ?? '').toLowerCase().includes('product card'),
      children: children.length ? children : undefined,
      childrenListKey,
    };
  });

  const addBlock: SidebarNode = { id: sectionAddBlockId, label: 'Add block', kind: 'add-block' };
  return reorderSidebarChildren([...blockNodes, addBlock], blocksListKey, itemOrder);
}

function layoutSectionNode(
  instanceId: string,
  sec: LayoutSectionDef,
  values: Record<string, string | boolean>,
  itemOrder: Record<string, string[]>
): SidebarNode {
  const id = `layout:${instanceId}`;
  const blueprint = layoutBlueprintKey(instanceId);
  const baseFields =
    blueprint === 'announcement_bar' ? announcementBarSettingsFields() : sec.settingsFields;
  const remappedFields = remapFields(baseFields, instanceId);
  const remappedBlocks = sec.blocks?.map((b) => remapBlockDef(b, instanceId));
  const previewField = remappedFields.find((f) => f.type === 'text' || f.type === 'textarea');
  const isAnnouncement = blueprint === 'announcement_bar';

  const sectionFields = isAnnouncement ? [] : mapFieldNodes(remappedFields, values);
  const blockNodes = remappedBlocks?.length
    ? mapBlockNodes(remappedBlocks, id, `${id}:add-block`, values, itemOrder, listKeyLayoutBlocks(instanceId))
    : [];

  const layoutChildrenKey = listKeyLayoutSectionChildren(instanceId);
  const children = reorderSidebarChildren(
    [...sectionFields, ...blockNodes],
    layoutChildrenKey,
    itemOrder
  );

  return {
    id,
    label: sec.label ?? instanceId,
    kind: 'section',
    icon: 'section',
    fields: remappedFields.length ? remappedFields : undefined,
    preview: previewField ? fieldPreview(previewField, values) : undefined,
    children: children.length ? children : undefined,
    childrenListKey: layoutChildrenKey,
    showVisibilityToggle: isAnnouncement,
  };
}

function sectionToNode(
  sec: NonNullable<NonNullable<EditorSchemaDoc['templates']>[0]['sections']>[0],
  tplId: string,
  values: Record<string, string | boolean>,
  itemOrder: Record<string, string[]>
): SidebarNode {
  const secId = sec.id ?? 'section';
  const prefix = `template:${tplId}:${secId}`;
  const childrenListKey = listKeySectionChildren(tplId, secId);

  const sectionFields = mapFieldNodes(sec.settingsFields, values);
  const blockNodes = sec.blocks?.length
    ? mapBlockNodes(sec.blocks, prefix, `${prefix}:add-block`, values, itemOrder, childrenListKey)
    : [];

  const children = reorderSidebarChildren(
    [...sectionFields, ...blockNodes],
    childrenListKey,
    itemOrder
  );

  const previewField = sec.settingsFields?.find((f) => f.type === 'text' || f.type === 'textarea');

  const remappedSectionFields = remapFields(sec.settingsFields, secId);

  return {
    id: prefix,
    label: sec.label ?? secId,
    kind: 'section',
    icon: 'section',
    fields: remappedSectionFields.length ? remappedSectionFields : undefined,
    preview: previewField ? fieldPreview(previewField, values) : undefined,
    children: children.length ? children : undefined,
    childrenListKey,
    showVisibilityToggle: sec.type === 'featured-collection',
  };
}

/** Shopify-style sidebar: Header / Template / Footer groups; collapsed by default. */
export function buildShopifySidebarTree(
  schema: EditorSchemaDoc,
  values: Record<string, string | boolean>,
  previewPage: ThemePreviewPage,
  itemOrder: Record<string, string[]> = {},
  config: Record<string, unknown> | null = null
): SidebarNode[] {
  const tree: SidebarNode[] = [];
  const templateId = templateIdForPage(previewPage);
  const layout = schema.layout ?? {};
  const cfg = config ?? {};

  if (config) ensureLayoutOrder(cfg as Record<string, unknown>);
  const layoutOrder = config ? getLayoutOrder(cfg as Record<string, unknown>) : {};

  const headerOrder =
    layoutOrder.header ??
    (config ? defaultHeaderSectionOrder(cfg as Record<string, unknown>) : ['announcement_bar', 'header']);

  const headerNodes: SidebarNode[] = [];
  for (const instanceId of headerOrder) {
    const blueprint = layoutBlueprintKey(instanceId);
    const sec = layout[blueprint];
    if (sec) headerNodes.push(layoutSectionNode(instanceId, sec, values, itemOrder));
  }
  const headerChildren = reorderSidebarChildren(
    [...headerNodes, { id: 'layout:add-section', label: 'Add section', kind: 'add-section' }],
    listKeyHeaderSections(),
    itemOrder
  );

  if (headerChildren.length > 1) {
    tree.push({
      id: 'group:header',
      label: 'Header',
      kind: 'group-label',
      children: headerChildren,
      childrenListKey: listKeyHeaderSections(),
    });
  }

  const tpl = schema.templates?.find((t) => t.id === templateId) ?? schema.templates?.[0];
  const tplSectionsListKey = listKeyTemplateSections(templateId);
  if (tpl?.sections?.length) {
    const sectionNodes = tpl.sections.map((sec) => sectionToNode(sec, tpl.id, values, itemOrder));
    tree.push({
      id: 'group:template',
      label: 'Template',
      kind: 'group-label',
      children: [
        ...reorderSidebarChildren(sectionNodes, tplSectionsListKey, itemOrder),
        { id: `template:${templateId}:add-section`, label: 'Add section', kind: 'add-section' },
      ],
      childrenListKey: tplSectionsListKey,
    });
  }

  const footerOrder =
    layoutOrder.footer ??
    (config ? defaultFooterSectionOrder(cfg as Record<string, unknown>) : ['footer', 'footer_utilities']);

  const footerNodes: SidebarNode[] = [];
  for (const instanceId of footerOrder) {
    const blueprint = layoutBlueprintKey(instanceId);
    const sec = layout[blueprint];
    if (sec) footerNodes.push(layoutSectionNode(instanceId, sec, values, itemOrder));
  }
  const footerChildren = reorderSidebarChildren(
    [
      { id: 'layout:footer-group:add-section', label: 'Add section', kind: 'add-section' },
      ...footerNodes,
    ],
    listKeyFooterSections(),
    itemOrder
  );

  if (footerChildren.length > 1) {
    tree.push({
      id: 'group:footer',
      label: 'Footer',
      kind: 'group-label',
      children: footerChildren,
      childrenListKey: listKeyFooterSections(),
    });
  }

  return tree;
}

export function buildThemeSettingsSidebarTree(schema: EditorSchemaDoc): SidebarNode[] {
  const groups = schema.globalSettings?.groups ?? [];
  if (!groups.length) return [];

  return [
    {
      id: 'group:theme-settings',
      label: schema.globalSettings?.label ?? 'Theme settings',
      kind: 'group-label',
      children: groups.map((g) => ({
        id: `global:${g.id ?? g.label}`,
        label: g.label ?? g.id ?? 'Settings',
        kind: 'section' as const,
        icon: 'default' as const,
        fields: g.fields,
      })),
    },
  ];
}

export function findSidebarNode(nodes: SidebarNode[], id: string): SidebarNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findSidebarNode(n.children, id);
      if (found) return found;
    }
  }
  return null;
}

/** Root-to-target ids for expanding the sidebar tree to reveal a selection. */
export function findSidebarNodePath(
  nodes: SidebarNode[],
  targetId: string,
  trail: string[] = []
): string[] | null {
  for (const n of nodes) {
    const next = [...trail, n.id];
    if (n.id === targetId) return next;
    if (n.children?.length) {
      const found = findSidebarNodePath(n.children, targetId, next);
      if (found) return found;
    }
  }
  return null;
}

/** Expand every ancestor (and branch targets) so a deep preview click reveals the matching row. */
export function expandedIdsFromSidebarTree(
  nodeId: string,
  tree: SidebarNode[]
): Record<string, boolean> {
  const path = findSidebarNodePath(tree, nodeId);
  if (!path?.length) return {};

  const out: Record<string, boolean> = {};
  const target = findSidebarNode(tree, nodeId);

  for (let i = 0; i < path.length - 1; i++) {
    out[path[i]!] = true;
  }

  if (target?.children?.length) {
    out[nodeId] = true;
  }

  return out;
}

/** Collapsed by default — matches Shopify editor (expand sections to see blocks). */
export function defaultExpandedSidebar(_nodes: SidebarNode[]): Record<string, boolean> {
  return {};
}

export function resolveAddBlockSectionLabel(nodeId: string, tree: SidebarNode[]): string {
  const parentId = nodeId.replace(/:inner-add-block$/, '').replace(/:add-block$/, '');
  const parent = findSidebarNode(tree, parentId);
  if (parent && parent.kind !== 'add-block' && parent.kind !== 'add-section') {
    return parent.label;
  }
  const section = findSidebarNode(tree, parentId.split(':block:')[0] ?? parentId);
  return section?.label ?? 'Section';
}

export function firstSelectableSidebarNode(nodes: SidebarNode[]): SidebarNode | null {
  for (const n of nodes) {
    if (n.fields?.length) return n;
    if (n.children) {
      const found = firstSelectableSidebarNode(n.children);
      if (found) return found;
    }
  }
  return null;
}

/** When a block has field children but no direct fields, aggregate for the settings panel. */
export function settingsNodeForSelection(node: SidebarNode | null): SidebarNode | null {
  if (!node) return null;
  if (node.kind === 'add-block' || node.kind === 'add-section') return null;
  if (node.kind === 'section' && node.fields?.length) return node;
  if (node.fields?.length) return node;
  if (node.kind === 'block' && node.children?.length) {
    const fieldRows = node.children.filter((c) => c.kind === 'field' && c.fields?.length);
    if (fieldRows.length === 1) return fieldRows[0];
    if (fieldRows.length > 1) {
      return {
        ...node,
        fields: fieldRows.flatMap((c) => c.fields ?? []),
      };
    }
  }
  return null;
}
