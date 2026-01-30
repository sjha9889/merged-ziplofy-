import React, { useCallback } from 'react';

interface CustomerSegment {
  _id: string;
  name: string;
  createdAt: string;
}

interface CustomerSegmentItemProps {
  segment: CustomerSegment;
  onSegmentClick: (segmentId: string) => void;
  onEditClick: (e: React.MouseEvent, segmentId: string, segmentName: string) => void;
}

const CustomerSegmentItem: React.FC<CustomerSegmentItemProps> = ({
  segment,
  onSegmentClick,
  onEditClick,
}) => {
  const handleClick = useCallback(() => {
    onSegmentClick(segment._id);
  }, [segment._id, onSegmentClick]);

  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      onEditClick(e, segment._id, segment.name);
    },
    [segment._id, segment.name, onEditClick]
  );

  return (
    <tr
      className="cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={handleClick}
    >
      <td className="px-3 py-2 whitespace-nowrap">
        <span className="font-medium text-gray-900 text-sm">{segment.name}</span>
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <span className="text-sm text-gray-600">{new Date(segment.createdAt).toLocaleDateString()}</span>
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-right">
        <button
          className="px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
          onClick={handleEdit}
        >
          Edit
        </button>
      </td>
    </tr>
  );
};

export default CustomerSegmentItem;

