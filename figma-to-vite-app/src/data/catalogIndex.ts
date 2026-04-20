import type { ProductItem } from '../types/product'

export function flattenCatalog(catalog: {
  rolex: ProductItem[]
  omega: ProductItem[]
  hublot: ProductItem[]
}): ProductItem[] {
  return [...catalog.rolex, ...catalog.omega, ...catalog.hublot]
}

export function getProductById(
  catalog: { rolex: ProductItem[]; omega: ProductItem[]; hublot: ProductItem[] },
  id: string,
): ProductItem | undefined {
  return flattenCatalog(catalog).find((p) => p.id === id)
}

/** Related products: same brand first, then others; excludes current */
export function getRelatedProducts(
  catalog: { rolex: ProductItem[]; omega: ProductItem[]; hublot: ProductItem[] },
  current: ProductItem,
  count = 4,
): ProductItem[] {
  const all = flattenCatalog(catalog).filter((p) => p.id !== current.id)
  const sameBrand = all.filter((p) => p.brand === current.brand)
  const rest = all.filter((p) => p.brand !== current.brand)
  const merged = [...sameBrand, ...rest]
  return merged.slice(0, count)
}

/** Gallery: main image + 3 distinct alternates when possible */
export function getGalleryImages(
  catalog: { rolex: ProductItem[]; omega: ProductItem[]; hublot: ProductItem[] },
  current: ProductItem,
): string[] {
  const others = flattenCatalog(catalog)
    .filter((p) => p.id !== current.id)
    .map((p) => p.image)
  const thumbs = [current.image, ...others.slice(0, 3)]
  while (thumbs.length < 4) thumbs.push(current.image)
  return thumbs.slice(0, 4)
}
