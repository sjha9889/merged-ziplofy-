import type { SidebarIcon } from './theme-editor-sidebar.types';

export type BlockCatalogCategory = 'basic' | 'decorative' | 'layout' | 'links' | 'product';

export type BlockCatalogIcon =
  | SidebarIcon
  | 'logo'
  | 'jumbo'
  | 'marquee'
  | 'group'
  | 'spacer'
  | 'link'
  | 'placeholder'
  | 'title'
  | 'variant-picker';

export type BlockCatalogItem = {
  id: string;
  label: string;
  category: BlockCatalogCategory;
  icon: BlockCatalogIcon;
  keywords?: string[];
  /** Only listed after user clicks "Show all". */
  extendedOnly?: boolean;
};

export type BlockPreviewSlide = {
  id: string;
  headline: string;
  headlineAccent: string;
  caption: string;
  variant: 'before-after' | 'product-card' | 'text-block' | 'newsletter';
};

export type CatalogSection =
  | { type: 'category'; id: BlockCatalogCategory; label: string }
  | { type: 'standalone'; item: BlockCatalogItem };

export const BLOCK_CATALOG_CATEGORIES_COMPACT: { id: BlockCatalogCategory; label: string }[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'decorative', label: 'Decorative' },
  { id: 'layout', label: 'Layout' },
];

export const BLOCK_CATALOG_CATEGORIES_EXTENDED: { id: BlockCatalogCategory; label: string }[] = [
  { id: 'links', label: 'Links' },
  { id: 'product', label: 'Product' },
];

export const BLOCK_CATALOG: BlockCatalogItem[] = [
  { id: 'button', label: 'Button', category: 'basic', icon: 'button', keywords: ['cta', 'link'] },
  { id: 'heading', label: 'Heading', category: 'basic', icon: 'text', keywords: ['title', 'h1'] },
  { id: 'logo', label: 'Logo', category: 'basic', icon: 'logo', keywords: ['brand', 'image'] },
  { id: 'text', label: 'Text', category: 'basic', icon: 'text', keywords: ['paragraph', 'body'] },
  {
    id: 'jumbo-text',
    label: 'Jumbo text',
    category: 'decorative',
    icon: 'jumbo',
    keywords: ['large', 'display'],
  },
  { id: 'marquee', label: 'Marquee', category: 'decorative', icon: 'marquee', keywords: ['scroll', 'ticker'] },
  { id: 'group', label: 'Group', category: 'layout', icon: 'group', keywords: ['container', 'wrapper'] },
  {
    id: 'spacer',
    label: 'Spacer',
    category: 'layout',
    icon: 'spacer',
    keywords: ['gap', 'space'],
    extendedOnly: true,
  },
  { id: 'menu', label: 'Menu', category: 'links', icon: 'link', keywords: ['navigation'], extendedOnly: true },
  {
    id: 'popup-link',
    label: 'Popup link',
    category: 'links',
    icon: 'link',
    keywords: ['modal', 'dialog'],
    extendedOnly: true,
  },
  {
    id: 'buy-buttons',
    label: 'Buy buttons',
    category: 'product',
    icon: 'button',
    keywords: ['add to cart', 'checkout'],
    extendedOnly: true,
  },
  {
    id: 'description',
    label: 'Description',
    category: 'product',
    icon: 'text',
    keywords: ['body', 'details'],
    extendedOnly: true,
  },
  {
    id: 'price',
    label: 'Price',
    category: 'product',
    icon: 'price',
    keywords: ['money', 'cost'],
    extendedOnly: true,
  },
  {
    id: 'product-card',
    label: 'Product card',
    category: 'product',
    icon: 'product-card',
    keywords: ['card', 'tile'],
    extendedOnly: true,
  },
  {
    id: 'product-inventory',
    label: 'Product inventory',
    category: 'product',
    icon: 'placeholder',
    keywords: ['stock'],
    extendedOnly: true,
  },
  {
    id: 'recommended-products',
    label: 'Recommended products',
    category: 'product',
    icon: 'placeholder',
    keywords: ['related', 'upsell'],
    extendedOnly: true,
  },
  {
    id: 'review-stars',
    label: 'Review stars',
    category: 'product',
    icon: 'placeholder',
    keywords: ['rating', 'reviews'],
    extendedOnly: true,
  },
  {
    id: 'sku',
    label: 'SKU',
    category: 'product',
    icon: 'placeholder',
    keywords: ['stock keeping unit'],
    extendedOnly: true,
  },
  {
    id: 'special-instructions',
    label: 'Special instructions',
    category: 'product',
    icon: 'placeholder',
    keywords: ['note', 'gift message'],
    extendedOnly: true,
  },
  {
    id: 'swatches',
    label: 'Swatches',
    category: 'product',
    icon: 'placeholder',
    keywords: ['color', 'variant'],
    extendedOnly: true,
  },
  {
    id: 'title',
    label: 'Title',
    category: 'product',
    icon: 'title',
    keywords: ['product name', 'heading'],
    extendedOnly: true,
  },
  {
    id: 'variant-picker',
    label: 'Variant picker',
    category: 'product',
    icon: 'variant-picker',
    keywords: ['options', 'size'],
    extendedOnly: true,
  },
];

export const BLOCK_PREVIEW_SLIDES: BlockPreviewSlide[] = [
  {
    id: 'before-after',
    headline: 'Have an idea?',
    headlineAccent: "Let's bring it to life",
    caption: 'A before/after image slider',
    variant: 'before-after',
  },
  {
    id: 'product-card',
    headline: 'Have an idea?',
    headlineAccent: "Let's bring it to life",
    caption: 'A holographic product card',
    variant: 'product-card',
  },
  {
    id: 'text-block',
    headline: 'Have an idea?',
    headlineAccent: "Let's bring it to life",
    caption: 'Rich text and headings for any section',
    variant: 'text-block',
  },
  {
    id: 'newsletter',
    headline: 'Grow your audience',
    headlineAccent: 'with email signup',
    caption: 'Collect emails with a signup form in your footer',
    variant: 'newsletter',
  },
];

const SPACER_ITEM = BLOCK_CATALOG.find((b) => b.id === 'spacer')!;

export function getCatalogSections(showAll: boolean, searchQuery: string): CatalogSection[] {
  const q = searchQuery.trim().toLowerCase();
  const searching = q.length > 0;

  if (searching) {
    const matched = filterBlockCatalog(searchQuery, true);
    const categories = new Set(matched.map((b) => b.category));
    const sections: CatalogSection[] = [];
    for (const cat of [...BLOCK_CATALOG_CATEGORIES_COMPACT, ...BLOCK_CATALOG_CATEGORIES_EXTENDED]) {
      if (categories.has(cat.id)) sections.push({ type: 'category', id: cat.id, label: cat.label });
    }
    return sections;
  }

  const sections: CatalogSection[] = BLOCK_CATALOG_CATEGORIES_COMPACT.map((c) => ({
    type: 'category' as const,
    id: c.id,
    label: c.label,
  }));

  if (showAll) {
    sections.push({ type: 'standalone', item: SPACER_ITEM });
    for (const cat of BLOCK_CATALOG_CATEGORIES_EXTENDED) {
      sections.push({ type: 'category', id: cat.id, label: cat.label });
    }
  }

  return sections;
}

export function filterBlockCatalog(query: string, showAll: boolean): BlockCatalogItem[] {
  const q = query.trim().toLowerCase();
  let pool = BLOCK_CATALOG;
  if (!showAll && !q) {
    pool = BLOCK_CATALOG.filter((b) => !b.extendedOnly);
  }
  if (!q) return pool;
  return pool.filter(
    (b) =>
      b.label.toLowerCase().includes(q) ||
      b.category.includes(q) ||
      b.keywords?.some((k) => k.includes(q))
  );
}

export function blocksForSection(
  section: CatalogSection,
  items: BlockCatalogItem[]
): BlockCatalogItem[] {
  if (section.type === 'standalone') {
    return items.some((b) => b.id === section.item.id) ? [section.item] : [];
  }
  return items.filter((b) => b.category === section.id);
}

export function blocksByCategory(
  items: BlockCatalogItem[]
): Record<BlockCatalogCategory, BlockCatalogItem[]> {
  const out: Record<BlockCatalogCategory, BlockCatalogItem[]> = {
    basic: [],
    decorative: [],
    layout: [],
    links: [],
    product: [],
  };
  for (const item of items) out[item.category].push(item);
  return out;
}

/** @deprecated Use getCatalogSections — kept for compatibility */
export const BLOCK_CATALOG_CATEGORIES = BLOCK_CATALOG_CATEGORIES_COMPACT;
