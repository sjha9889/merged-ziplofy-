import React from 'react';
import TransferTagItem from './TransferTagItem';

interface Tag {
  _id: string;
  name: string;
}

interface TransferTagsListProps {
  tags: Tag[];
  loading: boolean;
  onDeleteClick: (tag: Tag) => void;
}

const TransferTagsList: React.FC<TransferTagsListProps> = ({
  tags,
  loading,
  onDeleteClick,
}) => {
  if (loading) {
    return (
      <div className="text-sm text-gray-500 py-4">Loading tags...</div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="text-sm text-gray-500 py-4">No tags yet.</div>
    );
  }

  return (
    <div className="border border-gray-200 rounded overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">
              Tag Name
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tags.map(tag => (
            <TransferTagItem key={tag._id} tag={tag} onDeleteClick={onDeleteClick} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransferTagsList;

