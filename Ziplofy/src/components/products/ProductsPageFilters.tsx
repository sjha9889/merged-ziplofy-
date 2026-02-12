import {
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import React from "react";

const ProductsPageFilters: React.FC = () => {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <span className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200/60 rounded-lg text-sm font-medium">
          All
        </span>
        <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products"
            className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm w-[280px] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
          />
        </div>
        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Filters">
          <FunnelIcon className="w-4 h-4" />
        </button>
        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
          <Squares2X2Icon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProductsPageFilters;

