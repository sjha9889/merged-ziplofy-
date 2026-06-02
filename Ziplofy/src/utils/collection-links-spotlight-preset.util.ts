/** Defaults for Collection links: Spotlight sections. */

function makeLink(index: number) {
  return {
    type: 'collection-link',
    settings: {
      title: 'Collection title',
      productCount: 5,
      collectionHandle: '',
      href: '/collections/all',
    },
  };
}

export function applyCollectionLinksSpotlightPreset(section: Record<string, unknown>): void {
  if (section.type !== 'collection-links-spotlight') return;

  const settings = (section.settings ?? {}) as Record<string, unknown>;
  const catalogVariant = String(settings.catalogVariant ?? 'collection-links-spotlight');
  settings.catalogVariant = catalogVariant;
  settings.collectionsPicker = settings.collectionsPicker ?? '';
  const isText = catalogVariant === 'collection-links-text';
  settings.layoutMode = isText ? 'text' : (settings.layoutMode ?? 'spotlight');
  settings.sectionWidth = settings.sectionWidth ?? 'page';
  settings.alignment = isText ? (settings.alignment ?? 'center') : (settings.alignment ?? 'left');
  settings.imagePosition = settings.imagePosition ?? 'right';
  settings.imageUrl = settings.imageUrl ?? '';
  settings.colorScheme = settings.colorScheme ?? 'scheme-1';
  settings.paddingTop = settings.paddingTop ?? 40;
  settings.paddingBottom = settings.paddingBottom ?? 40;
  settings.customCss = settings.customCss ?? '';
  section.settings = settings;

  const blocks = (section.blocks ?? {}) as Record<string, Record<string, unknown>>;
  const order = Array.isArray(section.block_order) ? [...(section.block_order as string[])] : [];

  if (!order.length) {
    const nextBlocks: Record<string, Record<string, unknown>> = {};
    const nextOrder: string[] = [];
    for (let i = 0; i < 4; i++) {
      const id = `link_${i + 1}`;
      nextBlocks[id] = makeLink(i);
      nextOrder.push(id);
    }
    section.blocks = nextBlocks;
    section.block_order = nextOrder;
    return;
  }

  section.blocks = blocks;
  section.block_order = order;
}
