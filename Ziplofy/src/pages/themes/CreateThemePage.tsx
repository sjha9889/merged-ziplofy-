import React, { useMemo, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownTrayIcon, ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import CreateThemeGlobalSettingsEditor from './CreateThemeGlobalSettingsEditor';
import CreateThemeSectionEditor from './CreateThemeSectionEditor';
import {
  buildDefaultConfigJson,
  buildSchemaJson,
  defaultSectionConfig,
  defaultThemeGlobalSettings,
  resolveInstanceId,
  type BuilderSectionKind,
  type CanvasSection,
  type SectionConfig,
  type ThemeGlobalSettings,
} from './create-theme-builder';
import { sectionContainerStyle, textStyleToCss } from './create-theme-style.utils';

type BuilderSection = { kind: BuilderSectionKind; label: string; area: 'layout' | 'template'; type: string; description: string };
type DragState = { source: 'library' | 'canvas'; kind: BuilderSectionKind; index?: number } | null;

const SECTION_LIBRARY: BuilderSection[] = [
  { kind: 'announcement_bar', label: 'Announcement bar', area: 'layout', type: 'announcement-bar', description: 'Top promo strip for offers and links.' },
  { kind: 'hero_main', label: 'Hero', area: 'template', type: 'hero', description: 'Large heading section with CTA buttons.' },
  { kind: 'product_cards', label: 'Product cards', area: 'template', type: 'featured-collection', description: 'Product grid section powered by runtime products SDK.' },
  { kind: 'footer', label: 'Footer', area: 'layout', type: 'footer', description: 'Bottom section with newsletter signup.' },
];

function downloadJson(fileName: string, content: unknown): void {
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function insertAt<T>(items: T[], index: number, item: T): T[] {
  const next = [...items];
  next.splice(index, 0, item);
  return next;
}

/** Theme id is assigned by the platform on publish — derive a stable slug only for local preview/export. */
function deriveThemeIdFromName(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'custom-theme';
}

function sectionLabelForConfig(config: SectionConfig): string {
  switch (config.kind) {
    case 'announcement_bar':
      return 'Announcement bar';
    case 'hero_main':
      return 'Hero';
    case 'product_cards':
      return 'Featured collection';
    case 'footer':
      return 'Footer';
  }
}

const CreateThemePage: React.FC = () => {
  const [themeName, setThemeName] = useState('Creator Basic');
  const [themeGlobalSettings, setThemeGlobalSettings] = useState<ThemeGlobalSettings>(defaultThemeGlobalSettings);
  const [canvasSections, setCanvasSections] = useState<CanvasSection[]>([]);
  const [dragState, setDragState] = useState<DragState>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'schema' | 'config' | 'manifest'>('schema');
  const [sidebarTab, setSidebarTab] = useState<'elements' | 'editor'>('elements');
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);

  const canvasItems = useMemo(
    () =>
      canvasSections.map((item) => ({
        ...item,
        meta: SECTION_LIBRARY.find((s) => s.kind === item.config.kind)!,
        label: sectionLabelForConfig(item.config),
      })),
    [canvasSections]
  );

  const selectedCanvasItem = useMemo(
    () => canvasItems.find((i) => i.instanceId === selectedInstanceId) ?? null,
    [canvasItems, selectedInstanceId]
  );

  const derivedThemeId = useMemo(() => deriveThemeIdFromName(themeName), [themeName]);

  const schemaJson = useMemo(
    () => buildSchemaJson(canvasSections, derivedThemeId, themeGlobalSettings),
    [canvasSections, derivedThemeId, themeGlobalSettings]
  );
  const defaultConfigJson = useMemo(
    () => buildDefaultConfigJson(canvasSections, derivedThemeId, themeName, themeGlobalSettings),
    [canvasSections, derivedThemeId, themeName, themeGlobalSettings]
  );

  const canvasTypographyStyle: CSSProperties = useMemo(
    () => ({
      fontFamily: themeGlobalSettings.typography.fontFamilyBody,
      fontSize: `${themeGlobalSettings.typography.baseFontSize}px`,
      color: themeGlobalSettings.colors.text,
      fontStyle: themeGlobalSettings.typography.bodyFontStyle,
      textDecoration: themeGlobalSettings.typography.bodyTextDecoration,
      textTransform: themeGlobalSettings.typography.bodyTextTransform,
      backgroundColor: themeGlobalSettings.colors.background,
    }),
    [themeGlobalSettings]
  );

  const manifestJson = useMemo(
    () => ({
      id: derivedThemeId,
      name: themeName,
      version: '1.0.0',
      type: 'react-remote',
      configMode: 'sections',
      assets: {
        themeJs: 'theme.js',
        themeCss: 'theme.css',
        defaultConfig: 'theme.default-config.json',
        schema: 'theme.schema.json',
      },
      templates: ['index'],
      capabilities: { sections: true, blocks: true, globalSettings: true, livePreview: true },
      sectionBlocks: {
        hero: ['button', 'heading', 'text'],
        'featured-collection': ['product-card', 'title'],
      },
      notes: { productDataSource: 'render-store runtime SDK hooks (standardized)' },
    }),
    [derivedThemeId, themeName]
  );

  const addSectionInstance = (kind: BuilderSectionKind, index: number) => {
    setCanvasSections((prev) => {
      const instanceId = resolveInstanceId(kind, prev);
      const section: CanvasSection = { instanceId, config: defaultSectionConfig(kind) };
      setSelectedInstanceId(instanceId);
      setSidebarTab('editor');
      return insertAt(prev, index, section);
    });
  };

  const updateSectionConfig = (instanceId: string, config: SectionConfig) => {
    setCanvasSections((prev) => prev.map((s) => (s.instanceId === instanceId ? { ...s, config } : s)));
  };

  const placeDrop = (dropIndex: number) => {
    if (!dragState) return;
    if (dragState.source === 'library') {
      addSectionInstance(dragState.kind, dropIndex);
      setDragState(null);
      return;
    }
    if (dragState.source === 'canvas' && typeof dragState.index === 'number') {
      setCanvasSections((prev) => {
        const next = [...prev];
        const [moved] = next.splice(dragState.index!, 1);
        const adjusted = dragState.index! < dropIndex ? dropIndex - 1 : dropIndex;
        next.splice(adjusted, 0, moved);
        return next;
      });
    }
    setDragState(null);
  };

  const removeFromCanvas = (instanceId: string) => {
    setCanvasSections((prev) => prev.filter((s) => s.instanceId !== instanceId));
    setSelectedInstanceId((cur) => (cur === instanceId ? null : cur));
  };

  return (
    <div className="-m-4 h-[calc(100vh-48px)] bg-[#f3f4f6] sm:-m-6 lg:-m-8">
      <div className="flex h-full min-h-0">
        <aside className="flex h-full w-[360px] shrink-0 flex-col border-r border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-4 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Theme Creator</h2>
            <div className="mt-3 flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setSidebarTab('elements')}
                className={`flex-1 rounded-md px-2 py-2 text-sm font-medium transition ${sidebarTab === 'elements' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Elements
              </button>
              <button
                type="button"
                onClick={() => setSidebarTab('editor')}
                className={`flex-1 rounded-md px-2 py-2 text-sm font-medium transition ${sidebarTab === 'editor' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Editor
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {sidebarTab === 'elements'
                ? 'Drag blocks into the canvas. Schema and config update as you build.'
                : 'Edit the selected section — same fields the theme editor will use later.'}
            </p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            {sidebarTab === 'elements' ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Library</p>
                {SECTION_LIBRARY.map((item) => (
                  <div
                    key={item.kind}
                    draggable
                    onDragStart={() => setDragState({ source: 'library', kind: item.kind })}
                    onDragEnd={() => setDragState(null)}
                    className="cursor-grab rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50 active:cursor-grabbing"
                  >
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{item.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Theme</p>
                  <label className="block">
                    <span className="sr-only">Theme name</span>
                    <input
                      value={themeName}
                      onChange={(e) => setThemeName(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                      placeholder="Theme name"
                    />
                  </label>
                </div>
                <div className="space-y-2 border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Theme colors & fonts</p>
                  <CreateThemeGlobalSettingsEditor settings={themeGlobalSettings} onChange={setThemeGlobalSettings} />
                </div>
                <div className="space-y-2 border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Section settings</p>
                  {selectedCanvasItem ? (
                    <CreateThemeSectionEditor
                      config={selectedCanvasItem.config}
                      sectionLabel={selectedCanvasItem.label}
                      instanceId={selectedCanvasItem.instanceId}
                      onChange={(next) => updateSectionConfig(selectedCanvasItem.instanceId, next)}
                    />
                  ) : (
                    <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50/80 px-3 py-4 text-xs text-gray-500">
                      Click a section on the canvas to edit its content and styles.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-gray-100 px-4 py-3">
            <button
              type="button"
              onClick={() => {
                setActiveCodeTab('schema');
                setShowCodeModal(true);
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              View code
            </button>
          </div>
        </aside>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-3">
            <h3 className="text-sm font-semibold text-gray-900">Live canvas</h3>
            <div className="flex items-center gap-4">
              <Link to="/themes/all-themes" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Back to Theme Store
              </Link>
              <button
                type="button"
                onClick={() => {
                  setActiveCodeTab('schema');
                  setShowCodeModal(true);
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                View code
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-auto bg-[#f3f4f6] p-4">
            <section className="min-h-full rounded-2xl border border-gray-200 bg-white shadow-sm" style={canvasTypographyStyle}>
              <div className="p-4">
                {canvasSections.length === 0 ? (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => placeDrop(0)}
                    className="flex h-[70vh] min-h-[560px] items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white text-sm text-gray-500"
                  >
                    Drag Announcement bar / Hero / Product cards / Footer here
                  </div>
                ) : (
                  <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    {canvasItems.map((item, idx) => {
                      const c = item.config;
                      return (
                        <React.Fragment key={item.instanceId}>
                          <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => placeDrop(idx)}
                            className="h-6 border-t border-dashed border-transparent hover:border-blue-300 hover:bg-blue-50"
                          />
                          <div
                            draggable
                            onDragStart={() => setDragState({ source: 'canvas', kind: c.kind, index: idx })}
                            onDragEnd={() => setDragState(null)}
                            onClick={() => {
                              setSelectedInstanceId(item.instanceId);
                              setSidebarTab('editor');
                            }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedInstanceId(item.instanceId);
                                setSidebarTab('editor');
                              }
                            }}
                            className={`relative cursor-pointer border-t border-gray-100 outline-none ring-inset transition first:border-t-0 ${selectedInstanceId === item.instanceId ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-200'}`}
                          >
                            <div className="absolute right-2 top-2 z-10 flex gap-1">
                              <span className="rounded bg-white/90 px-2 py-1 text-[11px] text-gray-500 shadow-sm">{item.label}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFromCanvas(item.instanceId);
                                }}
                                className="rounded-md bg-white/90 px-2 py-1 text-xs text-gray-600 shadow-sm hover:text-red-600"
                              >
                                Remove
                              </button>
                            </div>

                            {c.kind === 'announcement_bar' && c.enabled ? (
                              <div className="px-4 py-2 text-center" style={sectionContainerStyle(c.appearance)}>
                                {c.message}
                                {c.linkLabel ? (
                                  <>
                                    {' '}
                                    — <span style={{ textDecoration: 'underline' }}>{c.linkLabel}</span>
                                  </>
                                ) : null}
                              </div>
                            ) : null}

                            {c.kind === 'hero_main' ? (
                              <div className="px-8 py-16 text-center" style={{ backgroundColor: c.appearance.backgroundColor }}>
                                <p style={{ ...textStyleToCss(c.eyebrowStyle), fontFamily: themeGlobalSettings.typography.fontFamilyBody }}>
                                  {c.eyebrow}
                                </p>
                                <h4
                                  className="mt-3"
                                  style={{
                                    ...textStyleToCss(c.titleStyle),
                                    fontFamily: themeGlobalSettings.typography.fontFamily,
                                    fontWeight: themeGlobalSettings.typography.headingFontWeight === 'bold' ? 700 : 400,
                                  }}
                                >
                                  {c.title}
                                </h4>
                                <p className="mx-auto mt-3 max-w-xl" style={textStyleToCss(c.subtitleStyle)}>
                                  {c.subtitle}
                                </p>
                                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                                  <button
                                    type="button"
                                    className="rounded-md px-4 py-2 text-sm font-medium text-white"
                                    style={{ backgroundColor: themeGlobalSettings.colors.primary }}
                                  >
                                    {c.primaryButtonLabel}
                                  </button>
                                  {c.secondaryButtonLabel ? (
                                    <button
                                      type="button"
                                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800"
                                    >
                                      {c.secondaryButtonLabel}
                                    </button>
                                  ) : null}
                                </div>
                              </div>
                            ) : null}

                            {c.kind === 'product_cards' ? (
                              <div className="px-8 py-10" style={{ backgroundColor: c.appearance.backgroundColor }}>
                                <div className="mb-5 flex items-center justify-between">
                                  <h4 style={textStyleToCss(c.headerStyle)}>{c.headerTitle}</h4>
                                  <span style={textStyleToCss(c.viewAllStyle)}>{c.viewAllLabel}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                  {Array.from({ length: Math.min(4, c.productsToShow) }).map((_, n) => (
                                    <div key={n} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                                      {c.showMedia ? <div className="h-28 bg-gray-100" /> : null}
                                      <div className="space-y-2 p-3">
                                        {c.showTitle ? <div className="h-3 w-4/5 rounded bg-gray-200" /> : null}
                                        {c.showPrice ? <div className="h-3 w-2/5 rounded bg-gray-300" /> : null}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : null}

                            {c.kind === 'footer' ? (
                              <div className="px-8 py-10 text-center" style={{ backgroundColor: c.appearance.backgroundColor }}>
                                <h4 style={textStyleToCss(c.titleStyle)}>{c.title}</h4>
                                {c.subtitle ? (
                                  <p className="mx-auto mt-2 max-w-md" style={textStyleToCss(c.subtitleStyle)}>
                                    {c.subtitle}
                                  </p>
                                ) : null}
                                <div className="mx-auto mt-4 flex max-w-md items-center gap-2">
                                  <input readOnly value={c.placeholder} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-500" />
                                  <button
                                    type="button"
                                    className="rounded-md px-4 py-2 text-sm text-white"
                                    style={{ backgroundColor: themeGlobalSettings.colors.primary }}
                                  >
                                    {c.buttonLabel}
                                  </button>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </React.Fragment>
                      );
                    })}
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => placeDrop(canvasSections.length)}
                      className="h-6 border-t border-dashed border-transparent hover:border-blue-300 hover:bg-blue-50"
                    />
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {showCodeModal ? (
        <div className="fixed inset-0 z-6000 flex items-center justify-center bg-black/35 px-4 py-6">
          <div className="flex h-[min(86vh,920px)] w-[min(1100px,96vw)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('schema')}
                  className={`rounded-md px-3 py-1.5 text-sm ${activeCodeTab === 'schema' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                >
                  theme.schema.json
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('config')}
                  className={`rounded-md px-3 py-1.5 text-sm ${activeCodeTab === 'config' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                >
                  theme.default-config.json
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('manifest')}
                  className={`rounded-md px-3 py-1.5 text-sm ${activeCodeTab === 'manifest' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                >
                  theme.manifest.json
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    activeCodeTab === 'schema'
                      ? downloadJson('theme.schema.json', schemaJson)
                      : activeCodeTab === 'config'
                        ? downloadJson('theme.default-config.json', defaultConfigJson)
                        : downloadJson('theme.manifest.json', manifestJson)
                  }
                  className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => setShowCodeModal(false)}
                  className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Close code modal"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 bg-gray-950 p-3">
              <pre className="h-full overflow-auto rounded-lg bg-gray-950 p-3 text-xs text-gray-100">
                {activeCodeTab === 'schema'
                  ? JSON.stringify(schemaJson, null, 2)
                  : activeCodeTab === 'config'
                    ? JSON.stringify(defaultConfigJson, null, 2)
                    : JSON.stringify(manifestJson, null, 2)}
              </pre>
            </div>
            <div className="border-t border-gray-200 px-4 py-3 text-right">
              <Link to="/themes/dev-editor" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">
                Open editor
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CreateThemePage;
