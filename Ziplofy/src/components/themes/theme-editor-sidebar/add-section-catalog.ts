import { BLOCK_PREVIEW_SLIDES, type BlockPreviewSlide } from './add-block-catalog';

export type SectionCatalogGroup = 'header' | 'template' | 'footer';

export type SectionCatalogIcon =
  | 'marquee'
  | 'code'
  | 'divider'
  | 'section'
  | 'hero'
  | 'collection'
  | 'text';

function catalogItem(
  partial: SectionCatalogItem & { id: string; label: string }
): SectionCatalogItem {
  return { icon: 'section', ...partial };
}

export type SectionCatalogItem = {
  id: string;
  label: string;
  icon: SectionCatalogIcon;
  keywords?: string[];
  previewVariant?: BlockPreviewSlide['variant'];
  previewCaption?: string;
};

export type SectionCatalogEntry =
  | { type: 'standalone'; item: SectionCatalogItem }
  | { type: 'category'; id: string; label: string; items: SectionCatalogItem[] };

/** Shopify-style sections available in the Header group. */
export const HEADER_SECTION_CATALOG: SectionCatalogEntry[] = [
  {
    type: 'standalone',
    item: {
      id: 'announcement-bar',
      label: 'Announcement bar',
      icon: 'marquee',
      keywords: ['banner', 'promo', 'ticker'],
      previewVariant: 'text-block',
      previewCaption: 'Share promotions and store news at the top of every page',
    },
  },
  {
    type: 'category',
    id: 'layout',
    label: 'Layout',
    items: [
      {
        id: 'divider',
        label: 'Divider',
        icon: 'divider',
        keywords: ['line', 'separator', 'rule'],
        previewVariant: 'before-after',
        previewCaption: 'A horizontal line to separate content',
      },
    ],
  },
];

export const TEMPLATE_SECTION_CATALOG: SectionCatalogEntry[] = [
  {
    type: 'standalone',
    item: {
      id: 'hero',
      label: 'Hero',
      icon: 'hero',
      keywords: ['banner', 'image'],
      previewVariant: 'text-block',
      previewCaption: 'Large heading area with buttons',
    },
  },
  {
    type: 'standalone',
    item: {
      id: 'featured-collection',
      label: 'Featured collection',
      icon: 'collection',
      keywords: ['products', 'grid'],
      previewVariant: 'product-card',
      previewCaption: 'Showcase products from a collection',
    },
  },
  {
    type: 'category',
    id: 'layout',
    label: 'Layout',
    items: [
      {
        id: 'divider',
        label: 'Divider',
        icon: 'divider',
        previewVariant: 'before-after',
        previewCaption: 'A horizontal line to separate content',
      },
    ],
  },
];

/** Shopify-style sections available in the Footer group. */
export const FOOTER_SECTION_CATALOG: SectionCatalogEntry[] = [
  {
    type: 'category',
    id: 'layout',
    label: 'Layout',
    items: [
      catalogItem({
        id: 'custom-section',
        label: 'Custom section',
        keywords: ['blank', 'custom'],
        previewVariant: 'text-block',
        previewCaption: 'Build a section with blocks and settings',
      }),
      catalogItem({
        id: 'divider',
        label: 'Divider',
        icon: 'divider',
        keywords: ['line', 'separator'],
        previewVariant: 'before-after',
        previewCaption: 'A horizontal line to separate content',
      }),
    ],
  },
  {
    type: 'category',
    id: 'products',
    label: 'Products',
    items: [
      catalogItem({
        id: 'product-highlight',
        label: 'Product highlight',
        icon: 'collection',
        keywords: ['product', 'featured'],
        previewVariant: 'product-card',
        previewCaption: 'Spotlight a single product with media and details',
      }),
    ],
  },
  {
    type: 'category',
    id: 'storytelling',
    label: 'Storytelling',
    items: [
      catalogItem({ id: 'editorial', label: 'Editorial', keywords: ['story', 'article'] }),
      catalogItem({ id: 'editorial-jumbo', label: 'Editorial: Jumbo text', keywords: ['large', 'display'] }),
      catalogItem({ id: 'image-compare', label: 'Image compare', keywords: ['before', 'after', 'slider'] }),
      catalogItem({ id: 'image-with-text', label: 'Image with text', keywords: ['media', 'copy'] }),
      catalogItem({ id: 'logo', label: 'Logo', keywords: ['brand'] }),
      catalogItem({ id: 'video', label: 'Video', keywords: ['media', 'youtube'] }),
    ],
  },
  {
    type: 'category',
    id: 'text',
    label: 'Text',
    items: [
      catalogItem({ id: 'faq', label: 'FAQ', icon: 'text', keywords: ['questions', 'accordion'] }),
      catalogItem({ id: 'icons-with-text', label: 'Icons with text', icon: 'text', keywords: ['features'] }),
      catalogItem({ id: 'multicolumn', label: 'Multicolumn', icon: 'text', keywords: ['columns', 'grid'] }),
      catalogItem({ id: 'pull-quote', label: 'Pull quote', icon: 'text', keywords: ['quote', 'testimonial'] }),
      catalogItem({ id: 'rich-text', label: 'Rich text', icon: 'text', keywords: ['content', 'paragraph'] }),
    ],
  },
  {
    type: 'category',
    id: 'forms',
    label: 'Forms',
    items: [
      catalogItem({
        id: 'contact-form',
        label: 'Contact form',
        keywords: ['email', 'message', 'inquiry'],
        previewVariant: 'text-block',
        previewCaption: 'Let customers send you a message',
      }),
      catalogItem({
        id: 'email-signup',
        label: 'Email signup',
        keywords: ['newsletter', 'subscribe', 'mailing'],
        previewVariant: 'newsletter',
        previewCaption: 'Collect emails with a signup form',
      }),
    ],
  },
  {
    type: 'category',
    id: 'footer',
    label: 'Footer',
    items: [
      catalogItem({
        id: 'footer',
        label: 'Footer',
        keywords: ['links', 'menu', 'copyright'],
        previewVariant: 'text-block',
        previewCaption: 'Site links, social icons, and copyright',
      }),
      catalogItem({
        id: 'policies-links',
        label: 'Policies and links',
        keywords: ['privacy', 'terms', 'legal'],
        previewVariant: 'text-block',
        previewCaption: 'Policy links and utility navigation',
      }),
    ],
  },
];

export function defaultExpandedCategoriesForGroup(groupId: SectionCatalogGroup): Record<string, boolean> {
  if (groupId === 'footer') {
    return {
      layout: true,
      products: true,
      storytelling: true,
      text: true,
      forms: true,
      footer: true,
    };
  }
  return { layout: true };
}

export type SectionInsertContext = {
  groupId: SectionCatalogGroup;
  groupLabel: string;
  /** Insert immediately after this sidebar section node (omit when inserting at group start). */
  afterNodeId?: string;
  /** Insert immediately before this sidebar section node (used when the gap follows "Add section"). */
  beforeNodeId?: string;
};

export function resolveSectionCatalogGroupFromNodeId(nodeId: string): {
  groupId: SectionCatalogGroup;
  groupLabel: string;
} {
  if (nodeId.startsWith('layout:footer') || nodeId === 'layout:footer_utilities') {
    return { groupId: 'footer', groupLabel: 'Footer' };
  }
  if (nodeId.startsWith('layout:')) {
    return { groupId: 'header', groupLabel: 'Header' };
  }
  if (nodeId.startsWith('template:')) {
    return { groupId: 'template', groupLabel: 'Template' };
  }
  return { groupId: 'template', groupLabel: 'Template' };
}

export function resolveAddSectionGroup(nodeId: string): {
  groupId: SectionCatalogGroup;
  groupLabel: string;
} {
  if (nodeId === 'layout:add-section') {
    return { groupId: 'header', groupLabel: 'Header' };
  }
  if (nodeId === 'layout:footer-group:add-section') {
    return { groupId: 'footer', groupLabel: 'Footer' };
  }
  if (nodeId.includes(':add-section')) {
    return { groupId: 'template', groupLabel: 'Template' };
  }
  return { groupId: 'template', groupLabel: 'Template' };
}

export function getSectionCatalogForGroup(groupId: SectionCatalogGroup): SectionCatalogEntry[] {
  if (groupId === 'header') return HEADER_SECTION_CATALOG;
  if (groupId === 'footer') return FOOTER_SECTION_CATALOG;
  return TEMPLATE_SECTION_CATALOG;
}

export function filterSectionCatalog(
  entries: SectionCatalogEntry[],
  query: string
): { entries: SectionCatalogEntry[]; items: SectionCatalogItem[] } {
  const q = query.trim().toLowerCase();
  if (!q) {
    const items: SectionCatalogItem[] = [];
    for (const entry of entries) {
      if (entry.type === 'standalone') items.push(entry.item);
      else items.push(...entry.items);
    }
    return { entries, items };
  }

  const items: SectionCatalogItem[] = [];
  const filteredEntries: SectionCatalogEntry[] = [];

  for (const entry of entries) {
    if (entry.type === 'standalone') {
      const match =
        entry.item.label.toLowerCase().includes(q) ||
        entry.item.keywords?.some((k) => k.includes(q));
      if (match) {
        filteredEntries.push(entry);
        items.push(entry.item);
      }
      continue;
    }
    const matchedItems = entry.items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) || item.keywords?.some((k) => k.includes(q))
    );
    if (matchedItems.length) {
      filteredEntries.push({ ...entry, items: matchedItems });
      items.push(...matchedItems);
    }
  }

  return { entries: filteredEntries, items };
}

export function defaultPreviewForSection(item: SectionCatalogItem | null): BlockPreviewSlide {
  if (!item) return BLOCK_PREVIEW_SLIDES[0];
  const variant = item.previewVariant ?? 'text-block';
  const base = BLOCK_PREVIEW_SLIDES.find((s) => s.id === variant) ?? BLOCK_PREVIEW_SLIDES[0];
  if (item.previewCaption) {
    return { ...base, caption: item.previewCaption };
  }
  return base;
}
