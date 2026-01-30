import React from 'react';

interface TransfersPageHeaderProps {
  onCreateTransfer: () => void;
}

const TransfersPageHeader: React.FC<TransfersPageHeaderProps> = ({ onCreateTransfer }) => {
  return (
    <div className="border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-medium text-gray-900">
          Transfers
        </h1>
        <button
          onClick={onCreateTransfer}
          className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors"
        >
          Create Transfer
        </button>
      </div>
    </div>
  );
};

export default TransfersPageHeader;

