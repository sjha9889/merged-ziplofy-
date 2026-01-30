import React from 'react';

interface CustomerEventsHeaderProps {
  onOpenModal: () => void;
}

const CustomerEventsHeader: React.FC<CustomerEventsHeaderProps> = ({
  onOpenModal,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
      <div>
        <h2 className="text-sm font-medium text-gray-900 mb-1">
          Pixels
        </h2>
        <p className="text-xs text-gray-600">
          Enable third-party services to securely collect and use customer event data from your store
        </p>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <button
          className="px-3 py-1.5 text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Explore pixel apps
        </button>
        <button
          onClick={onOpenModal}
          className="px-3 py-1.5 text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Add custom pixel
        </button>
      </div>
    </div>
  );
};

export default CustomerEventsHeader;

