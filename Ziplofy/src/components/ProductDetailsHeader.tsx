import {
  ArrowLeftIcon,
  ChevronRightIcon,
  CubeIcon,
  HomeIcon,
  PlusIcon,
  Squares2X2Icon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../contexts/product.context';

interface ProductDetailsHeaderProps {
  product: Product;
  variantsCount: number;
  onAddVariants: () => void;
  onDeleteVariant: () => void;
  onAddOption: () => void;
}

const ProductDetailsHeader: React.FC<ProductDetailsHeaderProps> = ({
  product,
  variantsCount,
  onAddVariants,
  onDeleteVariant,
  onAddOption,
}) => {
  const navigate = useNavigate();
  const title = product.title || 'Untitled product';

  return (
    <header className="mb-8 space-y-5">
      <button
        type="button"
        onClick={() => navigate('/products')}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
      >
        <ArrowLeftIcon className="h-4 w-4" aria-hidden />
        Products
      </button>

      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm">
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <HomeIcon className="h-3.5 w-3.5" aria-hidden />
          Catalog
        </button>
        <ChevronRightIcon className="h-3.5 w-3.5 shrink-0 text-gray-300" aria-hidden />
        <span className="rounded-lg bg-gray-100/80 px-2 py-1 font-semibold text-gray-900" aria-current="page">
          {title}
        </span>
      </nav>

      <div className="rounded-2xl border border-gray-200/80 bg-gradient-to-b from-white to-blue-50/25 p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 border-l-4 border-blue-500/70 pl-4">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">{title}</h1>
            {product.description ? (
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600 line-clamp-3">
                {product.description}
              </p>
            ) : (
              <p className="mt-2 text-sm text-gray-400">No description</p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  product.status === 'active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {product.status === 'active' ? 'Active' : product.status || 'Draft'}
              </span>
              {product.onlineStorePublishing ? (
                <span className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-xs font-medium text-gray-700">
                  Online store
                </span>
              ) : null}
              {product.pointOfSalePublishing ? (
                <span className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-xs font-medium text-gray-700">
                  Point of sale
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                <Squares2X2Icon className="h-3.5 w-3.5" aria-hidden />
                {variantsCount} {variantsCount === 1 ? 'variant' : 'variants'}
              </span>
              {product.sku ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 font-mono text-xs font-medium text-gray-700">
                  <CubeIcon className="h-3.5 w-3.5" aria-hidden />
                  {product.sku}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:flex-col xl:flex-row lg:items-stretch">
            <button
              type="button"
              onClick={onAddVariants}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4" aria-hidden />
              Add variants
            </button>
            <button
              type="button"
              onClick={onDeleteVariant}
              disabled={!product?.variants || product.variants.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <TrashIcon className="h-4 w-4 text-gray-500" aria-hidden />
              Delete variant
            </button>
            <button
              type="button"
              onClick={onAddOption}
              disabled={!product?.variants || product.variants.length === 0 || variantsCount <= 1}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add option
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProductDetailsHeader;
