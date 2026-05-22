import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Bars3Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  CursorArrowRaysIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  Squares2X2Icon,
  ViewColumnsIcon,
} from '@heroicons/react/24/outline';
import {
  BLOCK_PREVIEW_SLIDES,
  blocksForSection,
  filterBlockCatalog,
  getCatalogSections,
  type BlockCatalogIcon,
  type BlockCatalogItem,
  type BlockPreviewSlide,
  type CatalogSection,
} from './add-block-catalog';
import {
  filterBlocksForSection,
  getThemeCatalogSections,
  resolveSectionTypeForAddBlock,
  themeCatalogToBlockItems,
  type ThemeBlockCatalogApi,
} from './theme-block-catalog.adapter';

const SHOPIFY_BLUE = '#005bd3';

function DashedSquareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="3" y="3" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.25" strokeDasharray="2 2" />
    </svg>
  );
}

function CatalogIcon({ icon }: { icon: BlockCatalogIcon }) {
  const cls = 'h-[18px] w-[18px] shrink-0 text-gray-600';
  switch (icon) {
    case 'button':
      return <CursorArrowRaysIcon className={cls} />;
    case 'text':
    case 'jumbo':
      return <Bars3Icon className={cls} />;
    case 'title':
      return (
        <span className={`flex ${cls} items-center justify-center text-[13px] font-semibold leading-none`}>T</span>
      );
    case 'logo':
      return (
        <svg className={cls} viewBox="0 0 20 20" fill="none" aria-hidden>
          <rect x="3" y="5" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      );
    case 'link':
      return (
        <svg className={cls} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path
            d="M8.5 11.5l3-3M10.5 7.5a2.12 2.12 0 013 3l-2 2M9.5 12.5a2.12 2.12 0 01-3-3l2-2"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'price':
    case 'product-card':
      return (
        <svg className={cls} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path
            d="M6 4h8l1 2H5l1-2zm0 4v6a1 1 0 001 1h6a1 1 0 001-1V8"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          {icon === 'price' ? (
            <text x="10" y="13" textAnchor="middle" fill="currentColor" fontSize="6" fontWeight="600">
              $
            </text>
          ) : null}
        </svg>
      );
    case 'variant-picker':
      return (
        <svg className={cls} viewBox="0 0 20 20" fill="none" aria-hidden>
          <rect x="4" y="5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.25" />
          <path d="M12 9h4M14 7v4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      );
    case 'marquee':
      return (
        <svg className={cls} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M3 10h14M13 6l4 4-4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      );
    case 'group':
      return <Squares2X2Icon className={cls} />;
    case 'spacer':
      return <ViewColumnsIcon className={cls} />;
    case 'placeholder':
      return <DashedSquareIcon className={cls} />;
    default:
      return <DashedSquareIcon className={cls} />;
  }
}

function BlockRow({
  block,
  onHover,
  onSelect,
}: {
  block: BlockCatalogItem;
  onHover: () => void;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-gray-800 hover:bg-[#ededed]"
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={onSelect}
    >
      <CatalogIcon icon={block.icon} />
      {block.label}
    </button>
  );
}

function CategorySection({
  section,
  items,
  isOpen,
  onToggle,
  onHoverBlock,
  onSelectBlock,
}: {
  section: Extract<CatalogSection, { type: 'category' }>;
  items: BlockCatalogItem[];
  isOpen: boolean;
  onToggle: () => void;
  onHoverBlock: (block: BlockCatalogItem) => void;
  onSelectBlock: (block: BlockCatalogItem) => void;
}) {
  if (!items.length) return null;
  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold text-gray-800"
      >
        {section.label}
        {isOpen ? (
          <ChevronUpIcon className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {isOpen
        ? items.map((block) => (
            <BlockRow
              key={block.id}
              block={block}
              onHover={() => onHoverBlock(block)}
              onSelect={() => onSelectBlock(block)}
            />
          ))
        : null}
    </div>
  );
}

function PreviewVisual({ variant }: { variant: BlockPreviewSlide['variant'] }) {
  if (variant === 'before-after') {
    return (
      <div className="relative mx-auto w-full max-w-[340px] overflow-hidden rounded-2xl bg-[#e8e4df] shadow-md">
        <div className="flex h-[200px] items-stretch">
          <div className="flex-1 bg-gradient-to-br from-sky-200 to-amber-100" />
          <div className="relative w-1 shrink-0 bg-white shadow">
            <div className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow">
              <span className="text-xs text-gray-500">⇆</span>
            </div>
          </div>
          <div className="flex-1 bg-gradient-to-br from-orange-200 to-rose-200" />
        </div>
      </div>
    );
  }
  if (variant === 'product-card') {
    return (
      <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-3 shadow-lg">
        <div className="mb-3 aspect-[4/3] rounded-xl bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100" />
        <p className="text-sm font-semibold text-gray-900">Shirt</p>
        <p className="text-sm text-gray-600">$19.99</p>
      </div>
    );
  }
  return (
    <div className="mx-auto w-full max-w-[300px] rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-md">
      <p className="text-lg font-semibold text-gray-900">Heading</p>
      <p className="mt-2 text-sm text-gray-500">Add compelling copy to your section.</p>
    </div>
  );
}

export type AddBlockModalProps = {
  open: boolean;
  sectionLabel?: string;
  /** Theme-specific block list from S3 pack (schema + default-config + manifest). */
  themeBlockCatalog?: ThemeBlockCatalogApi | null;
  editorSchema?: { templates?: Array<{ sections?: Array<{ id?: string; type?: string }> }> } | null;
  addBlockNodeId?: string;
  onClose: () => void;
  onSelectBlock: (block: BlockCatalogItem) => void;
};

export const AddBlockModal: React.FC<AddBlockModalProps> = ({
  open,
  sectionLabel,
  themeBlockCatalog,
  editorSchema,
  addBlockNodeId,
  onClose,
  onSelectBlock,
}) => {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'blocks' | 'apps'>('blocks');
  const [showAll, setShowAll] = useState(false);
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({
    basic: true,
    decorative: true,
    layout: true,
    links: true,
    product: true,
  });
  const [hoveredBlock, setHoveredBlock] = useState<BlockCatalogItem | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setSearch('');
      setTab('blocks');
      setShowAll(false);
      setSlideIndex(0);
      setHoveredBlock(null);
    }
  }, [open]);

  const searching = search.trim().length > 0;
  const effectiveShowAll = showAll || searching;

  const usesThemeCatalog = Boolean(themeBlockCatalog?.blocks?.length);

  const filtered = useMemo(() => {
    if (usesThemeCatalog && themeBlockCatalog) {
      let items = themeCatalogToBlockItems(themeBlockCatalog);
      if (!effectiveShowAll) items = items.filter((b) => !b.extendedOnly);
      const q = search.trim().toLowerCase();
      if (q) {
        items = items.filter(
          (b) =>
            b.label.toLowerCase().includes(q) ||
            b.category.includes(q) ||
            b.keywords?.some((k) => k.includes(q))
        );
      }
      if (addBlockNodeId) {
        const sectionType = resolveSectionTypeForAddBlock(editorSchema ?? null, addBlockNodeId);
        items = filterBlocksForSection(themeBlockCatalog, sectionType, items);
      }
      return items;
    }
    return filterBlockCatalog(search, effectiveShowAll);
  }, [
    usesThemeCatalog,
    themeBlockCatalog,
    search,
    effectiveShowAll,
    addBlockNodeId,
    editorSchema,
  ]);

  const sections = useMemo(() => {
    if (usesThemeCatalog && themeBlockCatalog) {
      return getThemeCatalogSections(themeBlockCatalog, effectiveShowAll, search);
    }
    return getCatalogSections(effectiveShowAll, search);
  }, [usesThemeCatalog, themeBlockCatalog, effectiveShowAll, search]);

  const activeSlide = useMemo(() => {
    if (hoveredBlock) {
      const idx = BLOCK_PREVIEW_SLIDES.findIndex((s) => s.id === hoveredBlock.id);
      if (idx >= 0) return BLOCK_PREVIEW_SLIDES[idx];
      if (hoveredBlock.category === 'basic' || hoveredBlock.category === 'links') {
        return BLOCK_PREVIEW_SLIDES[2];
      }
      if (hoveredBlock.category === 'decorative') return BLOCK_PREVIEW_SLIDES[0];
      if (hoveredBlock.category === 'product') return BLOCK_PREVIEW_SLIDES[1];
      return BLOCK_PREVIEW_SLIDES[1];
    }
    return BLOCK_PREVIEW_SLIDES[slideIndex] ?? BLOCK_PREVIEW_SLIDES[0];
  }, [hoveredBlock, slideIndex]);

  const toggleCat = (id: string) => {
    setExpandedCats((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/25 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex h-[min(520px,88vh)] w-full max-w-[920px] overflow-hidden rounded-2xl bg-[#f6f6f7] shadow-2xl ring-1 ring-black/10"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-block-modal-title"
      >
        <div className="flex w-[min(100%,380px)] shrink-0 flex-col border-r border-[#e1e1e1] bg-[#f6f6f7]">
          <div className="space-y-3 border-b border-[#e1e1e1] p-3">
            <div className="relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search blocks"
                className="w-full rounded-lg border border-[#8c9196] bg-white py-2 pl-9 pr-3 text-sm text-gray-900 shadow-sm outline-none focus:border-[#005bd3] focus:ring-2 focus:ring-[#005bd3]/25"
                autoFocus
              />
            </div>
            <div className="flex gap-1 rounded-lg bg-[#ededed] p-0.5">
              <button
                type="button"
                onClick={() => setTab('blocks')}
                className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium ${
                  tab === 'blocks' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Blocks
              </button>
              <button
                type="button"
                onClick={() => setTab('apps')}
                className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium ${
                  tab === 'apps' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Apps
              </button>
            </div>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#e1e1e1] bg-[#f3f1f8] px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-[#ebe8f2]"
            >
              <SparklesIcon className="h-4 w-4 text-violet-600" />
              Generate
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-1 py-2">
            {tab === 'apps' ? (
              <p className="px-3 py-8 text-center text-sm text-gray-500">No apps available for this section yet.</p>
            ) : (
              <>
                <p id="add-block-modal-title" className="sr-only">
                  Add block{sectionLabel ? ` to ${sectionLabel}` : ''}
                </p>
                {sections.map((section) => {
                  if (section.type === 'standalone') {
                    const items = blocksForSection(section, filtered);
                    if (!items.length) return null;
                    return (
                      <div key={section.item.id} className="mb-1">
                        {items.map((block) => (
                          <BlockRow
                            key={block.id}
                            block={block}
                            onHover={() => setHoveredBlock(block)}
                            onSelect={() => onSelectBlock(block)}
                          />
                        ))}
                      </div>
                    );
                  }
                  const items = blocksForSection(section, filtered);
                  const catId = section.id;
                  const isOpen = expandedCats[catId] !== false;
                  return (
                    <CategorySection
                      key={catId}
                      section={section}
                      items={items}
                      isOpen={isOpen}
                      onToggle={() => toggleCat(catId)}
                      onHoverBlock={setHoveredBlock}
                      onSelectBlock={onSelectBlock}
                    />
                  );
                })}
                {!searching && filtered.some((b) => b.extendedOnly) ? (
                  <button
                    type="button"
                    className="mt-2 w-full px-3 py-2 text-left text-sm font-medium hover:underline"
                    style={{ color: SHOPIFY_BLUE }}
                    onClick={() => setShowAll((v) => !v)}
                  >
                    {showAll ? 'Show less' : 'Show all'}
                  </button>
                ) : null}
              </>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col bg-[#f1f1f1] px-6 py-8">
          <div className="text-center">
            <p className="text-base text-gray-800">{activeSlide.headline}</p>
            <p className="mt-0.5 text-base font-semibold text-violet-700">{activeSlide.headlineAccent}</p>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center py-6">
            <PreviewVisual variant={activeSlide.variant} />
            <p className="mt-5 text-center text-sm text-gray-600">{activeSlide.caption}</p>
          </div>
          <div className="flex justify-center gap-1.5 pb-2">
            {BLOCK_PREVIEW_SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Preview slide ${i + 1}`}
                onClick={() => {
                  setHoveredBlock(null);
                  setSlideIndex(i);
                }}
                className={`h-2 w-2 rounded-full transition-colors ${
                  !hoveredBlock && slideIndex === i ? 'bg-gray-700' : 'bg-gray-400/60 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddBlockModal;
