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
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                Page Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                URL Handle
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                Online Store
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                POS
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                {onSortToggle ? (
                  <button
                    onClick={onSortToggle}
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"
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
          <tbody className="bg-white divide-y divide-gray-100">
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

