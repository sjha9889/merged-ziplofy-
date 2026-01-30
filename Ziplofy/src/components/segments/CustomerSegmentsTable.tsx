import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import React, { useCallback } from 'react';
import CustomerSegmentItem from './CustomerSegmentItem';

interface CustomerSegment {
  _id: string;
  name: string;
  createdAt: string;
}

interface CustomerSegmentsTableProps {
  segments: CustomerSegment[];
  sortOrder: 'asc' | 'desc';
  onSortToggle: () => void;
  onSegmentClick: (segmentId: string) => void;
  onEditClick: (e: React.MouseEvent, segmentId: string, segmentName: string) => void;
}

const CustomerSegmentsTable: React.FC<CustomerSegmentsTableProps> = ({
  segments,
  sortOrder,
  onSortToggle,
  onSegmentClick,
  onEditClick,
}) => {
  const handleSortClick = useCallback(() => {
    onSortToggle();
  }, [onSortToggle]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">
              Segment Name
            </th>
            <th
              className="px-3 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={handleSortClick}
            >
              <div className="flex items-center gap-1.5">
                <span>Created</span>
                {sortOrder === 'asc' ? (
                  <ArrowUpIcon className="w-3.5 h-3.5 text-gray-600" />
                ) : (
                  <ArrowDownIcon className="w-3.5 h-3.5 text-gray-600" />
                )}
              </div>
            </th>
            <th className="px-3 py-2 text-right text-sm font-medium text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {segments.map((s) => (
            <CustomerSegmentItem
              key={s._id}
              segment={s}
              onSegmentClick={onSegmentClick}
              onEditClick={onEditClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerSegmentsTable;

