import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuyXGetYDiscount } from '../contexts/buy-x-get-y-discount.context';

interface BuyXGetYTableProps {
  discounts: BuyXGetYDiscount[];
}

const BuyXGetYTable: React.FC<BuyXGetYTableProps> = ({
  discounts,
}) => {
  const navigate = useNavigate();

  const handleRowClick = useCallback((discountId: string) => {
    navigate(`/discounts/pyxgety/${discountId}`);
  }, [navigate]);

  if (discounts.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Code / Title</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Method</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Customer Buys</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Any Items From</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Gets Qty</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Gets From</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Value</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Eligibility</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Created</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {discounts.map((d) => {
              const codeOrTitle = d.method === 'discount-code' ? d.discountCode : d.title;
              const value = d.discountedValue === 'percentage' ? `${d.discountedPercentage ?? 0}%` : d.discountedValue === 'amount' ? `₹${d.discountedAmount ?? 0 }` : 'Free';
              return (
                <tr
                  key={d._id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(d._id)}
                >
                  <td className="px-3 py-2 text-sm text-gray-900">{codeOrTitle || '-'}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{d.method}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{d.customerBuys}{d.customerBuys === 'minimum-quantity' && d.quantity ? ` (${d.quantity})` : d.customerBuys === 'minimum-amount' && d.amount ? ` (₹${d.amount})` : ''}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{d.anyItemsFrom}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{d.customerGetsQuantity}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{d.customerGetsAnyItemsFrom}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{value}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{d.eligibility}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{d.status || 'active'}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BuyXGetYTable;

