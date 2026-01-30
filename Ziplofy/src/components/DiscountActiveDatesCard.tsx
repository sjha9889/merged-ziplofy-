import React from "react";

interface DiscountActiveDatesCardProps {
  startDate?: string;
  startTime?: string;
  setEndDate?: boolean;
  endDate?: string;
  endTime?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

const DiscountActiveDatesCard: React.FC<DiscountActiveDatesCardProps> = ({
  startDate,
  startTime,
  setEndDate,
  endDate,
  endTime,
  createdAt,
  updatedAt,
}) => {
  const formatDate = (date?: string | Date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="bg-white border border-gray-200 p-4">
      <h2 className="text-base font-medium mb-3 text-gray-900">Active Dates</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-600 mb-1">Start</p>
          <p className="text-sm text-gray-900">{[startDate, startTime].filter(Boolean).join(' ') || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">End</p>
          <p className="text-sm text-gray-900">{setEndDate ? ([endDate, endTime].filter(Boolean).join(' ') || '-') : 'No end date'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Created</p>
          <p className="text-sm text-gray-900">{formatDate(createdAt)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Updated</p>
          <p className="text-sm text-gray-900">{formatDate(updatedAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default DiscountActiveDatesCard;

