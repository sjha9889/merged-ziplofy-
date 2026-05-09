import { Link } from 'react-router-dom';
import { formatINR } from '../utils/currency';
import type { StorefrontProductItem } from '../contexts/product.context';

type Props = {
  product: StorefrontProductItem;
};

export function StorefrontListingCard({ product }: Props) {
  const image = product.imageUrls?.[0] || '';
  const hoverImage = product.imageUrls?.[1] || image;
  const label = product.createdAt
    ? (new Date().getTime() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24) < 45
      ? 'NEW'
      : 'COLLECTION'
    : 'COLLECTION';

  return (
    <article className="group relative overflow-hidden rounded-[12px] border border-[#e5e5e5] bg-white">
      <button
        type="button"
        className="absolute right-3 top-3 z-10 h-8 w-8 rounded-full border border-[#d8d8d8] bg-white/95 text-[15px] leading-none text-[#444]"
        aria-label="Add to wishlist"
      >
        +
      </button>

      <Link to={`/products/${product._id}`} className="block">
        <div className="relative h-[290px] overflow-hidden bg-[#f7f7f7]">
          {image ? (
            <>
              <img
                src={image}
                alt={product.title}
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
              />
              <img
                src={hoverImage}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-[#999]">No image</div>
          )}
        </div>

        <div className="border-t border-[#efefef] px-5 pb-5 pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6a6a6a]">{label}</p>
          <h3 className="mt-2 text-[15px] font-semibold uppercase leading-[1.25] tracking-[0.02em] text-[#111]">
            {product.title}
          </h3>
          <p className="mt-1 text-[12px] text-[#585858]">
            {product.vendor?.name || 'Vendor'} — {product.category?.name || 'Product'}
          </p>
          <p className="mt-3 text-[20px] font-semibold text-[#111]">{formatINR(product.price)}</p>
        </div>
      </Link>
    </article>
  );
}
