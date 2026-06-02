/** Shopify "Hero: Bottom aligned" block tree + config paths. */

export const HERO_BOTTOM_ALIGNED_BODY =
  'We make things that work better and last longer. Our products solve real problems with clean design and honest materials.';

/** Default full-bleed hero image (mountain landscape, Shopify-style). */
export const HERO_BOTTOM_ALIGNED_DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=85';

export type HeroBottomAlignedPaths = {
  textIntro: string;
  headingMain: string;
  textBody: string;
};

export function heroBottomAlignedPaths(blocksBase: string): HeroBottomAlignedPaths {
  return {
    textIntro: `${blocksBase}.content_group.blocks.heading_group.blocks.text_intro.settings.text`,
    headingMain: `${blocksBase}.content_group.blocks.heading_group.blocks.heading_main.settings.text`,
    textBody: `${blocksBase}.content_group.blocks.text_body.settings.text`,
  };
}

export function isHeroBottomAlignedVariant(
  config: Record<string, unknown> | null,
  settingsBase: string
): boolean {
  if (!config) return false;
  const parts = `${settingsBase}.catalogVariant`.split('.');
  let cur: unknown = config;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return false;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur === 'hero-bottom-aligned';
}

export function buildBottomAlignedHeroBlocks(
  blocksPathPrefix: string
): Record<string, Record<string, unknown>> {
  const p = heroBottomAlignedPaths(blocksPathPrefix);
  return {
    content_group: {
      type: 'group',
      settings: {},
      blocks: {
        heading_group: {
          type: 'group',
          settings: {},
          blocks: {
            text_intro: {
              type: 'text',
              settings: { text: 'Introducing' },
              settings_field_order: [p.textIntro],
            },
            heading_main: {
              type: 'heading',
              settings: { text: 'New arrivals' },
              settings_field_order: [p.headingMain],
            },
          },
          block_order: ['text_intro', 'heading_main'],
          nested_block_order: ['text_intro', 'heading_main'],
        },
        text_body: {
          type: 'text',
          settings: { text: HERO_BOTTOM_ALIGNED_BODY },
          settings_field_order: [p.textBody],
        },
      },
      block_order: ['heading_group', 'text_body'],
      nested_block_order: ['heading_group', 'text_body'],
    },
  };
}

/** Sidebar drag-order keys for the nested Group → Group → Text / Heading tree. */
export function bottomAlignedHeroStructureOrder(
  prefix: string,
  sectionChildrenListKey: string,
  listKeyBlockChildren: (blockPrefix: string) => string
): Record<string, string[]> {
  const contentPrefix = `${prefix}:block:content_group`;
  const headingGroupPrefix = `${contentPrefix}:nested:heading_group`;
  return {
    [sectionChildrenListKey]: [`${prefix}:add-block`, contentPrefix],
    [listKeyBlockChildren(contentPrefix)]: [
      `${contentPrefix}:inner-add-block`,
      headingGroupPrefix,
      `${contentPrefix}:nested:text_body`,
      `${contentPrefix}:inner-add-block`,
    ],
    [listKeyBlockChildren(headingGroupPrefix)]: [
      `${headingGroupPrefix}:inner-add-block`,
      `${headingGroupPrefix}:nested:text_intro`,
      `${headingGroupPrefix}:nested:heading_main`,
      `${headingGroupPrefix}:inner-add-block`,
    ],
  };
}

export function applyBottomAlignedHeroSection(section: Record<string, unknown>, blocksBase: string): void {
  const settings = (section.settings ?? {}) as Record<string, unknown>;
  settings.catalogVariant = 'hero-bottom-aligned';
  settings.eyebrow = 'Introducing';
  settings.title = 'New arrivals';
  settings.subtitle = HERO_BOTTOM_ALIGNED_BODY;
  settings.media1Type = 'image';
  settings.media1ImageUrl =
    typeof settings.media1ImageUrl === 'string' && settings.media1ImageUrl.trim()
      ? settings.media1ImageUrl
      : HERO_BOTTOM_ALIGNED_DEFAULT_IMAGE;
  settings.media2Type = 'image';
  settings.media2ImageUrl = settings.media2ImageUrl ?? '';
  settings.direction = 'vertical';
  settings.position = 'bottom';
  settings.layoutAlignment = 'center';
  settings.layoutGap = 16;
  settings.sectionWidth = 'page';
  settings.height = 'large';
  settings.paddingTop = 40;
  settings.paddingBottom = 40;
  settings.mediaOverlay = true;
  settings.overlayStyle = 'gradient';
  settings.overlayGradientDirection = 'up';
  settings.overlayColor = settings.overlayColor ?? '#00000026';
  settings.colorScheme = settings.colorScheme ?? 'scheme-5';
  section.settings = settings;
  section.blocks = buildBottomAlignedHeroBlocks(blocksBase);
  section.block_order = ['content_group'];
}
