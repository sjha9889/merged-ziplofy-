import { Cog6ToothIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function ContentPageHeader() {
  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div className="pl-3 border-l-4 border-blue-500/60">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Metaobjects</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your metaobject definitions and content blocks</p>
      </div>
      <div className="flex gap-2">
        <button
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200/80 text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 text-sm font-medium transition-colors"
          type="button"
        >
          <Cog6ToothIcon className="w-4 h-4" />
          <span>Manage</span>
        </button>
        <button
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold transition-colors shadow-sm"
          type="button"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add definition</span>
        </button>
      </div>
    </div>
  );
}

