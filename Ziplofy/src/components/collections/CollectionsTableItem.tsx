import React, { useCallback } from 'react';
import type { Collection } from '../../contexts/collection.context';

interface CollectionsTableItemProps {
  collection: Collection;
  onClick: (collectionId: string) => void;
}

const CollectionsTableItem: React.FC<CollectionsTableItemProps> = ({
  collection,
  onClick
}) => {
  const handleClick = useCallback(() => {
    onClick(collection._id);
  }, [onClick, collection._id]);

  return (
    <tr
      onClick={handleClick}
      className="hover:bg-blue-50/50 cursor-pointer transition-colors"
    >
      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
        {collection.title}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
        {collection.pageTitle}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
        {collection.urlHandle}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg border ${
          collection.status === 'active'
            ? 'bg-green-50 text-green-700 border-green-200/80'
            : 'bg-gray-100 text-gray-600 border-gray-200/80'
        }`}>
          {collection.status}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
        {collection.onlineStorePublishing ? 'Yes' : 'No'}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
        {collection.pointOfSalePublishing ? 'Yes' : 'No'}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
        {new Date(collection.updatedAt).toLocaleDateString()}
      </td>
    </tr>
  );
};

export default CollectionsTableItem;

