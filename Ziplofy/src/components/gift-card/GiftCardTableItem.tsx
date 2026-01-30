import React from 'react';
import type { GiftCard } from '../../contexts/gift-cards.context';

interface GiftCardTableItemProps {
  giftCard: GiftCard;
  onClick: (giftCardId: string) => void;
}

const GiftCardTableItem: React.FC<GiftCardTableItemProps> = ({ giftCard, onClick }) => {
  const handleClick = () => {
    onClick(giftCard._id);
  };

  return (
    <tr
      onClick={handleClick}
      className="hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
        <div className="font-mono">{giftCard.code}</div>
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
        ₹{giftCard.initialValue.toFixed(2)}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-sm">
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${
            giftCard.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {giftCard.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
        {giftCard.expirationDate
          ? new Date(giftCard.expirationDate).toLocaleDateString()
          : '—'}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
        {new Date(giftCard.createdAt).toLocaleDateString()}
      </td>
    </tr>
  );
};

export default GiftCardTableItem;

