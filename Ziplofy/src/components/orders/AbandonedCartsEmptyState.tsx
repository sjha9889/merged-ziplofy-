import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import React from 'react';

const AbandonedCartsEmptyState: React.FC = () => {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <ShoppingCartIcon className="w-8 h-8 text-gray-500" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">No abandoned carts</h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto">
        Carts that aren't completed will appear here
      </p>
    </div>
  );
};

export default AbandonedCartsEmptyState;

