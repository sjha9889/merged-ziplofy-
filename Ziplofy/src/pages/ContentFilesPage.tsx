import { DocumentArrowUpIcon, FolderIcon } from "@heroicons/react/24/outline";

export const ContentFilesPage = () => {
  return (
    <div className="min-h-screen bg-page-background-color">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="pl-3 border-l-4 border-blue-500/60">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Files</h1>
            <p className="text-sm text-gray-500 mt-0.5">Upload and manage images, videos, documents, and more</p>
          </div>
          <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold transition-colors shadow-sm">
            <DocumentArrowUpIcon className="w-4 h-4" />
            Upload files
          </button>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm min-h-[400px] flex justify-center items-center p-12">
          <div className="flex flex-col justify-center items-center text-center gap-4 max-w-md">
            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
              <FolderIcon className="w-7 h-7 text-blue-600" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-lg font-semibold text-gray-900">Upload and manage your files</span>
              <span className="text-sm text-gray-500">
                Files can be images, videos, documents and more.
              </span>
            </div>
            <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold transition-colors mt-2">
              <DocumentArrowUpIcon className="w-4 h-4" />
              Upload files
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
