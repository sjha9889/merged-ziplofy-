import React from 'react';
import AbandonedCartItemRow, { CartItem } from './AbandonedCartItemRow';

interface AbandonedCartItemsTableProps {
  cartItems: CartItem[];
  cartTotal: number;
  formatDate: (dateString: string) => string;
}

const AbandonedCartItemsTable: React.FC<AbandonedCartItemsTableProps> = ({
  cartItems,
  cartTotal,
  formatDate,
}) => {
  return (
    <div className="bg-white border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-900">Items ({cartItems.length})</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                Product
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                SKU
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                Price
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">
                Qty
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cartItems.map((item) => (
              <AbandonedCartItemRow key={item._id} item={item} formatDate={formatDate} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-900">Total</span>
          <span className="text-base font-semibold text-gray-900">${cartTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default AbandonedCartItemsTable;

