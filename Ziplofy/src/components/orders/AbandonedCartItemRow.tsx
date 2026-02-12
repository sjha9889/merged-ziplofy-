import { CubeIcon } from '@heroicons/react/24/outline';
import React from 'react';

export interface CartItem {
  _id: string;
  quantity: number;
  addedAt: string;
  productVariant: {
    sku: string;
    price: number;
    compareAtPrice?: number;
    images?: string[];
    optionValues: Record<string, string>;
    productId: string;
  };
}

interface AbandonedCartItemRowProps {
  item: CartItem;
}

const AbandonedCartItemRow: React.FC<AbandonedCartItemRowProps> = ({ item }) => {
  const productLabel = Object.entries(item.productVariant.optionValues || {})
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ') || item.productVariant.sku;

  return (
    <tr className="hover:bg-blue-50/40 transition-colors">
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-3">
          {item.productVariant.images && item.productVariant.images.length > 0 ? (
            <img
              src={item.productVariant.images[0]}
              alt={item.productVariant.sku}
              className="w-10 h-10 object-cover rounded-lg border border-gray-200 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <CubeIcon className="w-5 h-5 text-blue-400" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm text-gray-900 truncate">
              {productLabel}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <p className="text-sm text-gray-600">{item.productVariant.sku}</p>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-right">
        <p className="text-sm text-gray-900">₹{item.productVariant.price.toFixed(2)}</p>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-center">
        <span className="text-sm text-gray-900">{item.quantity}</span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-right">
        <p className="text-sm text-blue-600 font-medium">
          ₹{(item.productVariant.price * item.quantity).toFixed(2)}
        </p>
      </td>
    </tr>
  );
};

export default AbandonedCartItemRow;

