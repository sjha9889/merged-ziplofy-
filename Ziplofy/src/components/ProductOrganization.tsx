import { TagIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Product } from '../contexts/product.context';

interface ProductOrganizationProps {
  product: Product;
}

const ProductOrganization: React.FC<ProductOrganizationProps> = ({ product }) => {
  const typeName =
    (product.productType && typeof product.productType === 'object' && product.productType.name) || '—';
  const vendorName = (product.vendor && typeof product.vendor === 'object' && product.vendor.name) || '—';
  const tags = Array.isArray(product.tagIds) ? product.tagIds : [];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50/90 to-white px-5 py-3.5">
        <h2 className="text-sm font-semibold text-gray-900">Organization</h2>
        <p className="mt-0.5 text-xs text-gray-500">Type, vendor, and tags</p>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-gray-50/40 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Product type</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{typeName}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50/40 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Vendor</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{vendorName}</p>
          </div>
        </div>

        {tags.length > 0 ? (
          <div className="mt-5 border-t border-gray-100 pt-5">
            <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
              <TagIcon className="h-3.5 w-3.5" aria-hidden />
              Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag._id}
                  className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm"
                >
                  {tag?.name || '—'}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductOrganization;
