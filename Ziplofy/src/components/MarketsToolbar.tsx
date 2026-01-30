import { ArrowPathIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface MarketsToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onFilterClick?: () => void;
  onRefreshClick?: () => void;
}

const noop = () => {};

export default function MarketsToolbar({
  searchValue = '',
  onSearchChange = noop,
  onFilterClick = noop,
  onRefreshClick = noop,
}: MarketsToolbarProps) {
  return (
    <div className="bg-white border border-gray-200 rounded px-3 py-2 mb-4 flex items-center gap-2">
      <div className="relative flex-1">
        <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search in all markets"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-gray-400 focus:border-gray-300 text-sm outline-none transition-colors"
        />
      </div>
      <button
        type="button"
        title="Filters"
        onClick={onFilterClick}
        className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
      >
        <FunnelIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        title="Refresh"
        onClick={onRefreshClick}
        className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
      >
        <ArrowPathIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

