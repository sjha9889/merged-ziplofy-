import {
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import React from "react";

const ProductsPageFilters: React.FC = () => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-medium text-gray-900">
            All
          </span>
          <button className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors">
            <PlusIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products"
              className="pl-9 pr-3 py-1.5 border border-gray-200 rounded text-sm w-[280px] focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
            />
          </div>
          <button className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors">
            <FunnelIcon className="w-4 h-4" />
          </button>
          <button className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors">
            <Squares2X2Icon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsPageFilters;

