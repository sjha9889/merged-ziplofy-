import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import React from 'react';
import type { GiftCard } from '../../contexts/gift-cards.context';
import GiftCardTableItem from './GiftCardTableItem';

type SortOrder = 'asc' | 'desc';

interface GiftCardTableProps {
  giftCards: GiftCard[];
  onGiftCardClick: (giftCardId: string) => void;
  loading?: boolean;
  sortOrder?: SortOrder;
  onSortToggle?: () => void;
}

const GiftCardTable: React.FC<GiftCardTableProps> = ({
  giftCards,
  onGiftCardClick,
  loading = false,
  sortOrder,
  onSortToggle
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">
              Gift Card Code
            </th>
            <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">
              Initial Value
            </th>
            <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">
              Status
            </th>
            <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">
              Expiration Date
            </th>
            <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">
              {onSortToggle ? (
                <button
                  onClick={onSortToggle}
                  className="flex items-center gap-1 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Created Date
                  {sortOrder && (
                    <span className="inline-flex items-center">
                      {sortOrder === 'asc' ? (
                        <ArrowUpIcon className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownIcon className="w-3.5 h-3.5" />
                      )}
                    </span>
                  )}
                </button>
              ) : (
                <span>Created Date</span>
              )}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={5} className="px-3 py-6 text-center text-sm text-gray-600">
                Loading gift cards...
              </td>
            </tr>
          ) : giftCards.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-3 py-6 text-center text-sm text-gray-600">
                No gift cards found
              </td>
            </tr>
          ) : (
            giftCards.map((giftCard) => (
              <GiftCardTableItem
                key={giftCard._id}
                giftCard={giftCard}
                onClick={onGiftCardClick}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GiftCardTable;

