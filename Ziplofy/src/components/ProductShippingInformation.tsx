import { TruckIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Product } from '../contexts/product.context';

interface ProductShippingInformationProps {
  product: Product;
}

const ProductShippingInformation: React.FC<ProductShippingInformationProps> = ({ product }) => {
  if (!product.isPhysicalProduct) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gradient-to-r from-gray-50/90 to-white px-5 py-3.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
          <TruckIcon className="h-4 w-4 text-blue-600" aria-hidden />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Shipping</h2>
          <p className="text-xs text-gray-500">Physical product fulfillment</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-100 bg-gray-50/40 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Package</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">{product.package?.packageName || '—'}</p>
          {product.package ? (
            <p className="mt-1 text-xs text-gray-500">
              {product.package.length} × {product.package.width} × {product.package.height}{' '}
              {product.package.dimensionsUnit}
            </p>
          ) : null}
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50/40 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Weight</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {product.productWeight ?? '—'} {product.productWeightUnit ?? ''}
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50/40 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Origin</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">{product.countryOfOrigin || '—'}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50/40 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">HS code</p>
          <p className="mt-1 font-mono text-sm font-semibold text-gray-900">
            {product.harmonizedSystemCode || '—'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductShippingInformation;
