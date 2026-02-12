import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import React from 'react';
import type { Collection } from '../../contexts/collection.context';

interface CollectionOverviewSectionProps {
  collection: Collection;
  onEdit: () => void;
  onDelete: () => void;
}

const CollectionOverviewSection: React.FC<CollectionOverviewSectionProps> = ({
  collection,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">Overview</h2>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onEdit}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            aria-label="Edit collection"
          >
            <PencilIcon className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            aria-label="Delete collection"
          >
            <TrashIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="border-t border-gray-200 mb-4"></div>
      {collection.description && (
        <p className="text-sm text-gray-600 mb-4">{collection.description}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-600 mb-1">Page title</p>
          <p className="text-sm text-gray-900">{collection.pageTitle || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">URL handle</p>
          <p className="text-sm text-gray-900">{collection.urlHandle || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Status</p>
          <p className="text-sm text-gray-900 capitalize">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                collection.status === 'published'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {collection.status || 'draft'}
            </span>
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs text-gray-600 mb-1">Meta description</p>
          <p className="text-sm text-gray-900">{collection.metaDescription || '-'}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 my-3"></div>

      <p className="text-xs text-gray-500">
        Last updated: {new Date(collection.updatedAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default CollectionOverviewSection;

