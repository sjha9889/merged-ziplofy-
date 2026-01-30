import GridBackgroundWrapper from "../components/GridBackgroundWrapper";
import { ThemeCardList } from "../components/ThemeCardList";

export default function OnlineStorePage() {

  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-xl font-medium text-gray-900">Online Store</h1>
        </div>

        {/* Current Theme Section */}
        <div className="mb-8">
          <div className="bg-white border border-gray-200 p-4 flex gap-4">
            {/* Left side */}
            <div className="flex flex-col gap-4">
              <div className="relative w-fit">
                <img className="w-32 h-32 object-cover border border-gray-200" src="https://picsum.photos/seed/picsum/200/300" alt="" />
                <div className="absolute -right-2 -bottom-2">
                  <img className="w-16 h-16 object-cover border border-gray-200" src="https://picsum.photos/seed/picsum/200/300" alt="" />
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-sm text-gray-700 border border-gray-200 hover:bg-gray-50">View Your Store</button>
                <button className="px-3 py-1.5 text-sm text-gray-700 border border-gray-200 hover:bg-gray-50">Import Theme</button>
              </div>
            </div>

            {/* Right side */}
            <div className="flex gap-4">
              <img className="w-32 h-32 object-cover border border-gray-200" src="https://picsum.photos/seed/picsum/200/300" alt="" />
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-900">Horizon</span>
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5">Current Theme</span>
                </div>
                <span className="text-xs text-gray-500">Added: 10:07 am</span>
                <span className="text-xs text-gray-500">Version 4.0</span>
                <span className="text-xs text-gray-700">Edit Theme</span>
              </div>
            </div>
          </div>
        </div>

        {/* Explore Sections */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white border border-gray-200 p-4 flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-medium text-gray-900">Explore More Themes</h2>
              <p className="text-xs text-gray-600">Browse professionally designed free and premium themes</p>
            </div>
            <button className="px-3 py-1.5 text-sm text-gray-700 border border-gray-200 hover:bg-gray-50">Visit Theme Store</button>
          </div>

          <div className="bg-white border border-gray-200 p-4 flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-medium text-gray-900">Develop Your Theme</h2>
              <p className="text-xs text-gray-600">Use the Ziplofy CLI tool to develop your theme from scratch</p>
            </div>
            <button className="px-3 py-1.5 text-sm text-gray-700 border border-gray-200 hover:bg-gray-50">Get Started</button>
          </div>
        </div>

        {/* Theme Search Section */}
        <div className="bg-white border border-gray-200 p-4">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Design a Custom Theme</h2>
          <div className="mb-4">
            <input 
              className="w-full max-w-md px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              type="text" 
              placeholder="e.g. modern handmade jewellery"
            />
          </div>
          <div className="grid grid-cols-4 gap-4 overflow-y-auto max-h-[600px] py-2">
            <ThemeCardList/>
          </div>
        </div>
      </div>
    </GridBackgroundWrapper>
  )
}
