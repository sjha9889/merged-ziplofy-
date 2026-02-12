import React from 'react';
import PurchaseOrderTagSectionTableItem from './PurchaseOrderTagSectionTableItem';

interface Tag {
  _id: string;
  name: string;
}

interface PurchaseOrderTagsSectionTableProps {
  tags: Tag[];
  onDeleteClick: (tag: Tag) => void;
}

const PurchaseOrderTagsSectionTable: React.FC<PurchaseOrderTagsSectionTableProps> = ({
  tags,
  onDeleteClick,
}) => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
              Tag Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tags.map(tag => (
            <PurchaseOrderTagSectionTableItem key={tag._id} tag={tag} onDeleteClick={onDeleteClick} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseOrderTagsSectionTable;

