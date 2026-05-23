import { BLOCK_PREVIEW_SLIDES, type BlockPreviewSlide } from './add-block-catalog';

export type SectionCatalogGroup = 'header' | 'template' | 'footer';

export type SectionCatalogIcon =
  | 'marquee'
  | 'code'
  | 'divider'
  | 'section'
  | 'hero'
  | 'slideshow'
  | 'collection'
  | 'link'
  | 'form'
  | 'blocks'
  | 'blog'
  | 'highlight'
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

/** Maps add-section catalog ids → template blueprint section in theme.schema. */
export const TEMPLATE_SECTION_RESOLVE: Record<string, { blueprintId: string; type: string }> = {
  hero: { blueprintId: 'hero_main', type: 'hero' },
  'hero-bottom-aligned': { blueprintId: 'hero_main', type: 'hero' },
  'hero-marquee': { blueprintId: 'hero_main', type: 'hero' },
  'large-logo': { blueprintId: 'hero_main', type: 'hero' },
  'layered-slideshow': { blueprintId: 'hero_main', type: 'hero' },
  'slideshow-full-frame': { blueprintId: 'hero_main', type: 'hero' },
  'slideshow-inset': { blueprintId: 'hero_main', type: 'hero' },
  'split-showcase': { blueprintId: 'hero_main', type: 'hero' },
  'featured-collection': { blueprintId: 'featured_collection', type: 'featured-collection' },
  'featured-collection-carousel': { blueprintId: 'featured_collection', type: 'featured-collection' },
  'featured-collection-editorial': { blueprintId: 'featured_collection', type: 'featured-collection' },
  'featured-collection-grid': { blueprintId: 'featured_collection', type: 'featured-collection' },
  'product-highlight': { blueprintId: 'featured_collection', type: 'featured-collection' },
  'featured-product': { blueprintId: 'featured_collection', type: 'featured-collection' },
  'product-hotspots': { blueprintId: 'featured_collection', type: 'featured-collection' },
  'recommended-products': { blueprintId: 'featured_collection', type: 'featured-collection' },
  'product-list': { blueprintId: 'featured_collection', type: 'featured-collection' },
  'collection-list': { blueprintId: 'featured_collection', type: 'featured-collection' },
  'collection-links-spotlight': { blueprintId: 'featured_collection', type: 'featured-collection' },
  'collection-links-text': { blueprintId: 'featured_collection', type: 'featured-collection' },
  'collection-list-bento': { blueprintId: 'featured_collection', type: 'featured-collection' },
  'collection-list-carousel': { blueprintId: 'featured_collection', type: 'featured-collection' },
  'collection-list-editorial': { blueprintId: 'featured_collection', type: 'featured-collection' },
  'collection-list-grid': { blueprintId: 'featured_collection', type: 'featured-collection' },
  divider: { blueprintId: 'divider', type: 'divider' },
  'custom-liquid': { blueprintId: 'hero_main', type: 'hero' },
  'custom-section': { blueprintId: 'hero_main', type: 'hero' },
  'blog-posts-carousel': { blueprintId: 'hero_main', type: 'hero' },
  'blog-posts-editorial': { blueprintId: 'hero_main', type: 'hero' },
  'blog-posts-grid': { blueprintId: 'hero_main', type: 'hero' },
  'storytelling-carousel': { blueprintId: 'hero_main', type: 'hero' },
  editorial: { blueprintId: 'hero_main', type: 'hero' },
  'editorial-jumbo': { blueprintId: 'hero_main', type: 'hero' },
  'image-compare': { blueprintId: 'hero_main', type: 'hero' },
  'image-with-text': { blueprintId: 'hero_main', type: 'hero' },
  logo: { blueprintId: 'hero_main', type: 'hero' },
  video: { blueprintId: 'hero_main', type: 'hero' },
  faq: { blueprintId: 'hero_main', type: 'hero' },
  'icons-with-text': { blueprintId: 'hero_main', type: 'hero' },
  'text-marquee': { blueprintId: 'hero_main', type: 'hero' },
  multicolumn: { blueprintId: 'hero_main', type: 'hero' },
  'pull-quote': { blueprintId: 'hero_main', type: 'hero' },
  'rich-text': { blueprintId: 'hero_main', type: 'hero' },
  'contact-form': { blueprintId: 'hero_main', type: 'hero' },
  'email-signup': { blueprintId: 'hero_main', type: 'hero' },
};

/** Header/footer layout insert targets (schema `layout` blueprints). */
export const LAYOUT_SECTION_RESOLVE: Record<string, { blueprintId: string; type: string; label: string }> = {
  'custom-liquid': { blueprintId: 'divider', type: 'divider', label: 'Custom Liquid' },
  'custom-section': { blueprintId: 'divider', type: 'divider', label: 'Custom section' },
  divider: { blueprintId: 'divider', type: 'divider', label: 'Divider' },
};

/** Footer Add section → layout blueprint (divider stub until footer template sections exist). */
export const FOOTER_BANNER_RESOLVE: Record<string, { blueprintId: string; type: string; label: string }> = {
  hero: { blueprintId: 'divider', type: 'divider', label: 'Hero' },
  'hero-bottom-aligned': { blueprintId: 'divider', type: 'divider', label: 'Hero: Bottom aligned' },
  'hero-marquee': { blueprintId: 'divider', type: 'divider', label: 'Hero: Marquee' },
  'large-logo': { blueprintId: 'divider', type: 'divider', label: 'Large logo' },
  'split-showcase': { blueprintId: 'divider', type: 'divider', label: 'Split showcase' },
};

/** Footer Add section → layout blueprint for form variants. */
export const FOOTER_FORMS_RESOLVE: Record<string, { blueprintId: string; type: string; label: string }> = {
  'contact-form': { blueprintId: 'divider', type: 'divider', label: 'Contact form' },
  'email-signup': { blueprintId: 'divider', type: 'divider', label: 'Email signup' },
};

/** Footer Add section → layout blueprint for product variants. */
export const FOOTER_PRODUCTS_RESOLVE: Record<string, { blueprintId: string; type: string; label: string }> = {
  'product-highlight': { blueprintId: 'divider', type: 'divider', label: 'Product highlight' },
};

/** Footer Add section → layout blueprint for text variants. */
export const FOOTER_TEXT_RESOLVE: Record<string, { blueprintId: string; type: string; label: string }> = {
  faq: { blueprintId: 'divider', type: 'divider', label: 'FAQ' },
  'icons-with-text': { blueprintId: 'divider', type: 'divider', label: 'Icons with text' },
  multicolumn: { blueprintId: 'divider', type: 'divider', label: 'Multicolumn' },
  'pull-quote': { blueprintId: 'divider', type: 'divider', label: 'Pull quote' },
  'rich-text': { blueprintId: 'divider', type: 'divider', label: 'Rich text' },
};

/** Footer Add section → layout blueprint for storytelling variants. */
export const FOOTER_STORYTELLING_RESOLVE: Record<string, { blueprintId: string; type: string; label: string }> = {
  editorial: { blueprintId: 'divider', type: 'divider', label: 'Editorial' },
  'editorial-jumbo': { blueprintId: 'divider', type: 'divider', label: 'Editorial: Jumbo text' },
  'image-compare': { blueprintId: 'divider', type: 'divider', label: 'Image compare' },
  'image-with-text': { blueprintId: 'divider', type: 'divider', label: 'Image with text' },
  logo: { blueprintId: 'divider', type: 'divider', label: 'Logo' },
  video: { blueprintId: 'divider', type: 'divider', label: 'Video' },
};

function layoutLiquidItem(): SectionCatalogItem {
  return {
    id: 'custom-liquid',
    label: 'Custom Liquid',
    icon: 'code',
    keywords: ['liquid', 'code', 'html', 'custom'],
    previewVariant: 'text-block',
    previewCaption: 'Add custom Liquid code to your theme',
  };
}

function layoutBlockItem(
  id: string,
  label: string,
  keywords: string[] = [],
  previewVariant: SectionCatalogItem['previewVariant'] = 'before-after',
  previewCaption?: string
): SectionCatalogItem {
  return {
    id,
    label,
    icon: 'blocks',
    keywords: ['layout', ...keywords],
    previewVariant,
    previewCaption,
  };
}

const LAYOUT_CATEGORY_ITEMS: SectionCatalogItem[] = [
  layoutLiquidItem(),
  layoutBlockItem('custom-section', 'Custom section', ['blank', 'custom', 'blocks'], 'custom-section', 'Build a section with blocks and settings'),
  layoutBlockItem('divider', 'Divider', ['line', 'separator', 'rule'], 'divider', 'A horizontal line to separate content'),
];

/** Header layout options (no Custom Liquid). */
const HEADER_LAYOUT_ITEMS: SectionCatalogItem[] = [
  layoutBlockItem('custom-section', 'Custom section', ['blank', 'custom', 'blocks'], 'custom-section', 'Build a section with blocks and settings'),
  layoutBlockItem('divider', 'Divider', ['line', 'separator', 'rule'], 'divider', 'A horizontal line to separate content'),
];

/** Shopify-style sections available in the Header group. */
export const HEADER_SECTION_CATALOG: SectionCatalogEntry[] = [
  {
    type: 'standalone',
    item: {
      id: 'announcement-bar',
      label: 'Announcement bar',
      icon: 'marquee',
      keywords: ['banner', 'promo', 'ticker'],
      previewVariant: 'announcement-bar',
      previewCaption: 'Share promotions and store news at the top of every page',
    },
  },
  {
    type: 'category',
    id: 'layout',
    label: 'Layout',
    items: [...HEADER_LAYOUT_ITEMS],
  },
];

function formItem(
  id: string,
  label: string,
  previewVariant: 'contact-form' | 'newsletter' | 'text-block',
  keywords: string[] = [],
  previewCaption?: string
): SectionCatalogItem {
  return {
    id,
    label,
    icon: 'form',
    keywords: ['form', ...keywords],
    previewVariant,
    previewCaption,
  };
}

function collectionLinkItem(
  id: string,
  label: string,
  keywords: string[] = []
): SectionCatalogItem {
  const previewVariant: SectionCatalogItem['previewVariant'] =
    id === 'collection-links-spotlight'
      ? 'collection-links-spotlight'
      : id === 'collection-links-text'
        ? 'collection-links-text'
        : 'product-card';
  return {
    id,
    label,
    icon: 'link',
    keywords: ['collection', 'links', ...keywords],
    previewVariant,
    previewCaption: label,
  };
}

function productItem(
  id: string,
  label: string,
  keywords: string[] = [],
  icon: SectionCatalogIcon = 'blocks'
): SectionCatalogItem {
  const previewVariant: SectionCatalogItem['previewVariant'] =
    id === 'featured-collection-carousel'
      ? 'featured-collection-carousel'
      : id === 'featured-collection-editorial'
        ? 'featured-collection-editorial'
        : id === 'featured-collection-grid'
          ? 'featured-collection-grid'
          : id === 'featured-product'
            ? 'featured-product'
            : id === 'product-highlight'
              ? 'product-highlight'
              : id === 'product-hotspots'
                ? 'product-hotspots'
                : id === 'recommended-products'
                  ? 'recommended-products'
                  : 'product-card';
  return {
    id,
    label,
    icon,
    keywords: ['product', 'products', ...keywords],
    previewVariant,
    previewCaption: label,
  };
}

function blogPostItem(id: string, label: string, keywords: string[] = []): SectionCatalogItem {
  const previewVariant: SectionCatalogItem['previewVariant'] =
    id === 'blog-posts-carousel'
      ? 'blog-posts-carousel'
      : id === 'blog-posts-editorial'
        ? 'blog-posts-editorial'
        : id === 'blog-posts-grid'
          ? 'blog-posts-grid'
          : 'text-block';
  return {
    id,
    label,
    icon: 'blog',
    keywords: ['blog', 'posts', 'storytelling', ...keywords],
    previewVariant,
    previewCaption: label,
  };
}

function storytellingBlockItem(
  id: string,
  label: string,
  keywords: string[] = [],
  previewVariant: SectionCatalogItem['previewVariant'] = 'text-block'
): SectionCatalogItem {
  return {
    id,
    label,
    icon: 'blocks',
    keywords: ['storytelling', ...keywords],
    previewVariant,
    previewCaption: label,
  };
}

function storytellingTextItem(id: string, label: string, keywords: string[] = []): SectionCatalogItem {
  const previewVariant: SectionCatalogItem['previewVariant'] =
    id === 'editorial'
      ? 'storytelling-editorial'
      : id === 'editorial-jumbo'
        ? 'storytelling-editorial-jumbo'
        : 'text-block';
  return {
    id,
    label,
    icon: 'text',
    keywords: ['storytelling', 'editorial', ...keywords],
    previewVariant,
    previewCaption: label,
  };
}

function textSectionItem(id: string, label: string, keywords: string[] = []): SectionCatalogItem {
  const previewVariant: SectionCatalogItem['previewVariant'] =
    id === 'faq'
      ? 'faq'
      : id === 'icons-with-text'
        ? 'icons-with-text'
        : id === 'text-marquee'
          ? 'text-marquee'
          : id === 'multicolumn'
            ? 'multicolumn'
            : id === 'pull-quote'
              ? 'pull-quote'
              : id === 'rich-text'
                ? 'rich-text'
                : 'text-block';
  return {
    id,
    label,
    icon: 'text',
    keywords: ['text', ...keywords],
    previewVariant,
    previewCaption: label,
  };
}

const TEXT_ITEMS: SectionCatalogItem[] = [
  textSectionItem('faq', 'FAQ', ['questions', 'accordion']),
  textSectionItem('icons-with-text', 'Icons with text', ['features', 'icons']),
  textSectionItem('text-marquee', 'Marquee', ['ticker', 'scroll', 'announcement']),
  textSectionItem('multicolumn', 'Multicolumn', ['columns', 'grid']),
  textSectionItem('pull-quote', 'Pull quote', ['quote', 'testimonial']),
  textSectionItem('rich-text', 'Rich text', ['content', 'paragraph']),
];

const STORYTELLING_ITEMS: SectionCatalogItem[] = [
  blogPostItem('blog-posts-carousel', 'Blog posts: Carousel', ['carousel', 'slider']),
  blogPostItem('blog-posts-editorial', 'Blog posts: Editorial', ['editorial', 'article']),
  blogPostItem('blog-posts-grid', 'Blog posts: Grid', ['grid', 'list']),
  storytellingBlockItem('storytelling-carousel', 'Carousel', ['carousel', 'slides'], 'storytelling-carousel'),
  storytellingTextItem('editorial', 'Editorial', ['story', 'article']),
  storytellingTextItem('editorial-jumbo', 'Editorial: Jumbo text', ['large', 'display', 'headline']),
  storytellingBlockItem('image-compare', 'Image compare', ['before', 'after', 'slider'], 'image-compare'),
  storytellingBlockItem('image-with-text', 'Image with text', ['media', 'copy'], 'image-with-text'),
  storytellingBlockItem('logo', 'Logo', ['brand'], 'storytelling-logo'),
  storytellingBlockItem('video', 'Video', ['media', 'youtube', 'vimeo'], 'storytelling-video'),
];

const TEMPLATE_PRODUCTS_ITEMS: SectionCatalogItem[] = [
  productItem('featured-collection-carousel', 'Featured collection: Carousel', ['collection', 'carousel', 'slider']),
  productItem('featured-collection-editorial', 'Featured collection: Editorial', ['collection', 'editorial', 'story']),
  productItem('featured-collection-grid', 'Featured collection: Grid', ['collection', 'grid']),
  productItem('featured-product', 'Featured product', ['single', 'spotlight']),
  productItem('product-highlight', 'Product highlight', ['highlight', 'spotlight']),
  productItem('product-hotspots', 'Product hotspots', ['hotspots', 'interactive', 'image']),
  productItem('recommended-products', 'Recommended products', ['recommendations', 'related', 'upsell']),
];

function collectionListItem(
  id: string,
  label: string,
  keywords: string[] = []
): SectionCatalogItem {
  const previewVariant: SectionCatalogItem['previewVariant'] =
    id === 'collection-list-bento'
      ? 'collection-list-bento'
      : id === 'collection-list-carousel'
        ? 'collection-list-carousel'
        : id === 'collection-list-editorial'
          ? 'collection-list-editorial'
          : id === 'collection-list-grid'
            ? 'collection-list-grid'
            : 'product-card';
  return {
    id,
    label,
    icon: 'hero',
    keywords: ['collection', 'list', ...keywords],
    previewVariant,
    previewCaption: label,
  };
}

function bannerPreviewVariant(id: string, icon: 'hero' | 'slideshow'): SectionCatalogItem['previewVariant'] {
  if (id === 'layered-slideshow') return 'layered-slideshow';
  if (id === 'slideshow-full-frame') return 'slideshow-full-frame';
  if (id === 'slideshow-inset') return 'slideshow-inset';
  if (id === 'split-showcase') return 'split-showcase';
  if (icon === 'slideshow') return 'before-after';
  if (id === 'hero-bottom-aligned') return 'hero-bottom-aligned';
  if (id === 'hero-marquee') return 'hero-marquee';
  if (id === 'large-logo') return 'large-logo';
  return 'hero';
}

function bannerItem(
  id: string,
  label: string,
  icon: 'hero' | 'slideshow' = 'hero',
  keywords: string[] = []
): SectionCatalogItem {
  return {
    id,
    label,
    icon,
    keywords: ['banner', 'hero', ...keywords],
    previewVariant: bannerPreviewVariant(id, icon),
    previewCaption: label,
  };
}

/** Shopify category order for template Add section. */
export const TEMPLATE_SECTION_CATALOG: SectionCatalogEntry[] = [
  {
    type: 'category',
    id: 'banners',
    label: 'Banners',
    items: [
      bannerItem('hero', 'Hero'),
      bannerItem('hero-bottom-aligned', 'Hero: Bottom aligned', 'hero', ['bottom', 'aligned']),
      bannerItem('hero-marquee', 'Hero: Marquee', 'hero', ['marquee', 'scroll']),
      bannerItem('large-logo', 'Large logo', 'hero', ['logo', 'brand']),
      bannerItem('layered-slideshow', 'Layered slideshow', 'slideshow', ['carousel', 'layers']),
      bannerItem('slideshow-full-frame', 'Slideshow: Full frame', 'slideshow', ['carousel', 'full']),
      bannerItem('slideshow-inset', 'Slideshow: Inset', 'slideshow', ['carousel', 'inset']),
      bannerItem('split-showcase', 'Split showcase', 'hero', ['split', 'showcase']),
    ],
  },
  {
    type: 'category',
    id: 'collections',
    label: 'Collections',
    items: [
      collectionLinkItem('collection-links-spotlight', 'Collection links: Spotlight', ['spotlight']),
      collectionLinkItem('collection-links-text', 'Collection links: Text', ['text']),
      collectionListItem('collection-list-bento', 'Collection list: Bento', ['bento', 'grid']),
      collectionListItem('collection-list-carousel', 'Collection list: Carousel', ['carousel', 'slider']),
      collectionListItem('collection-list-editorial', 'Collection list: Editorial', ['editorial', 'story']),
      collectionListItem('collection-list-grid', 'Collection list: Grid', ['grid', 'categories']),
    ],
  },
  {
    type: 'category',
    id: 'forms',
    label: 'Forms',
    items: [
      formItem('contact-form', 'Contact form', 'contact-form', ['email', 'message', 'inquiry'], 'Let customers send you a message'),
      formItem('email-signup', 'Email signup', 'newsletter', ['newsletter', 'subscribe', 'mailing'], 'Collect emails with a signup form'),
    ],
  },
  {
    type: 'category',
    id: 'layout',
    label: 'Layout',
    items: [...LAYOUT_CATEGORY_ITEMS],
  },
  {
    type: 'category',
    id: 'products',
    label: 'Products',
    items: [...TEMPLATE_PRODUCTS_ITEMS],
  },
  {
    type: 'category',
    id: 'storytelling',
    label: 'Storytelling',
    items: [...STORYTELLING_ITEMS],
  },
  {
    type: 'category',
    id: 'text',
    label: 'Text',
    items: [...TEXT_ITEMS],
  },
];

export function resolveTemplateCatalogItem(catalogId: string): {
  blueprintId: string;
  type: string;
} | null {
  return TEMPLATE_SECTION_RESOLVE[catalogId] ?? null;
}

const FOOTER_BANNER_ITEMS: SectionCatalogItem[] = [
  bannerItem('hero', 'Hero'),
  bannerItem('hero-bottom-aligned', 'Hero: Bottom aligned', 'hero', ['bottom', 'aligned']),
  bannerItem('hero-marquee', 'Hero: Marquee', 'hero', ['marquee', 'scroll']),
  bannerItem('large-logo', 'Large logo', 'hero', ['logo', 'brand']),
  bannerItem('split-showcase', 'Split showcase', 'hero', ['split', 'showcase']),
];

const FOOTER_TEXT_ITEMS: SectionCatalogItem[] = [
  textSectionItem('faq', 'FAQ', ['questions', 'accordion']),
  textSectionItem('icons-with-text', 'Icons with text', ['features', 'icons']),
  textSectionItem('multicolumn', 'Multicolumn', ['columns', 'grid']),
  textSectionItem('pull-quote', 'Pull quote', ['quote', 'testimonial']),
  textSectionItem('rich-text', 'Rich text', ['content', 'paragraph']),
];

const FOOTER_STORYTELLING_ITEMS: SectionCatalogItem[] = [
  storytellingTextItem('editorial', 'Editorial', ['story', 'article']),
  storytellingTextItem('editorial-jumbo', 'Editorial: Jumbo text', ['large', 'display', 'headline']),
  storytellingBlockItem('image-compare', 'Image compare', ['before', 'after', 'slider'], 'image-compare'),
  storytellingBlockItem('image-with-text', 'Image with text', ['media', 'copy'], 'image-with-text'),
  storytellingBlockItem('logo', 'Logo', ['brand'], 'storytelling-logo'),
  storytellingBlockItem('video', 'Video', ['media', 'youtube', 'vimeo'], 'storytelling-video'),
];

const FOOTER_GROUP_ITEMS: SectionCatalogItem[] = [
  layoutBlockItem(
    'footer',
    'Footer',
    ['links', 'menu', 'copyright', 'newsletter', 'email'],
    'footer-section',
    'Email signup, links, and copyright'
  ),
  layoutBlockItem(
    'policies-links',
    'Policies and links',
    ['privacy', 'terms', 'legal'],
    'policies-links',
    'Policy links and utility navigation'
  ),
];

/** Shopify category order for footer Add section. */
export const FOOTER_SECTION_CATALOG: SectionCatalogEntry[] = [
  {
    type: 'category',
    id: 'banners',
    label: 'Banners',
    items: [...FOOTER_BANNER_ITEMS],
  },
  {
    type: 'category',
    id: 'footer',
    label: 'Footer',
    items: [...FOOTER_GROUP_ITEMS],
  },
  {
    type: 'category',
    id: 'forms',
    label: 'Forms',
    items: [
      formItem('contact-form', 'Contact form', 'contact-form', ['email', 'message', 'inquiry'], 'Let customers send you a message'),
      formItem('email-signup', 'Email signup', 'newsletter', ['newsletter', 'subscribe', 'mailing'], 'Collect emails with a signup form'),
    ],
  },
  {
    type: 'category',
    id: 'layout',
    label: 'Layout',
    items: [...LAYOUT_CATEGORY_ITEMS],
  },
  {
    type: 'category',
    id: 'products',
    label: 'Products',
    items: [
      productItem('product-highlight', 'Product highlight', ['featured', 'spotlight'], 'highlight'),
    ],
  },
  {
    type: 'category',
    id: 'storytelling',
    label: 'Storytelling',
    items: [...FOOTER_STORYTELLING_ITEMS],
  },
  {
    type: 'category',
    id: 'text',
    label: 'Text',
    items: [...FOOTER_TEXT_ITEMS],
  },
];

export function defaultExpandedCategoriesForGroup(groupId: SectionCatalogGroup): Record<string, boolean> {
  if (groupId === 'footer') {
    return {
      banners: false,
      footer: false,
      forms: false,
      layout: false,
      products: false,
      storytelling: false,
      text: false,
    };
  }
  if (groupId === 'template') {
    return {
      banners: true,
      collections: false,
      forms: false,
      layout: false,
      products: false,
      storytelling: false,
      text: false,
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
