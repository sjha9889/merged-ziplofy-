import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { BLOCK_PREVIEW_SLIDES } from './add-block-catalog';
import {
  defaultExpandedCategoriesForGroup,
  defaultPreviewForSection,
  filterSectionCatalog,
  getSectionCatalogForGroup,
  type SectionCatalogEntry,
  type SectionCatalogGroup,
  type SectionCatalogIcon,
  type SectionCatalogItem,
} from './add-section-catalog';

const SHOPIFY_BLUE = '#005bd3';

function SectionCatalogIconView({ icon }: { icon: SectionCatalogIcon }) {
  const cls = 'h-[18px] w-[18px] shrink-0 text-gray-600';
  switch (icon) {
    case 'marquee':
      return (
        <svg className={cls} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M3 10h14M13 6l4 4-4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      );
    case 'code':
      return (
        <span className={`flex ${cls} items-center justify-center text-[11px] font-semibold`}>&lt;/&gt;</span>
      );
    case 'divider':
      return (
        <svg className={cls} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'hero':
      return (
        <svg className={cls} viewBox="0 0 20 20" fill="none" aria-hidden>
          <rect x="3" y="5" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1.25" />
          <path d="M7 9h6M9 12h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      );
    case 'collection':
      return (
        <svg className={cls} viewBox="0 0 20 20" fill="none" aria-hidden>
          <rect x="3" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.25" />
          <rect x="11" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.25" />
          <rect x="3" y="12" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.25" />
          <rect x="11" y="12" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      );
    case 'text':
      return (
        <svg className={cls} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M5 6h10M5 10h8M5 14h6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg className={cls} viewBox="0 0 20 20" fill="none" aria-hidden>
          <rect x="3" y="3" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.25" strokeDasharray="2 2" />
        </svg>
      );
  }
}

function SectionRow({
  item,
  indented,
  onHover,
  onSelect,
}: {
  item: SectionCatalogItem;
  indented?: boolean;
  onHover: () => void;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-2.5 rounded-md py-2 text-left text-sm text-gray-800 hover:bg-[#ededed] ${
        indented ? 'pl-8 pr-3' : 'px-3'
      }`}
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={onSelect}
    >
      <SectionCatalogIconView icon={item.icon} />
      {item.label}
    </button>
  );
}

function CategoryBlock({
  entry,
  isOpen,
  onToggle,
  onHover,
  onSelect,
}: {
  entry: Extract<SectionCatalogEntry, { type: 'category' }>;
  isOpen: boolean;
  onToggle: () => void;
  onHover: (item: SectionCatalogItem) => void;
  onSelect: (item: SectionCatalogItem) => void;
}) {
  if (!entry.items.length) return null;
  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold text-gray-800"
      >
        {entry.label}
        {isOpen ? (
          <ChevronUpIcon className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {isOpen
        ? entry.items.map((item) => (
            <SectionRow
              key={item.id}
              item={item}
              indented
              onHover={() => onHover(item)}
              onSelect={() => onSelect(item)}
            />
          ))
        : null}
    </div>
  );
}

function PreviewVisual({
  variant,
}: {
  variant: 'before-after' | 'product-card' | 'text-block' | 'newsletter';
}) {
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
  if (variant === 'newsletter') {
    return (
      <div className="mx-auto w-full max-w-[360px] rounded-2xl border border-gray-200 bg-white px-8 py-10 text-center shadow-md">
        <p className="text-lg font-bold text-gray-900">Join our email list</p>
        <p className="mt-2 text-sm text-gray-600">
          Get exclusive deals and early access to new products.
        </p>
        <div className="mt-6 flex gap-2">
          <div className="h-10 flex-1 rounded-md border border-gray-300 bg-gray-50" />
          <div className="flex h-10 shrink-0 items-center rounded-md bg-gray-900 px-4 text-sm font-medium text-white">
            Sign up
          </div>
        </div>
      </div>
    );
  }
  if (variant === 'product-card') {
    return (
      <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-3 shadow-lg">
        <div className="mb-3 aspect-[4/3] rounded-xl bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100" />
        <p className="text-sm font-semibold text-gray-900">Featured products</p>
        <p className="text-sm text-gray-600">From your catalog</p>
      </div>
    );
  }
  return (
    <div className="mx-auto w-full max-w-[300px] rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-md">
      <p className="text-lg font-semibold text-gray-900">Section preview</p>
      <p className="mt-2 text-sm text-gray-500">Add this section to your page.</p>
    </div>
  );
}

export type AddSectionModalProps = {
  open: boolean;
  groupId: SectionCatalogGroup;
  groupLabel: string;
  onClose: () => void;
  onSelectSection: (section: SectionCatalogItem) => void;
};

export const AddSectionModal: React.FC<AddSectionModalProps> = ({
  open,
  groupId,
  groupLabel,
  onClose,
  onSelectSection,
}) => {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'sections' | 'apps'>('sections');
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({ layout: true });
  const [hovered, setHovered] = useState<SectionCatalogItem | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const isHeaderGroup = groupId === 'header';
  const baseCatalog = useMemo(() => getSectionCatalogForGroup(groupId), [groupId]);
  const { entries } = useMemo(() => filterSectionCatalog(baseCatalog, search), [baseCatalog, search]);

  const activeSlide = useMemo(() => {
    if (hovered) return defaultPreviewForSection(hovered);
    return BLOCK_PREVIEW_SLIDES[slideIndex] ?? BLOCK_PREVIEW_SLIDES[0];
  }, [hovered, slideIndex]);

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
      setTab('sections');
      setHovered(null);
      setSlideIndex(0);
      setExpandedCats(defaultExpandedCategoriesForGroup(groupId));
    }
  }, [open, groupId]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[6000] bg-black/20"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`absolute left-[min(calc(300px+12px),92vw)] top-[12%] flex w-[min(920px,calc(100vw-320px))] max-w-[920px] overflow-hidden rounded-2xl bg-[#f6f6f7] shadow-2xl ring-1 ring-black/10 ${
          groupId === 'footer' ? 'h-[min(640px,82vh)]' : 'h-[min(520px,76vh)]'
        }`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-section-modal-title"
      >
        <div className="flex h-full w-full">
          <div className="flex w-[min(100%,380px)] shrink-0 flex-col border-r border-[#e1e1e1] bg-[#f6f6f7]">
            <div className="space-y-3 border-b border-[#e1e1e1] p-3">
              <div className="relative">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search sections"
                  className="w-full rounded-lg border border-[#8c9196] bg-white py-2 pl-9 pr-3 text-sm text-gray-900 shadow-sm outline-none focus:border-[#005bd3] focus:ring-2 focus:ring-[#005bd3]/25"
                  autoFocus
                />
              </div>
              {!isHeaderGroup ? (
                <>
                  <div className="flex gap-1 rounded-lg bg-[#ededed] p-0.5">
                    <button
                      type="button"
                      onClick={() => setTab('sections')}
                      className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium ${
                        tab === 'sections' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Sections
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
                </>
              ) : null}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-1 py-2">
              {tab === 'apps' ? (
                <p className="px-3 py-8 text-center text-sm text-gray-500">No apps available for this group yet.</p>
              ) : (
                <>
                  <p id="add-section-modal-title" className="sr-only">
                    Add section to {groupLabel}
                  </p>
                  {entries.length === 0 ? (
                    <p className="px-3 py-6 text-center text-sm text-gray-500">No sections match your search.</p>
                  ) : (
                    entries.map((entry) => {
                      if (entry.type === 'standalone') {
                        return (
                          <SectionRow
                            key={entry.item.id}
                            item={entry.item}
                            onHover={() => setHovered(entry.item)}
                            onSelect={() => onSelectSection(entry.item)}
                          />
                        );
                      }
                      const isOpen = expandedCats[entry.id] !== false;
                      return (
                        <CategoryBlock
                          key={entry.id}
                          entry={entry}
                          isOpen={isOpen}
                          onToggle={() =>
                            setExpandedCats((prev) => ({ ...prev, [entry.id]: !isOpen }))
                          }
                          onHover={setHovered}
                          onSelect={onSelectSection}
                        />
                      );
                    })
                  )}
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
                    setHovered(null);
                    setSlideIndex(i);
                  }}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    !hovered && slideIndex === i ? 'bg-gray-700' : 'bg-gray-400/60 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddSectionModal;
