import { PlusIcon } from '@heroicons/react/24/outline';

interface CatalogsEmptyStateProps {
  onCreate: () => void;
}

export default function CatalogsEmptyState({ onCreate }: CatalogsEmptyStateProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col justify-center items-center gap-4">

      <div className="flex flex-col justify-center items-center text-center">
        <h2 className="text-base font-medium text-gray-900 mb-1.5">Personalize buying with catalogs</h2>
        <p className="text-sm text-gray-600">
          Create custom product and pricing offerings for your customers with catalogs.
        </p>
      </div>
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

