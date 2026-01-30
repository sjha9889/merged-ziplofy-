import { PlusIcon } from '@heroicons/react/24/outline';

interface MarketsCatalogsHeaderProps {
  onCreate: () => void;
}

export default function MarketsCatalogsHeader({ onCreate }: MarketsCatalogsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-medium text-gray-900">Catalogs</h1>
      <button
        type="button"
        onClick={onCreate}
        className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-gray-900 text-white text-sm font-medium transition-colors"
      >
        <PlusIcon className="w-4 h-4" />
        <span>Create catalog</span>
      </button>
    </div>
  );
}

