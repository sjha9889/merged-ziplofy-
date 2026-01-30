import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import React from 'react';
import type { Collection } from '../../contexts/collection.context';
import CollectionsTableItem from './CollectionsTableItem';

type SortOrder = 'asc' | 'desc';

interface CollectionsTableProps {
  collections: Collection[];
  onCollectionClick: (collectionId: string) => void;
  sortOrder?: SortOrder;
  onSortToggle?: () => void;
}

const CollectionsTable: React.FC<CollectionsTableProps> = ({
  collections,
  onCollectionClick,
  sortOrder,
  onSortToggle
}) => {
  return (
    <div className="bg-white rounded border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">
                Title
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">
                Page Title
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">
                URL Handle
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">
                Online Store
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">
                POS
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">
                {onSortToggle ? (
                  <button
                    onClick={onSortToggle}
                    className="flex items-center gap-1 hover:text-gray-900 transition-colors cursor-pointer"
                  >
                    Updated
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
                  <span>Updated</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {collections.map((collection) => (
              <CollectionsTableItem
                key={collection._id}
                collection={collection}
                onClick={onCollectionClick}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollectionsTable;

