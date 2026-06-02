/** Catalog preset for Featured product (product-highlight variant). */

export function applyFeaturedProductPreset(section: Record<string, unknown>): void {
  if (section.type !== 'product-highlight') return;

  const settings = (section.settings ?? {}) as Record<string, unknown>;
  settings.catalogVariant = 'featured-product';
  settings.productId = settings.productId ?? '';
  settings.productTitle = settings.productTitle ?? 'Product title';
  settings.price = settings.price ?? 'Rs. 19.99';
  settings.productImageUrl = settings.productImageUrl ?? '';
  settings.mediaPosition = settings.mediaPosition ?? 'left';
  settings.sectionWidth = settings.sectionWidth ?? 'page';
  settings.equalColumns = settings.equalColumns ?? true;
  settings.limitProductDetailsWidth = settings.limitProductDetailsWidth ?? false;
  settings.layoutGap = settings.layoutGap ?? 48;
  settings.colorScheme = settings.colorScheme ?? 'scheme-1';
  settings.showRating = settings.showRating ?? true;
  settings.rating = settings.rating ?? 4.5;
  settings.reviewCount = settings.reviewCount ?? 3;
  settings.showTaxNote = settings.showTaxNote ?? true;
  settings.taxNote = settings.taxNote ?? 'Taxes included.';
  settings.buttonLabel = settings.buttonLabel ?? 'Sold out';
  settings.soldOut = settings.soldOut ?? true;
  settings.paddingTop = settings.paddingTop ?? 40;
  settings.paddingBottom = settings.paddingBottom ?? 40;
  settings.customCss = settings.customCss ?? '';
  section.settings = settings;
  section.blocks = {};
  section.block_order = [];
}
