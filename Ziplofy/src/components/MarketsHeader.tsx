import { ChartBarIcon, PlusIcon } from '@heroicons/react/24/outline';

interface MarketsHeaderProps {
  onCreateMarket: () => void;
  onGraphView?: () => void;
}

export default function MarketsHeader({ onCreateMarket, onGraphView }: MarketsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-xl font-medium text-gray-900">Markets</h1>
      <div className="flex items-center gap-2">
        {onGraphView && (
          <button
            type="button"
            onClick={onGraphView}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <ChartBarIcon className="w-4 h-4" />
            <span>Graph view</span>
          </button>
        )}
        <button
          type="button"
          className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-gray-900 text-white transition-colors text-sm font-medium"
          onClick={onCreateMarket}
        >
          <PlusIcon className="w-4 h-4" />
          <span>Create market</span>
        </button>
      </div>
    </div>
  );
}

