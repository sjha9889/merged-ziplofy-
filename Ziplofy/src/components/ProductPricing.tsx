import React from 'react';
import { Product } from '../contexts/product.context';

interface ProductPricingProps {
  product: Product;
}

const formatInr = (n: number) =>
  `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const ProductPricing: React.FC<ProductPricingProps> = ({ product }) => {
  const price = product.price != null ? Number(product.price) : 0;
  const cost = product.cost != null ? Number(product.cost) : 0;
  const profit = product.profit != null ? Number(product.profit) : 0;
  const margin = product.marginPercent != null ? Number(product.marginPercent) : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50/90 to-white px-5 py-3.5">
        <h2 className="text-sm font-semibold text-gray-900">Pricing</h2>
        <p className="mt-0.5 text-xs text-gray-500">Price, cost, and margin</p>
      </div>
      <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/60 to-white px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Price</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-blue-800">{formatInr(price)}</p>
        </div>
        {typeof product.compareAtPrice === 'number' ? (
          <div className="rounded-xl border border-gray-100 bg-gray-50/40 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Compare at</p>
            <p className="mt-1 text-sm font-semibold tabular-nums text-gray-900">
              {formatInr(product.compareAtPrice)}
            </p>
          </div>
        ) : null}
        <div className="rounded-xl border border-gray-100 bg-gray-50/40 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Cost</p>
          <p className="mt-1 text-sm font-semibold tabular-nums text-gray-900">{formatInr(cost)}</p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 px-4 py-3 sm:col-span-2 lg:col-span-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Profit</p>
          <p className="mt-1 text-sm font-semibold tabular-nums text-emerald-900">
            {formatInr(profit)}{' '}
            <span className="text-xs font-normal text-gray-600">({margin.toFixed(1)}% margin)</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductPricing;
