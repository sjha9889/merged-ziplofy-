import React from "react";

interface FreeShippingActiveDatesCardProps {
  startDate?: string;
  startTime?: string;
  setEndDate?: boolean;
  endDate?: string;
  endTime?: string;
}

const FreeShippingActiveDatesCard: React.FC<FreeShippingActiveDatesCardProps> = ({
  startDate,
  startTime,
  setEndDate,
  endDate,
  endTime,
}) => {
  const renderBoolean = (v?: boolean) => (v ? 'Yes' : 'No');

  return (
    <div className="bg-white border border-gray-200 p-4">
      <h2 className="text-base font-medium mb-3 text-gray-900">Active Dates</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-600 mb-1">Start Date</p>
          <p className="text-sm text-gray-900">{startDate} {startTime ? `at ${startTime}` : ''}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Set End Date</p>
          <p className="text-sm text-gray-900">{renderBoolean(setEndDate)}</p>
        </div>
        {setEndDate && (
          <div>
            <p className="text-xs text-gray-600 mb-1">End Date</p>
            <p className="text-sm text-gray-900">{endDate} {endTime ? `at ${endTime}` : ''}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreeShippingActiveDatesCard;

