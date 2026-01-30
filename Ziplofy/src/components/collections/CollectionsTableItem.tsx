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
      className="hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
        {collection.title}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
        {collection.pageTitle}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
        {collection.urlHandle}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 capitalize">
        {collection.status}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
        {collection.onlineStorePublishing ? 'Yes' : 'No'}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
        {collection.pointOfSalePublishing ? 'Yes' : 'No'}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
        {new Date(collection.updatedAt).toLocaleDateString()}
      </td>
    </tr>
  );
};

export default CollectionsTableItem;

