import { GlobeAltIcon } from '@heroicons/react/24/outline';

interface MarketsListItemProps {
  id: string;
  name: string;
  status: string;
  onSelect: (id: string) => void;
}

export default function MarketsListItem({ id, name, status, onSelect }: MarketsListItemProps) {
  const isActive = status === 'active';

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className="cursor-pointer w-full text-left px-3 py-2 grid grid-cols-[2fr_1fr] hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <GlobeAltIcon className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-900">{name}</span>
      </div>
      <div className="flex items-center">
        {isActive ? (
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-green-50 text-green-700 border border-green-200">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-gray-50 text-gray-700 border border-gray-200">
            Draft
          </span>
        )}
      </div>
    </button>
  );
}

