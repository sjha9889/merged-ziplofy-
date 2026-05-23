import type { EditorFieldDef, EditorSchemaDoc, SidebarNode } from './theme-editor-sidebar.types';
import { layoutBlueprintKey, remapLayoutSchemaPath } from '../../../utils/theme-editor-insert-section';

const BLOCK_PANEL_GROUPS = new Set(['Content', 'Typography']);

const BLOCK_FIELD_SORT: Record<string, number> = {
  text: 0,
  link: 1,
  font: 10,
  fontSize: 11,
  fontWeight: 12,
  letterSpacing: 13,
  textCase: 14,
};

export function isAnnouncementBlockNodeId(nodeId: string): boolean {
  return /^layout:announcement_bar(?:_\d+)?:block:announcement$/.test(nodeId);
}

export function isAnnouncementBlockFieldNodeId(nodeId: string): boolean {
  return nodeId.startsWith('field:') && nodeId.includes('.blocks.announcement.settings.');
}

export function instanceIdFromAnnouncementBlockNodeId(nodeId: string): string | null {
  const m = nodeId.match(/^layout:(announcement_bar(?:_\d+)?):block:announcement$/);
  return m ? m[1] : null;
}

export function instanceIdFromAnnouncementFieldNodeId(nodeId: string): string | null {
  const m = nodeId.match(/^field:sections\.(announcement_bar(?:_\d+)?)\.blocks\.announcement\./);
  return m ? m[1] : null;
}

/** Map preview/sidebar selection to the Announcement block row id. */
export function announcementBlockNodeIdFromSelection(nodeId: string): string | null {
  if (isAnnouncementBlockNodeId(nodeId)) return nodeId;
  const instanceId = instanceIdFromAnnouncementFieldNodeId(nodeId);
  return instanceId ? `layout:${instanceId}:block:announcement` : null;
}

export function announcementBlockFieldDefsFromSchema(
  editorSchema: EditorSchemaDoc,
  instanceId: string
): EditorFieldDef[] {
  const blueprint = layoutBlueprintKey(instanceId);
  const block = editorSchema.layout?.[blueprint]?.blocks?.find((b) => b.id === 'announcement');
  if (!block?.settingsFields?.length) return [];
  return block.settingsFields.map((f) => ({
    ...f,
    path: remapLayoutSchemaPath(f.path, instanceId),
  }));
}

export function sortAnnouncementBlockPanelFields(fields: EditorFieldDef[]): EditorFieldDef[] {
  const groupRank: Record<string, number> = { Content: 0, Typography: 1 };
  return [...fields].sort((a, b) => {
    const ga = groupRank[a.group ?? ''] ?? 9;
    const gb = groupRank[b.group ?? ''] ?? 9;
    if (ga !== gb) return ga - gb;
    const ka = BLOCK_FIELD_SORT[a.path.split('.').pop() ?? ''] ?? 50;
    const kb = BLOCK_FIELD_SORT[b.path.split('.').pop() ?? ''] ?? 50;
    return ka - kb;
  });
}

export function prepareAnnouncementBlockSettingsNode(node: SidebarNode): SidebarNode {
  const fields = sortAnnouncementBlockPanelFields(
    (node.fields ?? []).filter((f) => !f.group || BLOCK_PANEL_GROUPS.has(f.group))
  );
  return {
    ...node,
    label: 'Announcement',
    kind: 'block',
    fields,
  };
}

/** Resolve the announcement block sidebar node from a block or field selection. */
export function findAnnouncementBlockInTree(nodeId: string, tree: SidebarNode[]): SidebarNode | null {
  if (isAnnouncementBlockNodeId(nodeId)) {
    return findNodeById(tree, nodeId);
  }
  if (!isAnnouncementBlockFieldNodeId(nodeId)) return null;
  const m = nodeId.match(/^field:sections\.(announcement_bar(?:_\d+)?)\.blocks\.announcement\./);
  if (!m) return null;
  return findNodeById(tree, `layout:${m[1]}:block:announcement`);
}

function findNodeById(nodes: SidebarNode[], id: string): SidebarNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children?.length) {
      const hit = findNodeById(n.children, id);
      if (hit) return hit;
    }
  }
  return null;
}

/** Collect remapped block settings from field children for the settings sheet. */
export function announcementBlockFieldsFromNode(node: SidebarNode): EditorFieldDef[] {
  if (node.fields?.length) return node.fields;
  return (node.children ?? []).flatMap((c) => c.fields ?? []);
}
