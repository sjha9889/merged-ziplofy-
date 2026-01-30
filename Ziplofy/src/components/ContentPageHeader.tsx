import { Cog6ToothIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

export default function ContentPageHeader() {
  return (
    <>
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-medium text-gray-900">Metaobjects</h1>
          <div className="flex gap-2">
            <button
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              type="button"
            >
              <Cog6ToothIcon className="w-4 h-4" />
              <span>Manage</span>
            </button>
            <button
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              type="button"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add definition</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

