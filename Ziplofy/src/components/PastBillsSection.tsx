import {
  ArrowPathIcon,
  EllipsisHorizontalIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface PastBillsSectionProps {
  onViewCharges: () => void;
}

const PastBillsSection: React.FC<PastBillsSectionProps> = ({ onViewCharges }) => {
  const [billFilter, setBillFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleMenuToggle = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const handleViewChargesClick = useCallback(() => {
    handleMenuClose();
    onViewCharges();
  }, [handleMenuClose, onViewCharges]);

  const handleFilterChange = useCallback((newFilter: 'all' | 'paid' | 'unpaid') => {
    setBillFilter(newFilter);
  }, []);

  const handleFilterAll = useCallback(() => {
    handleFilterChange('all');
  }, [handleFilterChange]);

  const handleFilterPaid = useCallback(() => {
    handleFilterChange('paid');
  }, [handleFilterChange]);

  const handleFilterUnpaid = useCallback(() => {
    handleFilterChange('unpaid');
  }, [handleFilterChange]);

  // Handle click outside menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        handleMenuClose();
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen, handleMenuClose]);

  return (
    <div className="border border-gray-200 bg-white/95">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between relative">
        <h3 className="text-sm font-medium text-gray-900">
          Past bills
        </h3>
        <div className="relative">
          <button
            ref={menuButtonRef}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={handleMenuToggle}
          >
            <EllipsisHorizontalIcon className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 top-full mt-1 bg-white border border-gray-200 z-10 min-w-[180px]"
            >
              <button
                className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={handleViewChargesClick}
              >
                View in charge table
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 gap-3 border-b border-gray-200">
        <div className="flex gap-1">
          <button
            className={`px-2 py-1 text-xs font-medium transition-colors ${
              billFilter === 'all'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            onClick={handleFilterAll}
          >
            All
          </button>
          <button
            className={`px-2 py-1 text-xs font-medium transition-colors ${
              billFilter === 'paid'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            onClick={handleFilterPaid}
          >
            Paid
          </button>
          <button
            className={`px-2 py-1 text-xs font-medium transition-colors ${
              billFilter === 'unpaid'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            onClick={handleFilterUnpaid}
          >
            Unpaid
          </button>
        </div>

        <div className="flex gap-1">
          <button className="p-1.5 border border-gray-200 hover:bg-gray-50 transition-colors">
            <MagnifyingGlassIcon className="w-3.5 h-3.5 text-gray-600" />
          </button>
          <button className="p-1.5 border border-gray-200 hover:bg-gray-50 transition-colors">
            <FunnelIcon className="w-3.5 h-3.5 text-gray-600" />
          </button>
          <button className="p-1.5 border border-gray-200 hover:bg-gray-50 transition-colors">
            <ArrowPathIcon className="w-3.5 h-3.5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="border border-gray-200 mx-4 my-4 h-[200px] flex items-center justify-center bg-gray-50">
        <p className="text-xs text-gray-600">
          Your past bills will appear here.
        </p>
      </div>

      <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          Showing 0 results
        </p>
        <div className="flex gap-1">
          <button
            className="min-w-[32px] px-2 py-1 border border-gray-200 text-xs text-gray-400 cursor-not-allowed"
            disabled
          >
            ‹
          </button>
          <button
            className="min-w-[32px] px-2 py-1 border border-gray-200 text-xs text-gray-400 cursor-not-allowed"
            disabled
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default PastBillsSection;

