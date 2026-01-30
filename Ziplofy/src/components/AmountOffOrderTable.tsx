import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AmountOffOrderDiscount } from '../contexts/amount-off-order-discount.context';

interface AmountOffOrderTableProps {
  discounts: AmountOffOrderDiscount[];
}

const AmountOffOrderTable: React.FC<AmountOffOrderTableProps> = ({
  discounts,
}) => {
  const navigate = useNavigate();

  const handleRowClick = useCallback((discountId: string) => {
    navigate(`/discounts/amount-off-order/${discountId}`);
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
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Value</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Eligibility</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Min Requirement</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Combinations</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Created</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {discounts.map((d) => {
              const codeOrTitle = d.method === 'discount-code' ? d.discountCode : d.title;
              const value = d.valueType === 'percentage' ? `${d.percentage ?? 0}%` : `₹${d.fixedAmount ?? 0}`;
              const minReq = d.minimumPurchase === 'minimum-amount'
                ? `Min Amount ₹${d.minimumAmount ?? 0}`
                : d.minimumPurchase === 'minimum-quantity'
                  ? `Min Qty ${d.minimumQuantity ?? 0}`
                  : 'None';
              const combos = `P:${d.productDiscounts ? 'Y' : 'N'} / O:${d.orderDiscounts ? 'Y' : 'N'} / S:${d.shippingDiscounts ? 'Y' : 'N'}`;
              return (
                <tr
                  key={d._id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(d._id)}
                >
                  <td className="px-3 py-2 text-sm text-gray-900">{codeOrTitle || '-'}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{d.method}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{value}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{d.eligibility}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{minReq}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{combos}</td>
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

export default AmountOffOrderTable;

