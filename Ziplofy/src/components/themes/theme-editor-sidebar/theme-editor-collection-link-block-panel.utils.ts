import type { EditorFieldDef, SidebarNode } from './theme-editor-sidebar.types';

export function isCollectionLinkBlockField(field: EditorFieldDef): boolean {
  return (
    /\.blocks\.[^.]+\.settings\.(title|productCount|collectionHandle)$/.test(field.path) &&
    field.sidebar !== false
  );
}

export function isCollectionLinkBlockFieldsOnly(fields: EditorFieldDef[]): boolean {
  if (!fields.length) return false;
  return fields.every(isCollectionLinkBlockField);
}

export function prepareCollectionLinkBlockSettingsNode(node: SidebarNode): SidebarNode {
  const fields = [...(node.fields ?? [])].sort((a, b) => {
    const order: Record<string, number> = { title: 0, productCount: 1, collectionHandle: 2 };
    const ka = order[a.path.split('.').pop() ?? ''] ?? 9;
    const kb = order[b.path.split('.').pop() ?? ''] ?? 9;
    return ka - kb;
  });
  return { ...node, label: 'Collection link', kind: 'block', fields };
}
