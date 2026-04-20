import { useMemo, useState } from 'react'
import type { ProductItem } from '../types/product'
import { getGalleryImages } from '../data/catalogIndex'

type CatalogShape = {
  rolex: ProductItem[]
  omega: ProductItem[]
  hublot: ProductItem[]
}

type ProductGalleryProps = {
  product: ProductItem
  catalog: CatalogShape
}

const borderPdp = 'border-[#E0E0E0]'

/** Main + thumbs: shared ~14px radius, light grey frame, aligned with reference */
export function ProductGallery({ product, catalog }: ProductGalleryProps) {
  const [mainIdx, setMainIdx] = useState(0)
  const gallery = useMemo(() => getGalleryImages(catalog, product), [catalog, product])
  const mainImage = gallery[mainIdx] ?? product.image

  return (
    <div className="w-full">
      <div
        className={`overflow-hidden rounded-[14px] border ${borderPdp} bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]`}
      >
        <div className="aspect-[5/6] max-h-[min(560px,72vh)] w-full sm:aspect-[4/5]">
          <img
            src={mainImage}
            alt=""
            className="h-full w-full object-contain object-center p-5 sm:p-8"
          />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2.5 sm:gap-3">
        {gallery.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setMainIdx(i)}
            className={`overflow-hidden rounded-[12px] border bg-white p-1 transition ${
              mainIdx === i
                ? 'border-2 border-black ring-1 ring-black/5'
                : `border ${borderPdp} hover:border-neutral-400`
            }`}
          >
            <img src={src} alt="" className="aspect-square w-full object-contain p-0.5" />
          </button>
        ))}
      </div>
    </div>
  )
}
