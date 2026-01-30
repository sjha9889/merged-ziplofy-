import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface AmountOffProductsDiscount {
  _id: string;
  valueType: 'percentage' | 'fixed-amount';
  percentage?: number;
  fixedAmount?: number;
  method: string;
  discountCode?: string;
  title?: string;
  appliesTo?: string;
  eligibility?: string;
  minimumPurchase?: string;
  minimumAmount?: number;
  minimumQuantity?: number;
  productDiscounts?: boolean;
  orderDiscounts?: boolean;
  shippingDiscounts?: boolean;
  totalUsesLimit?: number;
  limitTotalUses?: boolean;
  status?: string;
  createdAt: string;
}

interface AmountOffProductsTableProps {
  discounts: AmountOffProductsDiscount[];
}

const AmountOffProductsTable: React.FC<AmountOffProductsTableProps> = ({
  discounts,
}) => {
  const navigate = useNavigate();

  const handleRowClick = useCallback((discountId: string) => {
    navigate(`/discounts/${discountId}`);
  }, [navigate]);

  const boolToYesNo = useCallback((v?: boolean) => (v ? 'Yes' : 'No'), []);

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
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Applies to</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Eligibility</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Min Purchase</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Min Qty</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Product Disc.</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Order Disc.</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Shipping Disc.</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Total Uses Limit</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Limit Total Uses</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Created</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {discounts.map((d) => {
              const value = d.valueType === 'percentage'
                ? `${d.percentage ?? 0}%`
                : `₹${d.fixedAmount ?? 0}`;
              const codeOrTitle = d.method === 'discount-code' ? d.discountCode : d.title;
              return (
                <tr
                  key={d._id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(d._id)}
                >
                  <td className="px-3 py-2 text-sm text-gray-900">{codeOrTitle || '-'}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{d.method}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{value}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{d.appliesTo}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{d.eligibility}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{d.minimumPurchase || '-'}{d.minimumPurchase === 'minimum-amount' && d.minimumAmount !== undefined ? ` (₹${d.minimumAmount})` : ''}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{d.minimumQuantity ?? '-'}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{boolToYesNo(d.productDiscounts)}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{boolToYesNo(d.orderDiscounts)}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{boolToYesNo(d.shippingDiscounts)}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{d.totalUsesLimit ?? '-'}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{boolToYesNo(d.limitTotalUses)}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{d.status || 'active'}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{new Date(d.createdAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AmountOffProductsTable;

