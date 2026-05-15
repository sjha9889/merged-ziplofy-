import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ComputerDesktopIcon,
  Cog6ToothIcon,
  DevicePhoneMobileIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import { useStore } from '../../contexts/store.context';
import { useStoreSubdomain } from '../../contexts/storeSubdomain.context';
import { useStoreThemeConfig } from '../../contexts/store-theme-config.context';
import ThemeLivePreviewFrame, { type ThemePreviewPage } from '../../components/themes/ThemeLivePreviewFrame';

type FieldType = 'text' | 'textarea' | 'color' | 'boolean';
type EditorFieldDef = { path: string; type: string; label: string };
type SidebarTab = 'sections' | 'theme-settings';

type EditorSchemaDoc = {
  globalSettings?: {
    label?: string;
    groups?: Array<{ id?: string; label?: string; fields?: EditorFieldDef[] }>;
  };
  layout?: Record<
    string,
    {
      label?: string;
      settingsFields?: EditorFieldDef[];
      blocks?: Array<{ id?: string; label?: string; settingsFields?: EditorFieldDef[] }>;
    }
  >;
  templates?: Array<{
    id: string;
    label?: string;
    sections?: Array<{
      id?: string;
      label?: string;
      settingsFields?: EditorFieldDef[];
    }>;
  }>;
};

type TreeNode = {
  id: string;
  label: string;
  kind: 'group' | 'section' | 'layout' | 'template' | 'page';
  fields?: EditorFieldDef[];
  children?: TreeNode[];
};

const PAGE_OPTIONS: { id: ThemePreviewPage; label: string }[] = [
  { id: 'index', label: 'Home page' },
  { id: 'product', label: 'Product page' },
  { id: 'cart', label: 'Cart page' },
];

function buildEditorTree(schema: EditorSchemaDoc): TreeNode[] {
  const tree: TreeNode[] = [];

  if (schema.layout) {
    const header = schema.layout.header;
    const footer = schema.layout.footer;
    if (header) {
      tree.push({
        id: 'layout:header',
        label: header.label ?? 'Header',
        kind: 'layout',
        fields: header.settingsFields,
        children: header.blocks?.map((b) => ({
          id: `layout:header:block:${b.id}`,
          label: b.label ?? b.id ?? 'Block',
          kind: 'section',
          fields: b.settingsFields,
        })),
      });
    }

    const templateSections: TreeNode[] = [];
    for (const tpl of schema.templates ?? []) {
      templateSections.push({
        id: `template:${tpl.id}`,
        label: tpl.label ?? tpl.id,
        kind: 'page',
        children: tpl.sections?.map((sec) => ({
          id: `template:${tpl.id}:${sec.id}`,
          label: sec.label ?? sec.id ?? 'Section',
          kind: 'section',
          fields: sec.settingsFields,
        })),
      });
    }
    if (templateSections.length) {
      tree.push({
        id: 'template-root',
        label: 'Template',
        kind: 'group',
        children: templateSections,
      });
    }

    if (footer) {
      tree.push({
        id: 'layout:footer',
        label: footer.label ?? 'Footer',
        kind: 'layout',
        fields: footer.settingsFields,
        children: footer.blocks?.map((b) => ({
          id: `layout:footer:block:${b.id}`,
          label: b.label ?? b.id ?? 'Block',
          kind: 'section',
          fields: b.settingsFields,
        })),
      });
    }
  } else if (schema.templates?.length) {
    for (const tpl of schema.templates) {
      tree.push({
        id: `template:${tpl.id}`,
        label: tpl.label ?? tpl.id,
        kind: 'page',
        children: tpl.sections?.map((sec) => ({
          id: `template:${tpl.id}:${sec.id}`,
          label: sec.label ?? sec.id ?? 'Section',
          kind: 'section',
          fields: sec.settingsFields,
        })),
      });
    }
  }

  return tree;
}

function buildThemeSettingsTree(schema: EditorSchemaDoc): TreeNode[] {
  if (!schema.globalSettings?.groups?.length) return [];
  return [
    {
      id: 'global',
      label: schema.globalSettings.label ?? 'Theme settings',
      kind: 'group',
      children: schema.globalSettings.groups.map((g) => ({
        id: `global:${g.id ?? g.label}`,
        label: g.label ?? g.id ?? 'Settings',
        kind: 'group',
        fields: g.fields,
      })),
    },
  ];
}

function findNode(nodes: TreeNode[], id: string): TreeNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findNode(n.children, id);
      if (found) return found;
    }
  }
  return null;
}

function fieldTypeFromSchema(type: string): FieldType {
  if (type === 'textarea') return 'textarea';
  if (type === 'boolean') return 'boolean';
  if (type === 'color') return 'color';
  return 'text';
}

function setNested(obj: Record<string, unknown>, dotKey: string, value: unknown): void {
  const parts = dotKey.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (cur[p] == null || typeof cur[p] !== 'object') cur[p] = {};
    cur = cur[p] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]] = value;
}

function collectEditorFieldPaths(schema: EditorSchemaDoc): Array<{ path: string; type: string }> {
  const paths: Array<{ path: string; type: string }> = [];
  const push = (f: EditorFieldDef) => {
    if (f.path) paths.push({ path: f.path, type: f.type });
  };
  for (const g of schema.globalSettings?.groups ?? []) {
    for (const f of g.fields ?? []) push(f);
  }
  for (const layout of Object.values(schema.layout ?? {})) {
    for (const f of layout.settingsFields ?? []) push(f);
    for (const b of layout.blocks ?? []) {
      for (const f of b.settingsFields ?? []) push(f);
    }
  }
  for (const tpl of schema.templates ?? []) {
    for (const sec of tpl.sections ?? []) {
      for (const f of sec.settingsFields ?? []) push(f);
    }
  }
  return paths;
}

function buildLivePreviewConfig(
  defaultConfig: Record<string, unknown> | null,
  values: Record<string, string | boolean>,
  editorSchema: EditorSchemaDoc | null
): Record<string, unknown> {
  if (!defaultConfig || !editorSchema) return defaultConfig ?? {};
  const config = JSON.parse(JSON.stringify(defaultConfig)) as Record<string, unknown>;
  for (const field of collectEditorFieldPaths(editorSchema)) {
    const raw = values[field.path];
    if (raw === undefined) continue;
    const type = fieldTypeFromSchema(field.type);
    setNested(config, field.path, type === 'boolean' ? Boolean(raw) : String(raw));
  }
  return config;
}

function defaultExpandedForTree(nodes: TreeNode[]): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  const walk = (list: TreeNode[]) => {
    for (const n of list) {
      out[n.id] = true;
      if (n.children) walk(n.children);
    }
  };
  walk(nodes);
  return out;
}

type SectionThemeConfigEditorProps = {
  themeId: string;
};

const SectionThemeConfigEditor: React.FC<SectionThemeConfigEditorProps> = ({ themeId }) => {
  const navigate = useNavigate();
  const { activeStoreId, stores } = useStore();
  const { storeSubdomain, getByStoreId } = useStoreSubdomain();

  const { load, saveValues, saving, loading, error: loadError } = useStoreThemeConfig();
  const [error, setError] = useState<string | null>(null);
  const [editorNotice, setEditorNotice] = useState<string | null>(null);
  const [themeName, setThemeName] = useState('');
  const [editorSchema, setEditorSchema] = useState<EditorSchemaDoc | null>(null);
  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [themeRuntime, setThemeRuntime] = useState<{ jsUrl?: string | null; cssUrl?: string | null }>({});
  const [defaultConfig, setDefaultConfig] = useState<Record<string, unknown> | null>(null);
  const [previewPage, setPreviewPage] = useState<ThemePreviewPage>('index');
  const [canPersist, setCanPersist] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('sections');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [pageMenuOpen, setPageMenuOpen] = useState(false);

  const sectionsTree = useMemo(
    () => (editorSchema ? buildEditorTree(editorSchema) : []),
    [editorSchema]
  );
  const themeSettingsTree = useMemo(
    () => (editorSchema ? buildThemeSettingsTree(editorSchema) : []),
    [editorSchema]
  );
  const activeTree = sidebarTab === 'sections' ? sectionsTree : themeSettingsTree;

  useEffect(() => {
    if (activeTree.length) {
      setExpanded(defaultExpandedForTree(activeTree));
      const firstSection = findFirstSelectableNode(activeTree);
      if (firstSection && !selectedNodeId) setSelectedNodeId(firstSection.id);
    }
  }, [activeTree, sidebarTab]);

  const hydrateEditor = useCallback(
    (data: Awaited<ReturnType<typeof load>>) => {
      if (!data) return;
      setThemeName(data.themeName);
      setEditorSchema((data.editorSchema ?? null) as EditorSchemaDoc | null);
      setValues(data.values);
      setDefaultConfig(data.defaultConfig);
      setThemeRuntime(data.themeRuntime);
      setCanPersist(data.canPersist);
      setEditorNotice(data.notice);
    },
    []
  );

  useEffect(() => {
    if (!themeId || !activeStoreId) return;
    setError(null);
    void load(activeStoreId, themeId).then(hydrateEditor);
  }, [themeId, activeStoreId, load, hydrateEditor]);

  useEffect(() => {
    if (loadError) setError(loadError);
  }, [loadError]);

  useEffect(() => {
    if (activeStoreId) getByStoreId(activeStoreId);
  }, [activeStoreId, getByStoreId]);

  const selectedNode = useMemo(
    () => findNode(activeTree, selectedNodeId),
    [activeTree, selectedNodeId]
  );

  const livePreviewConfig = useMemo(
    () => buildLivePreviewConfig(defaultConfig, values, editorSchema),
    [defaultConfig, values, editorSchema]
  );

  const activeStoreName = useMemo(
    () => stores.find((s) => s._id === activeStoreId)?.storeName ?? 'Store',
    [stores, activeStoreId]
  );

  const pageLabel = PAGE_OPTIONS.find((p) => p.id === previewPage)?.label ?? 'Home page';

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFieldChange = (path: string, type: FieldType, raw: string | boolean) => {
    setValues((prev) => ({
      ...prev,
      [path]: type === 'boolean' ? Boolean(raw) : String(raw),
    }));
  };

  const handleSave = async () => {
    if (!activeStoreId || !themeId || !canPersist) return;
    const saved = await saveValues(activeStoreId, themeId, values);
    if (saved) hydrateEditor(saved);
  };

  const renderTree = (nodes: TreeNode[], depth = 0) =>
    nodes.map((node) => {
      const hasChildren = Boolean(node.children?.length);
      const isOpen = expanded[node.id] !== false;
      const isSelected = selectedNodeId === node.id;
      const hasFields = Boolean(node.fields?.length);
      const isGroupHeader = node.kind === 'group' && depth === 0;

      return (
        <div key={node.id}>
          {isGroupHeader ? (
            <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              {node.label}
            </p>
          ) : null}
          <div
            className={`group mx-1 flex items-center gap-0.5 rounded-md text-[13px] ${
              isSelected ? 'bg-gray-100 font-medium text-gray-900' : 'text-gray-700 hover:bg-gray-50'
            }`}
            style={{ paddingLeft: `${depth * 14 + 8}px` }}
          >
            {hasChildren ? (
              <button
                type="button"
                onClick={() => toggleExpand(node.id)}
                className="flex h-7 w-6 shrink-0 items-center justify-center text-gray-400 hover:text-gray-600"
                aria-label={isOpen ? 'Collapse' : 'Expand'}
              >
                {isOpen ? (
                  <ChevronDownIcon className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRightIcon className="h-3.5 w-3.5" />
                )}
              </button>
            ) : (
              <span className="w-6 shrink-0" />
            )}
            <button
              type="button"
              className="min-h-[32px] flex-1 truncate py-1.5 pr-2 text-left"
              onClick={() => {
                if (hasFields || !hasChildren) setSelectedNodeId(node.id);
                else toggleExpand(node.id);
              }}
            >
              {node.label}
            </button>
          </div>
          {hasChildren && isOpen ? renderTree(node.children!, depth + 1) : null}
        </div>
      );
    });

  if (!activeStoreId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100">
        <p className="text-sm text-gray-600">Select a store first.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#1e1e1e]">
      {/* Top bar */}
      <header className="flex h-[3.25rem] shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-2 sm:px-3">
        <button
          type="button"
          onClick={() => navigate('/themes/all-themes')}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
          title="Exit editor"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-0.5 rounded-lg border border-gray-200 p-0.5">
          <button
            type="button"
            onClick={() => setSidebarTab('sections')}
            className={`flex h-8 w-9 items-center justify-center rounded-md ${
              sidebarTab === 'sections' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
            }`}
            title="Sections"
          >
            <Squares2X2Icon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setSidebarTab('theme-settings')}
            className={`flex h-8 w-9 items-center justify-center rounded-md ${
              sidebarTab === 'theme-settings' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
            }`}
            title="Theme settings"
          >
            <Cog6ToothIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="hidden h-6 w-px bg-gray-200 sm:block" />

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="truncate text-sm font-semibold text-gray-900">
            {themeName || 'Theme'}
          </span>
          <span className="hidden shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-800 sm:inline">
            Preview
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setPageMenuOpen((o) => !o)}
              className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              {pageLabel}
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </button>
            {pageMenuOpen ? (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-10"
                  aria-label="Close menu"
                  onClick={() => setPageMenuOpen(false)}
                />
                <ul className="absolute left-0 top-full z-20 mt-1 min-w-[160px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  {PAGE_OPTIONS.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                          previewPage === p.id ? 'font-medium text-gray-900' : 'text-gray-600'
                        }`}
                        onClick={() => {
                          setPreviewPage(p.id);
                          setPageMenuOpen(false);
                        }}
                      >
                        {p.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {storeSubdomain?.url ? (
            <a
              href={storeSubdomain.url}
              target="_blank"
              rel="noreferrer"
              className="hidden h-9 items-center gap-1 rounded-lg px-2 text-sm text-gray-600 hover:bg-gray-100 sm:flex"
              title="Open live storefront"
            >
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </a>
          ) : null}
          <div className="flex rounded-lg border border-gray-200 p-0.5">
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              className={`flex h-8 w-9 items-center justify-center rounded-md ${
                device === 'desktop' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
              }`}
              title="Desktop preview"
            >
              <ComputerDesktopIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setDevice('mobile')}
              className={`flex h-8 w-9 items-center justify-center rounded-md ${
                device === 'mobile' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
              }`}
              title="Mobile preview"
            >
              <DevicePhoneMobileIcon className="h-5 w-5" />
            </button>
          </div>
          <button
            type="button"
            disabled={saving || loading || !canPersist}
            onClick={handleSave}
            className="ml-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Left sidebar */}
        <aside className="flex w-[min(100%,320px)] shrink-0 flex-col border-r border-gray-200 bg-white sm:w-[300px]">
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <p className="p-4 text-sm text-gray-500">Loading theme…</p>
            ) : null}
            {editorNotice ? (
              <p className="mx-2 mt-2 rounded-md border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs text-amber-900">
                {editorNotice}
              </p>
            ) : null}
            {error ? <p className="p-4 text-sm text-red-600">{error}</p> : null}
            {!loading && editorSchema ? (
              <div className="pb-2 pt-1">{renderTree(activeTree)}</div>
            ) : null}
          </div>

          {selectedNode?.fields?.length ? (
            <div className="max-h-[45%] shrink-0 overflow-y-auto border-t border-gray-200 bg-gray-50/80">
              <div className="border-b border-gray-100 bg-white px-3 py-2">
                <p className="text-xs font-semibold text-gray-900">{selectedNode.label}</p>
              </div>
              <div className="space-y-3 p-3">
                {selectedNode.fields.map((field) => {
                  const type = fieldTypeFromSchema(field.type);
                  const val = values[field.path];
                  const id = `f-${field.path.replace(/\./g, '-')}`;
                  return (
                    <label key={field.path} htmlFor={id} className="block">
                      <span className="mb-1 block text-xs font-medium text-gray-600">{field.label}</span>
                      {type === 'boolean' ? (
                        <input
                          id={id}
                          type="checkbox"
                          checked={Boolean(val)}
                          onChange={(e) => handleFieldChange(field.path, type, e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      ) : type === 'textarea' ? (
                        <textarea
                          id={id}
                          rows={3}
                          value={String(val ?? '')}
                          onChange={(e) => handleFieldChange(field.path, type, e.target.value)}
                          className="w-full rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm shadow-sm focus:border-gray-400 focus:outline-none"
                        />
                      ) : type === 'color' ? (
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={String(val ?? '#000000')}
                            onChange={(e) => handleFieldChange(field.path, type, e.target.value)}
                            className="h-9 w-10 cursor-pointer rounded border border-gray-200"
                          />
                          <input
                            type="text"
                            value={String(val ?? '')}
                            onChange={(e) => handleFieldChange(field.path, type, e.target.value)}
                            className="flex-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 font-mono text-xs shadow-sm"
                          />
                        </div>
                      ) : (
                        <input
                          id={id}
                          type="text"
                          value={String(val ?? '')}
                          onChange={(e) => handleFieldChange(field.path, type, e.target.value)}
                          className="w-full rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm shadow-sm focus:border-gray-400 focus:outline-none"
                        />
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          ) : null}
        </aside>

        {/* Preview canvas */}
        <div className="flex min-w-0 flex-1 flex-col bg-[#525252] p-3 sm:p-5">
          <div className="flex min-h-0 flex-1 items-stretch justify-center">
            <div
              className={`flex min-h-0 flex-col overflow-hidden rounded-lg bg-white shadow-2xl transition-[width] duration-200 ${
                device === 'mobile' ? 'w-full max-w-[390px]' : 'h-full w-full max-w-[1600px]'
              }`}
            >
              <ThemeLivePreviewFrame
                className="min-h-0 flex-1 rounded-lg"
                storeId={activeStoreId}
                storeName={activeStoreName}
                storefrontOrigin={storeSubdomain?.url ?? null}
                jsUrl={themeRuntime.jsUrl}
                cssUrl={themeRuntime.cssUrl}
                config={livePreviewConfig}
                page={previewPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function findFirstSelectableNode(nodes: TreeNode[]): TreeNode | null {
  for (const n of nodes) {
    if (n.fields?.length) return n;
    if (n.children) {
      const found = findFirstSelectableNode(n.children);
      if (found) return found;
    }
  }
  return nodes[0] ?? null;
}

export default SectionThemeConfigEditor;
