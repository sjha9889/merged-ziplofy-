import { ArrowPathIcon } from '@heroicons/react/24/outline';
import React, { useCallback } from 'react';

interface AbandonedCartsHeaderProps {
  cartCount: number;
  loading: boolean;
  onRefresh: () => void;
}

const AbandonedCartsHeader: React.FC<AbandonedCartsHeaderProps> = ({ cartCount, loading, onRefresh }) => {
  const handleRefresh = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  return (
    <div className="flex items-center justify-between mb-6 pl-3 border-l-4 border-gray-300">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Abandoned Carts</h1>
        <p className="text-sm text-gray-500 mt-0.5">{cartCount} {cartCount === 1 ? 'cart' : 'carts'}</p>
      </div>
      <button
        onClick={handleRefresh}
        disabled={loading}
        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Refresh"
      >
        <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
};

export default AbandonedCartsHeader;

