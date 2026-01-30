import GridBackgroundWrapper from "../components/GridBackgroundWrapper";

export const ContentFilesPage = () => {
  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        {/* Header */}
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-medium text-gray-900">Files</h1>
            <button className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors">
              Upload files
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="w-full border border-gray-200 min-h-[400px] justify-center flex items-center">
            <div className="flex flex-col justify-center items-center gap-2">
              <span className="text-base font-medium text-gray-900">Upload and manage your files</span>
              <span className="text-xs text-gray-600">Files can be images, videos, documents and more.</span>
              <button className="mt-2 px-3 py-1.5 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors">
                Upload files
              </button>
            </div>
          </div>
        </div>
      </div>
    </GridBackgroundWrapper>
  )
}
