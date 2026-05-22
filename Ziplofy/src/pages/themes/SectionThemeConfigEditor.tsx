import React, { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './theme-editor-chrome.css';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowTopRightOnSquareIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';
import { useStore } from '../../contexts/store.context';
import { useStoreSubdomain } from '../../contexts/storeSubdomain.context';
import { useStoreThemeConfig } from '../../contexts/store-theme-config.context';
import ThemeLivePreviewFrame, { type ThemePreviewPage } from '../../components/themes/ThemeLivePreviewFrame';
import { AddBlockModal } from '../../components/themes/theme-editor-sidebar/AddBlockModal';
import { AddSectionModal } from '../../components/themes/theme-editor-sidebar/AddSectionModal';
import {
  resolveAddSectionGroup,
  resolveSectionCatalogGroupFromNodeId,
  type SectionCatalogItem,
  type SectionInsertContext,
} from '../../components/themes/theme-editor-sidebar/add-section-catalog';
import ThemeEditorSidebar from '../../components/themes/theme-editor-sidebar/ThemeEditorSidebar';
import type { BlockCatalogItem } from '../../components/themes/theme-editor-sidebar/add-block-catalog';
import type { ThemeBlockCatalogApi } from '../../components/themes/theme-editor-sidebar/theme-block-catalog.adapter';
import ThemeEditorPagePicker from '../../components/themes/ThemeEditorPagePicker';
import { findPageMenuItemByPreview, buildThemeEditorPageMenu } from '../../utils/theme-editor-page-menu';
import {
  buildThemeEditorSelectionHints,
  expandedIdsForPreviewNode,
} from '../../utils/theme-editor-selection-hints';
import type {
  EditorFieldDef,
  EditorSchemaDoc,
  ThemeEditorSidebarTab,
} from '../../components/themes/theme-editor-sidebar/theme-editor-sidebar.types';
import {
  applyStructureOrderToConfig,
  mergeItemOrder,
  readStructureOrderFromConfig,
} from '../../components/themes/theme-editor-sidebar/theme-editor-structure-order';
import {
  buildShopifySidebarTree,
  buildThemeSettingsSidebarTree,
  defaultExpandedSidebar,
  findSidebarNode,
  firstSelectableSidebarNode,
  resolveAddBlockSectionLabel,
  settingsNodeForSelection,
} from '../../components/themes/theme-editor-sidebar/theme-editor-sidebar.tree';
import { axiosi } from '../../config/axios.config';
import {
  getStaticDevPackId,
  isThemeEditorStaticMode,
  setStaticDevPackId,
  THEME_EDITOR_STATIC_CONFIG,
  displayNameForDevPack,
  type DevStaticThemePackId,
} from '../../config/theme-editor-static.config';
import { DevThemePackSwitcher } from '../../components/themes/DevThemePackSwitcher';
import { EditorBlockingOverlay } from '../../components/themes/EditorPreviewStatus';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useRafBatchedCounter } from '../../hooks/useRafBatchedState';
import { applyValuesToThemeConfig, flattenSchemaFieldPaths } from '../../utils/theme-editor-config.utils';
import {
  extendValuesForLayoutInstance,
  getLayoutOrder,
  insertSectionFromCatalog,
  layoutBlueprintKey,
  pruneValuesForLayoutInstance,
  removeLayoutSection,
} from '../../utils/theme-editor-insert-section';
import { mergedConfigFromFormValues } from '../../utils/theme-editor-static-save';
import { saveStaticThemeConfigLocal } from '../../utils/theme-editor-static-pack';
import {
  fieldTypeFromSchema,
  type ThemeEditorFieldType,
} from '../../components/themes/theme-editor-sidebar/theme-editor-field.utils';

type FieldType = ThemeEditorFieldType;

type SectionThemeConfigEditorProps = {
  themeId: string;
  /** When true, editor is on the static dev pack (no production API save). */
  staticDevMode?: boolean;
};

const SectionThemeConfigEditor: React.FC<SectionThemeConfigEditorProps> = ({
  themeId,
  staticDevMode = isThemeEditorStaticMode(),
}) => {
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
  const [manifest, setManifest] = useState<Record<string, unknown> | null>(null);
  const [blockCatalog, setBlockCatalog] = useState<ThemeBlockCatalogApi | null>(null);
  const [previewPage, setPreviewPage] = useState<ThemePreviewPage>('index');
  const [canPersist, setCanPersist] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<ThemeEditorSidebarTab>('sections');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [hiddenNodes, setHiddenNodes] = useState<Record<string, boolean>>({});
  const [addBlockTarget, setAddBlockTarget] = useState<{
    nodeId: string;
    sectionLabel: string;
  } | null>(null);
  const [addSectionTarget, setAddSectionTarget] = useState<{
    nodeId: string;
    groupId: ReturnType<typeof resolveAddSectionGroup>['groupId'];
    groupLabel: string;
    afterNodeId?: string;
    beforeNodeId?: string;
  } | null>(null);
  const [insertHoverHighlight, setInsertHoverHighlight] = useState<SectionInsertContext | null>(null);

  const openAddSectionModal = useCallback((ctx: SectionInsertContext) => {
    setAddBlockTarget(null);
    setInsertHoverHighlight(null);
    setAddSectionTarget({
      nodeId: ctx.afterNodeId ?? ctx.beforeNodeId ?? `insert:${ctx.groupId}`,
      groupId: ctx.groupId,
      groupLabel: ctx.groupLabel,
      afterNodeId: ctx.afterNodeId,
      beforeNodeId: ctx.beforeNodeId,
    });
  }, []);
  const [itemOrder, setItemOrder] = useState<Record<string, string[]>>({});
  const [structureSyncKey, setStructureSyncKey] = useState(0);
  const [devPackId, setDevPackId] = useState<DevStaticThemePackId>(() => getStaticDevPackId());
  const [packSwitching, setPackSwitching] = useState(false);
  /** Bumps on field edits (batched per animation frame) for immediate preview config sync. */
  const [valuesSyncKey, bumpValuesSync] = useRafBatchedCounter();

  const schemaFieldTypes = useMemo(() => {
    if (!editorSchema) return new Map<string, string>();
    return new Map(flattenSchemaFieldPaths(editorSchema).map((f) => [f.path, f.type]));
  }, [editorSchema]);

  const debouncedValuesForTree = useDebouncedValue(values, 140);

  const treeConfig = useMemo(() => {
    if (!defaultConfig || !editorSchema) return defaultConfig ?? {};
    return applyValuesToThemeConfig(defaultConfig, debouncedValuesForTree, editorSchema);
  }, [defaultConfig, debouncedValuesForTree, editorSchema]);

  const sectionsTree = useMemo(
    () =>
      editorSchema
        ? buildShopifySidebarTree(
            editorSchema,
            debouncedValuesForTree,
            previewPage,
            itemOrder,
            treeConfig as Record<string, unknown>
          )
        : [],
    [editorSchema, debouncedValuesForTree, previewPage, itemOrder, treeConfig]
  );
  const themeSettingsTree = useMemo(
    () => (editorSchema ? buildThemeSettingsSidebarTree(editorSchema) : []),
    [editorSchema]
  );
  const activeTree = sidebarTab === 'sections' ? sectionsTree : themeSettingsTree;

  const treeInitRef = useRef(false);
  useEffect(() => {
    if (!activeTree.length) return;
    if (!treeInitRef.current) {
      treeInitRef.current = true;
      setExpanded(defaultExpandedSidebar(activeTree));
      const first = firstSelectableSidebarNode(activeTree);
      if (first) setSelectedNodeId(first.id);
    }
  }, [activeTree, sidebarTab]);

  const hydrateEditor = useCallback(
    (data: Awaited<ReturnType<typeof load>>) => {
      if (!data) return;
      treeInitRef.current = false;
      setThemeName(data.themeName);
      setEditorSchema((data.editorSchema ?? null) as EditorSchemaDoc | null);
      const working = JSON.parse(
        JSON.stringify((data.config ?? data.defaultConfig) as Record<string, unknown>)
      ) as Record<string, unknown>;
      setDefaultConfig(working);
      setValues(data.values);
      setItemOrder(readStructureOrderFromConfig(working, previewPage));
      setManifest(data.manifest);
      setBlockCatalog(data.blockCatalog);
      setThemeRuntime(data.themeRuntime);
      setCanPersist(data.canPersist);
      setEditorNotice(data.notice ?? null);
    },
    []
  );

  const reloadEditor = useCallback(async () => {
    if (!themeId) return;
    const storeId = staticDevMode
      ? activeStoreId || THEME_EDITOR_STATIC_CONFIG.devStoreId
      : activeStoreId;
    if (!storeId) return;
    setError(null);
    const data = await load(storeId, themeId);
    hydrateEditor(data);
  }, [themeId, activeStoreId, load, hydrateEditor, staticDevMode]);

  useEffect(() => {
    void reloadEditor();
  }, [reloadEditor]);

  const handleDevPackChange = useCallback(
    async (packId: DevStaticThemePackId) => {
      if (packId === devPackId) return;
      setPackSwitching(true);
      setStaticDevPackId(packId);
      setDevPackId(packId);
      setSelectedNodeId('');
      setAddBlockTarget(null);
      setPreviewPage('index');
      try {
        await reloadEditor();
        toast.success(`Switched to ${displayNameForDevPack(packId)}`);
      } catch (err: unknown) {
        toast.error((err as Error)?.message ?? 'Failed to switch theme pack');
      } finally {
        setPackSwitching(false);
      }
    },
    [devPackId, reloadEditor]
  );

  useEffect(() => {
    if (loadError) setError(loadError);
  }, [loadError]);

  useEffect(() => {
    if (activeStoreId) getByStoreId(activeStoreId);
  }, [activeStoreId, getByStoreId]);

  const selectedNode = useMemo(
    () => findSidebarNode(activeTree, selectedNodeId),
    [activeTree, selectedNodeId]
  );

  const livePreviewConfig = useMemo(() => {
    if (!defaultConfig || !editorSchema) return defaultConfig ?? {};
    return applyValuesToThemeConfig(defaultConfig, values, editorSchema);
  }, [defaultConfig, values, editorSchema]);

  const debouncedConfigForHints = useDebouncedValue(livePreviewConfig, 320);

  const selectionHints = useMemo(
    () => buildThemeEditorSelectionHints(editorSchema, debouncedConfigForHints, previewPage),
    [editorSchema, debouncedConfigForHints, previewPage, structureSyncKey]
  );

  const previewStoreId = useMemo(
    () =>
      staticDevMode
        ? activeStoreId || THEME_EDITOR_STATIC_CONFIG.devStoreId
        : activeStoreId ?? '',
    [staticDevMode, activeStoreId]
  );

  const activeStoreName = useMemo(
    () =>
      stores.find((s) => s._id === previewStoreId)?.storeName ??
      (staticDevMode ? 'Preview store' : 'Store'),
    [stores, previewStoreId, staticDevMode]
  );

  const pageMenuItems = useMemo(
    () => buildThemeEditorPageMenu(manifest, editorSchema),
    [manifest, editorSchema]
  );

  const pageLabel =
    findPageMenuItemByPreview(pageMenuItems, previewPage)?.label ?? 'Home page';

  const handlePreviewPageChange = useCallback(
    (page: ThemePreviewPage) => {
      if (page === previewPage) return;
      setPreviewPage(page);
      setSelectedNodeId('');
      setAddBlockTarget(null);
      setAddSectionTarget(null);
      setInsertHoverHighlight(null);
      treeInitRef.current = false;
      const orderSource = defaultConfig;
      if (orderSource) {
        setItemOrder(readStructureOrderFromConfig(orderSource, page));
      }
    },
    [defaultConfig, previewPage]
  );

  const toggleExpand = useCallback((id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleFieldChange = useCallback(
    (path: string, type: FieldType, raw: string | boolean) => {
      startTransition(() => {
        setValues((prev) => ({
          ...prev,
          [path]: type === 'boolean' ? Boolean(raw) : String(raw),
        }));
      });
      bumpValuesSync();
    },
    [bumpValuesSync]
  );

  const handlePreviewSelect = useCallback(
    (nodeId: string) => {
      if (selectedNodeId === nodeId) {
        setSelectedNodeId('');
        setAddBlockTarget(null);
        return;
      }
      if (
        nodeId.startsWith('field:') ||
        nodeId.startsWith('template:') ||
        nodeId.startsWith('layout:')
      ) {
        setSidebarTab('sections');
      }
      setAddBlockTarget(null);
      setSelectedNodeId(nodeId);
      setExpanded((prev) => ({
        ...prev,
        ...expandedIdsForPreviewNode(nodeId, sectionsTree),
      }));
    },
    [selectedNodeId, sectionsTree]
  );

  const handlePreviewFieldChange = useCallback(
    (fieldPath: string, value: string) => {
      const schemaType = schemaFieldTypes.get(fieldPath);
      const type = schemaType ? fieldTypeFromSchema(schemaType) : 'text';
      startTransition(() => {
        setValues((prev) => ({
          ...prev,
          [fieldPath]: type === 'boolean' ? value === 'true' || value === '1' : value,
        }));
      });
      bumpValuesSync();
    },
    [schemaFieldTypes, bumpValuesSync]
  );

  const handlePreviewAction = useCallback((action: 'hide' | 'duplicate' | 'delete', nodeId: string) => {
    if (action === 'hide') {
      setHiddenNodes((prev) => ({ ...prev, [nodeId]: true }));
      toast('Section hidden in preview', { icon: '👁' });
      return;
    }
    if (action === 'delete') {
      toast('Remove block — save in sidebar when ready', { icon: 'ℹ️' });
    }
  }, []);

  const handleReorder = useCallback(
    (listKey: string, orderedIds: string[]) => {
      setItemOrder((prev) => mergeItemOrder(prev, listKey, orderedIds));
      setDefaultConfig((prev) => {
        if (!prev) return prev;
        const next = JSON.parse(JSON.stringify(prev)) as Record<string, unknown>;
        applyStructureOrderToConfig(next, listKey, orderedIds, previewPage);
        return next;
      });
      setStructureSyncKey((k) => k + 1);
    },
    [previewPage]
  );

  const handleSave = async () => {
    if (!themeId || !canPersist || !defaultConfig || !editorSchema) return;
    const configToSave = applyValuesToThemeConfig(defaultConfig, values, editorSchema);
    const toastId = toast.loading(staticDevMode ? 'Saving locally…' : 'Saving theme…');

    if (staticDevMode) {
      if (!defaultConfig || !editorSchema) return;
      try {
        const merged = mergedConfigFromFormValues(defaultConfig, values, editorSchema);
        saveStaticThemeConfigLocal(merged);
        const storeId = activeStoreId || THEME_EDITOR_STATIC_CONFIG.devStoreId;
        const refreshed = await load(storeId, themeId);
        if (refreshed) hydrateEditor(refreshed);
        toast.success('Saved to browser (static dev mode)', { id: toastId });
      } catch (err: unknown) {
        toast.error((err as Error)?.message ?? 'Failed to save', { id: toastId });
      }
      return;
    }

    if (!activeStoreId) return;
    try {
      const { data: body } = await axiosi.put<{ success: boolean; data?: Awaited<ReturnType<typeof load>> }>(
        `/store-theme-config/${activeStoreId}/${themeId}`,
        { config: configToSave }
      );
      if (body?.success && body.data) {
        hydrateEditor(body.data as Awaited<ReturnType<typeof load>>);
        toast.success('Theme saved', { id: toastId });
      } else {
        throw new Error('Save failed');
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        'Failed to save theme';
      toast.error(msg, { id: toastId });
    }
  };

  const settingsNode = useMemo(
    () => settingsNodeForSelection(selectedNode),
    [selectedNode]
  );

  const closeSettings = useCallback(() => {
    setSelectedNodeId('');
  }, []);

  const handleRemoveSettingsSection = useCallback(() => {
    if (!settingsNode || !defaultConfig) return;
    const m = settingsNode.id.match(/^layout:(.+)$/);
    if (!m) {
      toast.error('This section cannot be removed here');
      return;
    }
    const instanceId = m[1];
    const order = getLayoutOrder(defaultConfig);
    const groupId: 'header' | 'footer' = order.footer?.includes(instanceId) ? 'footer' : 'header';
    const next = removeLayoutSection(defaultConfig, instanceId, groupId);
    if (!next) {
      toast.error('This section cannot be removed');
      return;
    }
    setDefaultConfig(next);
    setValues((prev) => pruneValuesForLayoutInstance(prev, instanceId));
    setItemOrder((prev) => {
      const listKey = groupId === 'header' ? 'sections:header' : 'sections:footer';
      const ids = (prev[listKey] ?? []).filter((id) => id !== `layout:${instanceId}`);
      return { ...prev, [listKey]: ids };
    });
    setSelectedNodeId('');
    setStructureSyncKey((k) => k + 1);
    toast.success('Section removed');
  }, [defaultConfig, settingsNode]);

  if (!staticDevMode && !activeStoreId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100">
        <p className="text-sm text-gray-600">Select a store first.</p>
      </div>
    );
  }

  const showBlockingOverlay = packSwitching || (loading && !editorSchema);

  return (
    <div className="fixed inset-0 z-[1310] flex flex-col bg-[#1e1e1e]">
      {showBlockingOverlay ? (
        <EditorBlockingOverlay
          label={packSwitching ? 'Switching theme…' : 'Loading theme editor…'}
        />
      ) : null}
      {/* Top bar — Shopify-style: theme name | page picker (center) | actions */}
      <header className="relative grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-gray-200 bg-white px-3">
        <div className="flex min-w-0 items-center gap-2 justify-self-start">
          <span className="truncate text-sm font-semibold text-gray-900">
            {themeName || 'Theme'}
          </span>
          <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
            Active
          </span>
          {staticDevMode ? (
            <span className="hidden shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-900 sm:inline">
              Dev
            </span>
          ) : null}
        </div>

        <div className="justify-self-center">
          <ThemeEditorPagePicker
            value={previewPage}
            onChange={handlePreviewPageChange}
            manifest={manifest}
            editorSchema={editorSchema}
          />
        </div>

        <div className="flex items-center gap-2 justify-self-end">
          {staticDevMode ? (
            <div className="flex items-center gap-1.5 border-r border-gray-200 pr-2">
              <span className="hidden text-xs font-medium text-gray-500 sm:inline">Theme</span>
              <DevThemePackSwitcher
                value={devPackId}
                onChange={(id) => void handleDevPackChange(id)}
                disabled={packSwitching || loading}
              />
            </div>
          ) : null}
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
        <ThemeEditorSidebar
          pageLabel={pageLabel}
          sidebarTab={sidebarTab}
          onSidebarTabChange={setSidebarTab}
          onExit={() => navigate('/themes/all-themes')}
          tree={activeTree}
          expanded={expanded}
          onToggleExpand={toggleExpand}
          selectedNodeId={selectedNodeId}
          onSelectNode={(node) => {
            if (node.kind === 'add-block') {
              if (selectedNodeId === node.id) {
                setSelectedNodeId('');
                setAddBlockTarget(null);
                return;
              }
              setSelectedNodeId(node.id);
              setAddBlockTarget({
                nodeId: node.id,
                sectionLabel: resolveAddBlockSectionLabel(node.id, activeTree),
              });
              return;
            }
            if (node.kind === 'add-section') {
              const group = resolveAddSectionGroup(node.id);
              let afterNodeId: string | undefined;
              let beforeNodeId: string | undefined;
              if (group.groupId === 'header') {
                const order = itemOrder['sections:header'] ?? [];
                afterNodeId = order[order.length - 1];
              } else if (group.groupId === 'footer') {
                const order = itemOrder['sections:footer'] ?? [];
                beforeNodeId = order[0];
              } else {
                const order = itemOrder[`sections:template:${previewPage}`] ?? [];
                afterNodeId = order[order.length - 1];
              }
              openAddSectionModal({
                groupId: group.groupId,
                groupLabel: group.groupLabel,
                afterNodeId,
                beforeNodeId,
              });
              return;
            }
            if (selectedNodeId === node.id) {
              setSelectedNodeId('');
              setAddBlockTarget(null);
              return;
            }
            setAddBlockTarget(null);
            setSelectedNodeId(node.id);
            if (node.fields?.length || node.children?.length) {
              setExpanded((prev) => ({
                ...prev,
                [node.id]: true,
                ...expandedIdsForPreviewNode(node.id, sectionsTree),
              }));
            }
          }}
          hiddenNodes={hiddenNodes}
          onToggleHidden={(id) => {
            const announcementMatch = id.match(/^layout:(announcement_bar(?:_\d+)?)$/);
            if (announcementMatch) {
              const instanceId = announcementMatch[1];
              const path = `sections.${instanceId}.settings.enabled`;
              const current = values[path] !== false && values[path] !== 'false';
              handleFieldChange(path, 'boolean', !current);
              return;
            }
            setHiddenNodes((prev) => ({ ...prev, [id]: !prev[id] }));
          }}
          onReorder={handleReorder}
          onInsertSection={openAddSectionModal}
          onInsertHoverChange={setInsertHoverHighlight}
          loading={loading}
          error={error}
          settingsNode={settingsNode}
          settingsValues={values}
          onSettingsFieldChange={handleFieldChange}
          onCloseSettings={closeSettings}
          onRemoveSettingsSection={handleRemoveSettingsSection}
        />

        {/* Preview canvas */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">
          <div
            className={`theme-editor-preview-canvas flex min-h-0 flex-1 flex-col overflow-hidden bg-white ${
              device === 'mobile' ? 'mx-auto w-full max-w-[390px] border-x border-gray-200' : 'h-full w-full'
            }`}
          >
            <ThemeLivePreviewFrame
              key={`${devPackId}-${themeRuntime.jsUrl ?? 'no-js'}`}
              className="h-full min-h-0 w-full flex-1"
                storeId={previewStoreId}
                storeName={activeStoreName}
                storefrontOrigin={storeSubdomain?.url ?? null}
                jsUrl={themeRuntime.jsUrl}
                cssUrl={themeRuntime.cssUrl}
                config={livePreviewConfig}
                structureSyncKey={structureSyncKey}
                valuesSyncKey={valuesSyncKey}
                page={previewPage}
                selectionHints={selectionHints}
                highlightNodeId={selectedNodeId || null}
                onPreviewSelect={({ nodeId }) => handlePreviewSelect(nodeId)}
                onPreviewFieldChange={handlePreviewFieldChange}
                onPreviewAction={handlePreviewAction}
                insertHoverHighlight={insertHoverHighlight}
                onPreviewInsertSection={(payload) => {
                  const anchor = payload.afterNodeId ?? payload.beforeNodeId ?? '';
                  const group = resolveSectionCatalogGroupFromNodeId(anchor);
                  openAddSectionModal({ ...group, ...payload });
                }}
              />
          </div>
        </div>
      </div>

      <AddBlockModal
        open={Boolean(addBlockTarget)}
        sectionLabel={addBlockTarget?.sectionLabel}
        themeBlockCatalog={blockCatalog}
        editorSchema={editorSchema ?? undefined}
        addBlockNodeId={addBlockTarget?.nodeId}
        onClose={() => setAddBlockTarget(null)}
        onSelectBlock={(block: BlockCatalogItem) => {
          const section = addBlockTarget?.sectionLabel ?? 'section';
          setAddBlockTarget(null);
          toast.success(`Added ${block.label} to ${section}`);
        }}
      />

      <AddSectionModal
        open={Boolean(addSectionTarget)}
        groupId={addSectionTarget?.groupId ?? 'header'}
        groupLabel={addSectionTarget?.groupLabel ?? 'Header'}
        onClose={() => setAddSectionTarget(null)}
        onSelectSection={(section: SectionCatalogItem) => {
          if (!defaultConfig || !editorSchema || !addSectionTarget) return;
          const ctx: SectionInsertContext = {
            groupId: addSectionTarget.groupId,
            groupLabel: addSectionTarget.groupLabel,
            afterNodeId: addSectionTarget.afterNodeId,
            beforeNodeId: addSectionTarget.beforeNodeId,
          };
          const result = insertSectionFromCatalog(
            defaultConfig as Record<string, unknown>,
            section,
            ctx,
            editorSchema,
            previewPage
          );
          setAddSectionTarget(null);
          if (!result) {
            toast.error(`Could not add ${section.label}`);
            return;
          }
          setDefaultConfig(result.config);
          setValues((prev) =>
            ctx.groupId === 'header' || ctx.groupId === 'footer'
              ? extendValuesForLayoutInstance(
                  prev,
                  editorSchema,
                  layoutBlueprintKey(result.instanceId),
                  result.instanceId,
                  result.config
                )
              : prev
          );
          setItemOrder(readStructureOrderFromConfig(result.config, previewPage));
          treeInitRef.current = false;
          setSelectedNodeId(result.nodeId);
          setExpanded((prev) => ({
            ...prev,
            'group:header': true,
            'group:template': true,
            'group:footer': true,
            [result.nodeId]: true,
          }));
          setStructureSyncKey((k) => k + 1);
          bumpValuesSync();
          if (staticDevMode) {
            saveStaticThemeConfigLocal(result.config, devPackId);
          }
          toast.success(`Added ${section.label}`);
        }}
      />
    </div>
  );
};

export default SectionThemeConfigEditor;
