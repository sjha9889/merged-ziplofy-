import React from 'react';
import { Product } from '../contexts/product.context';

interface ProductBasicInformationProps {
  product: Product;
}

const ProductBasicInformation: React.FC<ProductBasicInformationProps> = ({ product }) => {
  const categoryName =
    (product.category && typeof product.category === 'object' && product.category.name) || '—';

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50/90 to-white px-5 py-3.5">
        <h2 className="text-sm font-semibold text-gray-900">Basic information</h2>
        <p className="mt-0.5 text-xs text-gray-500">Category, SKU, and identifiers</p>
      </div>
      <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-gray-50/40 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Category</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">{categoryName}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50/40 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">SKU</p>
          <p className="mt-1 font-mono text-sm font-semibold text-gray-900">{product.sku || '—'}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50/40 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Barcode</p>
          <p className="mt-1 font-mono text-sm font-semibold text-gray-900">{product.barcode || '—'}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductBasicInformation;
