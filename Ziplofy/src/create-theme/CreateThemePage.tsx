import React, { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import ThemeEditorLiveConfigModal from '../components/themes/ThemeEditorLiveConfigModal';
import {
  CreateThemeEditorSidebar,
  buildEmptyShopifySidebarTree,
  buildShopifySidebarTree,
  buildThemeSettingsSidebarTree,
  defaultExpandedSidebar,
  findSidebarNode,
  settingsNodeForSelection,
  resolveAddBlockSectionLabel,
  resolveAddSectionGroup,
  resolveSectionCatalogGroupFromNodeId,
  applyStructureOrderToConfig,
  mergeItemOrder,
  readStructureOrderFromConfig,
  withCreatorSidebarDeleteFlags,
  type EditorSchemaDoc,
  type ThemeEditorSidebarTab,
  type SectionInsertContext,
} from './sidebar';
import { CreateThemeHeader } from './chrome/CreateThemeHeader';
import CreateThemeLivePreview, { type ThemePreviewPage } from './chrome/CreateThemeLivePreview';
import { EditorBlockingOverlay } from './chrome/PreviewStatus';
import { buildThemeEditorPageMenu, findPageMenuItemByPreview } from './utils/page-menu';
import {
  buildThemeEditorSelectionHints,
  expandedIdsForPreviewNode,
} from './utils/selection-hints';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useRafBatchedCounter } from '../hooks/useRafBatchedState';
import { THEME_EDITOR_STATIC_CONFIG } from '../config/theme-editor-static.config';
import { useStore } from '../contexts/store.context';
import { useStoreCustomThemes } from '../contexts/store-custom-themes.context';
import {
  applyValuesToThemeConfig,
  collectEditableFieldPaths,
} from '../utils/theme-editor-config.utils';
import {
  extendValuesForHeroBlock,
  extendValuesForLayoutBlock,
  extendValuesForLayoutInstance,
  extendValuesForTemplateBlock,
  extendValuesForTemplateInstance,
  getLayoutOrder,
  insertBlockFromCatalog,
  pruneValuesForLayoutBlock,
  pruneValuesForLayoutInstance,
  pruneValuesForTemplateBlock,
  pruneValuesForTemplateInstance,
  removeLayoutSection,
  removeTemplateSection,
  templateBlueprintKey,
  templateIdForPage,
  type ThemeEditorDeleteOptions,
} from '../utils/theme-editor-insert-section';
import {
  creatorConfigHasSections,
  formValuesFromEditorConfig,
  loadCreatorThemeEditorPack,
} from '../utils/theme-editor-static-pack';
import {
  sanitizeThemeConfigStructure,
  syncLayoutOrderFromSections,
} from '../utils/theme-editor-insert-section';
import { mergedConfigFromFormValues } from '../utils/theme-editor-static-save';
import { fieldTypeFromSchema, type ThemeEditorFieldType } from './sidebar/create-theme-field.utils';
import {
  headerMenuBlockFieldDefsFromSchema,
  instanceIdFromHeaderMenuBlockNodeId,
} from './sidebar/theme-editor-header-menu-block-panel.utils';
import { isHeaderMenuBlockNodeId } from './sidebar/theme-editor-header-panel.utils';
import {
  seedSectionEnabledValues,
  sectionEnabledPathFromNodeId,
} from '../utils/theme-editor-section-visibility.util';
import './chrome/create-theme-chrome.css';
import { insertCreateThemeElement } from './_shared/insert-element';
import type { CreateThemeBlock } from './blocks/types';
import { getCreateThemeElement } from './registry';
import { CreateThemeAddBlockModal } from './shell/CreateThemeAddBlockModal';
import { CreateThemeAddSectionModal } from './shell/CreateThemeAddSectionModal';
import type { CreateThemeCatalogGroup } from './types';

type FieldType = ThemeEditorFieldType;

const CREATOR_DELETE: ThemeEditorDeleteOptions = { creatorMode: true };

const CreateThemePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editThemeId = searchParams.get('id');
  const { activeStoreId, stores } = useStore();
  const {
    create: createStoreCustomTheme,
    update: updateStoreCustomTheme,
    getByStoreId,
    loading: savingTheme,
  } = useStoreCustomThemes();

  const [themeName, setThemeName] = useState('Creator Basic');
  const [savedThemeId, setSavedThemeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editorSchema, setEditorSchema] = useState<EditorSchemaDoc | null>(null);
  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [defaultConfig, setDefaultConfig] = useState<Record<string, unknown> | null>(null);
  const packDefaultRef = useRef<Record<string, unknown> | null>(null);
  const [manifest, setManifest] = useState<Record<string, unknown> | null>(null);
  const [themeRuntime, setThemeRuntime] = useState<{ jsUrl?: string | null; cssUrl?: string | null }>({});

  const [showViewTheme, setShowViewTheme] = useState(false);
  const [previewPage, setPreviewPage] = useState<ThemePreviewPage>('index');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [sidebarTab, setSidebarTab] = useState<ThemeEditorSidebarTab>('sections');
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [hiddenNodes, setHiddenNodes] = useState<Record<string, boolean>>({});
  const [itemOrder, setItemOrder] = useState<Record<string, string[]>>({});
  const [structureSyncKey, setStructureSyncKey] = useState(0);
  const [valuesSyncKey, bumpValuesSync] = useRafBatchedCounter();
  const [insertHoverHighlight, setInsertHoverHighlight] = useState<SectionInsertContext | null>(null);
  const [addSectionTarget, setAddSectionTarget] = useState<{
    groupId: CreateThemeCatalogGroup;
    groupLabel: string;
    afterNodeId?: string;
    beforeNodeId?: string;
  } | null>(null);
  const [addBlockTarget, setAddBlockTarget] = useState<{
    nodeId: string;
    sectionLabel: string;
  } | null>(null);

  const treeInitRef = useRef(false);
  const previewStoreId = activeStoreId || THEME_EDITOR_STATIC_CONFIG.devStoreId;
  const activeStoreName =
    stores.find((s) => s._id === previewStoreId)?.storeName ?? 'Preview store';

  const openAddSectionModal = useCallback((ctx: SectionInsertContext) => {
    setInsertHoverHighlight(null);
    setAddSectionTarget({
      groupId: ctx.groupId as CreateThemeCatalogGroup,
      groupLabel: ctx.groupLabel,
      afterNodeId: ctx.afterNodeId,
      beforeNodeId: ctx.beforeNodeId,
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      setSavedThemeId(null);
      try {
        const data = await loadCreatorThemeEditorPack('horizon');
        if (cancelled) return;
        const schema = data.editorSchema as EditorSchemaDoc;
        packDefaultRef.current = JSON.parse(JSON.stringify(data.defaultConfig ?? {})) as Record<
          string,
          unknown
        >;

        let config = JSON.parse(JSON.stringify(data.config)) as Record<string, unknown>;
        let nextValues = { ...data.values };
        let nextName = (config.themeName as string) || data.themeName || 'Creator Basic';
        let loadedSavedId: string | null = null;

        const storeId = activeStoreId || THEME_EDITOR_STATIC_CONFIG.devStoreId;
        if (editThemeId && storeId) {
          const list = await getByStoreId(storeId);
          if (cancelled) return;
          const saved = list.find((t) => t._id === editThemeId);
          if (saved?.themeConfig && typeof saved.themeConfig === 'object') {
            config = JSON.parse(JSON.stringify(saved.themeConfig)) as Record<string, unknown>;
            sanitizeThemeConfigStructure(config);
            syncLayoutOrderFromSections(config);
            nextValues = creatorConfigHasSections(config)
              ? {
                  ...formValuesFromEditorConfig(schema, config),
                  ...seedSectionEnabledValues(config),
                }
              : nextValues;
            nextName = saved.themeName?.trim() || nextName;
            loadedSavedId = saved._id;
          } else if (editThemeId) {
            toast.error('Saved theme not found');
          }
        }

        sanitizeThemeConfigStructure(config);
        syncLayoutOrderFromSections(config);

        setEditorSchema(schema);
        setDefaultConfig(config);
        setValues(nextValues);
        setManifest(data.manifest);
        setThemeRuntime(data.themeRuntime);
        setThemeName(nextName);
        setSavedThemeId(loadedSavedId);
        setItemOrder(readStructureOrderFromConfig(config, 'index'));
        treeInitRef.current = false;
      } catch (err: unknown) {
        if (!cancelled) {
          setError((err as Error)?.message ?? 'Failed to load theme creator');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [editThemeId, activeStoreId, getByStoreId]);

  const debouncedValuesForTree = useDebouncedValue(values, 140);
  const tplId = templateIdForPage(previewPage);
  const hasSections = useMemo(
    () => creatorConfigHasSections(defaultConfig, tplId),
    [defaultConfig, tplId]
  );

  const treeConfig = useMemo(() => {
    if (!defaultConfig || !editorSchema) return defaultConfig ?? {};
    if (!hasSections) return defaultConfig;
    return applyValuesToThemeConfig(defaultConfig, debouncedValuesForTree, editorSchema);
  }, [defaultConfig, debouncedValuesForTree, editorSchema, hasSections]);

  const sectionsTree = useMemo(() => {
    if (!editorSchema || !defaultConfig) {
      return buildEmptyShopifySidebarTree(previewPage);
    }
    if (!hasSections) {
      return buildEmptyShopifySidebarTree(previewPage);
    }
    return withCreatorSidebarDeleteFlags(
      buildShopifySidebarTree(
        editorSchema,
        debouncedValuesForTree,
        previewPage,
        itemOrder,
        JSON.parse(JSON.stringify(defaultConfig)) as Record<string, unknown>
      )
    );
  }, [editorSchema, debouncedValuesForTree, previewPage, itemOrder, defaultConfig, hasSections]);

  const themeSettingsTree = useMemo(
    () => (editorSchema ? buildThemeSettingsSidebarTree(editorSchema) : []),
    [editorSchema]
  );

  const activeTree = sidebarTab === 'sections' ? sectionsTree : themeSettingsTree;

  useEffect(() => {
    if (!activeTree.length) return;
    if (!treeInitRef.current) {
      treeInitRef.current = true;
      setExpanded(defaultExpandedSidebar(activeTree));
    }
  }, [activeTree, sidebarTab]);

  const pageMenuItems = useMemo(
    () => buildThemeEditorPageMenu(manifest, editorSchema),
    [manifest, editorSchema]
  );

  const pageLabel =
    findPageMenuItemByPreview(pageMenuItems, previewPage)?.label ?? 'Home page';

  const selectedNode = useMemo(
    () => findSidebarNode(activeTree, selectedNodeId),
    [activeTree, selectedNodeId]
  );

  const settingsNode = useMemo(
    () => settingsNodeForSelection(selectedNode, activeTree, editorSchema),
    [selectedNode, activeTree, editorSchema]
  );

  /** Seed menu block paths into `values` when opening the panel (avoids blank controls / no-op edits). */
  useEffect(() => {
    if (!editorSchema || !defaultConfig || !isHeaderMenuBlockNodeId(selectedNodeId)) return;
    const instanceId = instanceIdFromHeaderMenuBlockNodeId(selectedNodeId);
    if (!instanceId) return;
    const defs = headerMenuBlockFieldDefsFromSchema(editorSchema, instanceId);
    if (!defs.length) return;

    setValues((prev) => {
      const needsSeed = defs.some((f) => prev[f.path] === undefined);
      if (!needsSeed) return prev;
      const config = applyValuesToThemeConfig(defaultConfig, prev, editorSchema);
      const fromConfig = formValuesFromEditorConfig(editorSchema, config);
      const next = { ...prev };
      let changed = false;
      for (const f of defs) {
        if (next[f.path] !== undefined) continue;
        const seeded = fromConfig[f.path];
        if (seeded === undefined) continue;
        next[f.path] = seeded;
        changed = true;
      }
      return changed ? next : prev;
    });
  }, [selectedNodeId, editorSchema, defaultConfig]);

  const livePreviewConfig = useMemo(() => {
    if (!defaultConfig || !editorSchema) return defaultConfig ?? {};
    if (!hasSections) return defaultConfig;
    return applyValuesToThemeConfig(defaultConfig, values, editorSchema);
  }, [defaultConfig, values, editorSchema, hasSections]);

  const debouncedConfigForHints = useDebouncedValue(livePreviewConfig, 320);

  const selectionHints = useMemo(
    () => buildThemeEditorSelectionHints(editorSchema, debouncedConfigForHints, previewPage),
    [editorSchema, debouncedConfigForHints, previewPage, structureSyncKey]
  );

  const schemaFieldTypes = useMemo(() => {
    if (!editorSchema || !defaultConfig) return new Map<string, string>();
    return new Map(
      collectEditableFieldPaths(editorSchema, defaultConfig as Record<string, unknown>).map((f) => [
        f.path,
        f.type,
      ])
    );
  }, [editorSchema, defaultConfig]);

  const liveThemeJson = useMemo(() => {
    if (!defaultConfig || !editorSchema) return {};
    return mergedConfigFromFormValues({ ...defaultConfig, themeName }, values, editorSchema);
  }, [defaultConfig, values, editorSchema, themeName]);

  const handleSave = useCallback(async () => {
    const storeId = activeStoreId || THEME_EDITOR_STATIC_CONFIG.devStoreId;
    if (!storeId) {
      toast.error('Select a store before saving');
      return;
    }
    if (!defaultConfig || !editorSchema) {
      toast.error('Theme is still loading');
      return;
    }

    const themeConfig = mergedConfigFromFormValues(
      { ...defaultConfig, themeName },
      values,
      editorSchema
    );
    const name = themeName.trim() || 'Untitled theme';

    try {
      if (savedThemeId) {
        await updateStoreCustomTheme(savedThemeId, { themeName: name, themeConfig });
        toast.success('Theme saved');
      } else {
        const created = await createStoreCustomTheme({
          storeId,
          themeName: name,
          themeConfig,
        });
        setSavedThemeId(created._id);
        toast.success('Theme created');
      }
    } catch (err: unknown) {
      const msg = (err as Error)?.message ?? 'Failed to save theme';
      toast.error(msg);
    }
  }, [
    activeStoreId,
    defaultConfig,
    editorSchema,
    themeName,
    values,
    savedThemeId,
    createStoreCustomTheme,
    updateStoreCustomTheme,
  ]);

  const handlePreviewPageChange = useCallback(
    (page: ThemePreviewPage) => {
      if (page === previewPage) return;
      setPreviewPage(page);
      setSelectedNodeId('');
      setAddSectionTarget(null);
      setAddBlockTarget(null);
      setInsertHoverHighlight(null);
      treeInitRef.current = false;
      if (defaultConfig) {
        setItemOrder(readStructureOrderFromConfig(defaultConfig, page));
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

  const handlePreviewSelect = useCallback(
    (nodeId: string) => {
      if (selectedNodeId === nodeId) {
        setSelectedNodeId('');
        return;
      }
      setSelectedNodeId(nodeId);
      const node = findSidebarNode(sectionsTree, nodeId);
      if (node?.fields?.length || node?.children?.length) {
        setExpanded((prev) => ({
          ...prev,
          [nodeId]: true,
          ...expandedIdsForPreviewNode(nodeId, sectionsTree),
        }));
      }
    },
    [selectedNodeId, sectionsTree]
  );

  const handleInsertElement = useCallback(
    (elementId: string) => {
      if (!defaultConfig || !editorSchema || !packDefaultRef.current || !addSectionTarget) return;
      const result = insertCreateThemeElement(
        defaultConfig,
        elementId,
        {
          groupId: addSectionTarget.groupId,
          groupLabel: addSectionTarget.groupLabel,
          afterNodeId: addSectionTarget.afterNodeId,
          beforeNodeId: addSectionTarget.beforeNodeId,
        },
        packDefaultRef.current,
        previewPage
      );
      if (!result) {
        toast.error('Could not add this section yet');
        return;
      }
      syncLayoutOrderFromSections(result.config);
      setDefaultConfig(result.config);
      const el = getCreateThemeElement(elementId);
      if (el?.insert.placement === 'layout') {
        setValues((prev) =>
          extendValuesForLayoutInstance(
            prev,
            editorSchema,
            el.insert.blueprintId,
            result.instanceId,
            result.config
          )
        );
      } else if (el?.insert.placement === 'template') {
        setValues((prev) =>
          extendValuesForTemplateInstance(
            prev,
            editorSchema,
            templateIdForPage(previewPage),
            templateBlueprintKey(result.instanceId),
            result.instanceId,
            result.config
          )
        );
      }
      setItemOrder(readStructureOrderFromConfig(result.config, previewPage));
      setSelectedNodeId(result.nodeId);
      setAddSectionTarget(null);
      setStructureSyncKey((k) => k + 1);
      toast.success('Section added');
    },
    [defaultConfig, editorSchema, addSectionTarget, previewPage]
  );

  const handleInsertBlock = useCallback(
    (block: CreateThemeBlock) => {
      if (!defaultConfig || !editorSchema || !addBlockTarget) return;
      const result = insertBlockFromCatalog(
        defaultConfig,
        addBlockTarget.nodeId,
        block.id,
        editorSchema
      );
      setAddBlockTarget(null);
      if (!result) {
        toast.error(`Could not add ${block.label}`);
        return;
      }
      setDefaultConfig(result.config);
      if (result.scope === 'template') {
        const hero = templateBlueprintKey(result.sectionInstanceId) === 'hero_main';
        setValues((prev) =>
          hero
            ? extendValuesForHeroBlock(
                prev,
                editorSchema,
                'template',
                result.templateId,
                result.sectionInstanceId,
                result.blockInstanceId,
                block.id,
                result.config
              )
            : extendValuesForTemplateBlock(
                prev,
                editorSchema,
                result.templateId ?? templateIdForPage(previewPage),
                result.sectionInstanceId,
                result.blockInstanceId,
                block.id,
                result.config
              )
        );
      } else {
        setValues((prev) =>
          extendValuesForLayoutBlock(
            prev,
            editorSchema,
            result.sectionInstanceId,
            result.blockInstanceId,
            block.id,
            result.config
          )
        );
      }
      setSelectedNodeId(result.nodeId);
      setStructureSyncKey((k) => k + 1);
      toast.success('Block added');
    },
    [defaultConfig, editorSchema, addBlockTarget, previewPage]
  );

  const handleDeleteSidebarNode = useCallback(
    (nodeId: string) => {
      if (!defaultConfig) return;
      const layoutBlock = nodeId.match(/^layout:([^:]+):block:(.+)$/);
      if (layoutBlock) {
        const [, sectionInstanceId, blockId] = layoutBlock;
        const next = JSON.parse(JSON.stringify(defaultConfig)) as Record<string, unknown>;
        const sections = (next.sections ?? {}) as Record<string, Record<string, unknown>>;
        const sec = sections[sectionInstanceId];
        if (sec?.blocks && typeof sec.blocks === 'object') {
          delete (sec.blocks as Record<string, unknown>)[blockId];
          sec.block_order = ((sec.block_order as string[]) ?? []).filter((id) => id !== blockId);
        }
        setDefaultConfig(next);
        setValues((prev) => pruneValuesForLayoutBlock(prev, sectionInstanceId, blockId));
        setStructureSyncKey((k) => k + 1);
        toast.success('Block removed');
        return;
      }

      const tplBlock = nodeId.match(/^template:([^:]+):([^:]+):block:(.+)$/);
      if (tplBlock) {
        const [, tplId, sectionInstanceId, blockId] = tplBlock;
        const next = JSON.parse(JSON.stringify(defaultConfig)) as Record<string, unknown>;
        const tpl = (next.templates as Record<string, { sections?: Record<string, Record<string, unknown>> }>)?.[
          tplId
        ];
        const sec = tpl?.sections?.[sectionInstanceId];
        if (sec?.blocks && typeof sec.blocks === 'object') {
          delete (sec.blocks as Record<string, unknown>)[blockId];
          sec.block_order = ((sec.block_order as string[]) ?? []).filter((id) => id !== blockId);
        }
        setDefaultConfig(next);
        setValues((prev) => pruneValuesForTemplateBlock(prev, tplId, sectionInstanceId, blockId));
        setStructureSyncKey((k) => k + 1);
        toast.success('Block removed');
        return;
      }

      const layout = nodeId.match(/^layout:(.+)$/);
      if (layout) {
        const instanceId = layout[1];
        if (instanceId.includes('add-section')) {
          toast.error('This section cannot be removed');
          return;
        }
        const order = getLayoutOrder(defaultConfig);
        const groupId: 'header' | 'footer' = order.footer?.includes(instanceId) ? 'footer' : 'header';
        const next = removeLayoutSection(defaultConfig, instanceId, groupId, CREATOR_DELETE);
        if (!next) {
          toast.error('This section cannot be removed');
          return;
        }
        setValues((prev) => pruneValuesForLayoutInstance(prev, instanceId));
        setDefaultConfig(next);
        setItemOrder((prev) => {
          const listKey = groupId === 'header' ? 'sections:header' : 'sections:footer';
          return { ...prev, [listKey]: (prev[listKey] ?? []).filter((id) => id !== nodeId) };
        });
        if (selectedNodeId === nodeId || selectedNodeId.startsWith(`${nodeId}:`)) {
          setSelectedNodeId('');
        }
        setStructureSyncKey((k) => k + 1);
        toast.success('Section removed');
        return;
      }

      const tpl = nodeId.match(/^template:([^:]+):([^:]+)$/);
      if (tpl) {
        const [, tplId, instanceId] = tpl;
        const next = removeTemplateSection(defaultConfig, tplId, instanceId, CREATOR_DELETE);
        if (!next) {
          toast.error('This section cannot be removed');
          return;
        }
        setDefaultConfig(next);
        setValues((prev) => pruneValuesForTemplateInstance(prev, tplId, instanceId));
        setItemOrder((prev) => {
          const listKey = `sections:template:${tplId}`;
          return { ...prev, [listKey]: (prev[listKey] ?? []).filter((id) => id !== nodeId) };
        });
        if (selectedNodeId === nodeId || selectedNodeId.startsWith(`${nodeId}:`)) {
          setSelectedNodeId('');
        }
        setStructureSyncKey((k) => k + 1);
        toast.success('Section removed');
        return;
      }

      toast.error('This section cannot be removed');
    },
    [defaultConfig, selectedNodeId]
  );

  const closeSettings = useCallback(() => {
    setSelectedNodeId('');
  }, []);

  const handleRemoveSettingsSection = useCallback(() => {
    if (!settingsNode) return;
    handleDeleteSidebarNode(settingsNode.id);
  }, [settingsNode, handleDeleteSidebarNode]);

  const handleRemoveSettingsBlock = useCallback(() => {
    if (!settingsNode) return;
    handleDeleteSidebarNode(settingsNode.id);
  }, [settingsNode, handleDeleteSidebarNode]);

  if (loading && !editorSchema) {
    return (
      <div className="fixed inset-0 z-[1310] flex flex-col bg-[#1e1e1e]">
        <EditorBlockingOverlay label="Loading theme creator…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-[1310] flex flex-col items-center justify-center gap-4 bg-gray-100">
        <p className="text-sm text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => navigate('/online-store/themes')}
          className="text-sm text-[#005bd3] hover:underline"
        >
          Back to themes
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1310] flex flex-col bg-[#1e1e1e]">
      <CreateThemeHeader
        themeName={themeName}
        onThemeNameChange={setThemeName}
        previewPage={previewPage}
        onPreviewPageChange={handlePreviewPageChange}
        manifest={manifest}
        editorSchema={editorSchema}
        device={device}
        onDeviceChange={setDevice}
        onViewJson={() => setShowViewTheme(true)}
        viewJsonDisabled={!defaultConfig || !editorSchema}
        onSave={handleSave}
        saveDisabled={!defaultConfig || !editorSchema || loading}
        saving={savingTheme}
      />

      <div className="flex min-h-0 flex-1">
        <CreateThemeEditorSidebar
          pageLabel={pageLabel}
          sidebarTab={sidebarTab}
          onSidebarTabChange={(tab) => {
            setSidebarTab(tab);
            if (tab === 'theme-settings') setSelectedNodeId('');
          }}
          onExit={() => navigate('/online-store/themes')}
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
                sectionLabel: resolveAddBlockSectionLabel(node.id, sectionsTree),
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
              return;
            }
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
          visibilityValues={values}
          onToggleHidden={(id) => {
            const path = sectionEnabledPathFromNodeId(id);
            if (path) {
              const current = values[path] !== false && values[path] !== 'false';
              handleFieldChange(path, 'boolean', !current);
              return;
            }
            setHiddenNodes((prev) => ({ ...prev, [id]: !prev[id] }));
          }}
          onDeleteNode={handleDeleteSidebarNode}
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
          onRemoveSettingsBlock={handleRemoveSettingsBlock}
        />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">
          <div
            className={`create-theme-preview-canvas flex min-h-0 flex-1 flex-col overflow-hidden bg-white ${
              device === 'mobile' ? 'mx-auto w-full max-w-[390px] border-x border-gray-200' : 'h-full w-full'
            }`}
          >
            <CreateThemeLivePreview
              key={themeRuntime.jsUrl ?? 'composer'}
              className="h-full min-h-0 w-full flex-1"
              storeId={previewStoreId}
              storeName={activeStoreName}
              jsUrl={themeRuntime.jsUrl}
              cssUrl={themeRuntime.cssUrl}
              config={livePreviewConfig}
              structureSyncKey={structureSyncKey}
              valuesSyncKey={valuesSyncKey}
              page={previewPage}
              selectionHints={selectionHints}
              highlightNodeId={selectedNodeId || null}
              onPreviewSelect={({ nodeId }) => handlePreviewSelect(nodeId)}
              onPreviewDeselect={() => setSelectedNodeId('')}
              onPreviewFieldChange={(fieldPath, value) => {
                const schemaType = schemaFieldTypes.get(fieldPath);
                const type = schemaType ? fieldTypeFromSchema(schemaType) : 'text';
                handleFieldChange(fieldPath, type, value);
              }}
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

      {addBlockTarget ? (
        <CreateThemeAddBlockModal
          open
          sectionLabel={addBlockTarget.sectionLabel}
          onClose={() => setAddBlockTarget(null)}
          onSelect={handleInsertBlock}
        />
      ) : null}

      {addSectionTarget ? (
        <CreateThemeAddSectionModal
          open
          groupId={addSectionTarget.groupId}
          groupLabel={addSectionTarget.groupLabel}
          onClose={() => setAddSectionTarget(null)}
          onSelect={handleInsertElement}
        />
      ) : null}

      {showViewTheme ? (
        <ThemeEditorLiveConfigModal
          open={showViewTheme}
          onClose={() => setShowViewTheme(false)}
          staticDevMode
          packId="horizon"
          mergedConfig={liveThemeJson}
          formValues={values}
          baseConfig={defaultConfig}
          title="View theme JSON"
          description="Live document from create-theme structure and settings."
        />
      ) : null}
    </div>
  );
};

export default CreateThemePage;
