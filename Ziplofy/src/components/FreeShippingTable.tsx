import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FreeShippingDiscount } from '../contexts/free-shipping-discount.context';

interface FreeShippingTableProps {
  discounts: FreeShippingDiscount[];
}

const FreeShippingTable: React.FC<FreeShippingTableProps> = ({
  discounts,
}) => {
  const navigate = useNavigate();

  const handleRowClick = useCallback((discountId: string) => {
    navigate(`/discounts/free-shipping/${discountId}`);
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
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Country Selection</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Exclude Rates</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Rate Limit</th>
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
              const minReq = d.minimumPurchase === 'minimum-amount'
                ? `Min Amount ₹${d.minimumAmount ?? 0}`
                : d.minimumPurchase === 'minimum-quantity'
                  ? `Min Qty ${d.minimumQuantity ?? 0}`
                  : 'None';
              const combos = `P:${d.productDiscounts ? 'Y' : 'N'} / O:${d.orderDiscounts ? 'Y' : 'N'}`;
              return (
                <tr
                  key={d._id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(d._id)}
                >
                  <td className="px-3 py-2 text-sm text-gray-900">{codeOrTitle || '-'}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{d.method}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{d.countrySelection}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{d.excludeShippingRates ? 'Yes' : 'No'}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{d.excludeShippingRates ? (d.shippingRateLimit ?? '-') : '-'}</td>
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

export default FreeShippingTable;

