import { TrashIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface Tag {
  _id: string;
  name: string;
}

interface TransferTagItemProps {
  tag: Tag;
  onDeleteClick: (tag: Tag) => void;
}

const TransferTagItem: React.FC<TransferTagItemProps> = ({ tag, onDeleteClick }) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-3 py-2 whitespace-nowrap">
        <span className="text-sm font-medium text-gray-900">{tag.name}</span>
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <button
          onClick={() => onDeleteClick(tag)}
          className="cursor-pointer p-1 hover:bg-red-50 rounded transition-colors"
          aria-label="Delete tag"
        >
          <TrashIcon className="w-4 h-4 text-gray-600 hover:text-red-600" />
        </button>
      </td>
    </tr>
  );
};

export default TransferTagItem;

