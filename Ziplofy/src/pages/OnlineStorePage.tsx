import {
  ArrowRightIcon,
  GlobeAltIcon,
  PaintBrushIcon,
  PencilSquareIcon,
  ShoppingBagIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeCardList } from '../components/ThemeCardList';

export default function OnlineStorePage() {
  const [customSearch, setCustomSearch] = useState('');

  return (
    <div className="min-h-screen bg-page-background-color">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-4">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Online Store</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your storefront, themes, and preferences
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/themes/all-themes"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <PaintBrushIcon className="w-4 h-4" />
                Themes
              </Link>
              <Link
                to="/online-store/preference"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <PencilSquareIcon className="w-4 h-4" />
                Preference
              </Link>
            </div>
          </div>
        </div>

        {/* Current Theme Section */}
        <div className="mb-6">
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left: Store preview */}
              <div className="flex flex-col gap-4">
                <div className="relative w-fit">
                  <img
                    className="w-36 h-44 object-cover rounded-lg border border-gray-200 shadow-sm"
                    src="https://picsum.photos/seed/store/200/300"
                    alt="Store preview"
                  />
                  <div className="absolute -right-2 -bottom-2 rounded-md overflow-hidden border-2 border-white shadow">
                    <img
                      className="w-14 h-14 object-cover"
                      src="https://picsum.photos/seed/store/200/300"
                      alt="Mobile preview"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <GlobeAltIcon className="w-4 h-4" />
                    View your store
                  </a>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Import theme
                  </button>
                </div>
              </div>

              {/* Right: Current theme info */}
              <div className="flex-1 flex flex-col lg:flex-row gap-6 lg:items-start">
                <img
                  className="w-full max-w-[200px] h-32 object-cover rounded-lg border border-gray-200"
                  src="https://picsum.photos/seed/horizon/200/300"
                  alt="Current theme"
                />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">Horizon</h2>
                    <span className="px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      Current theme
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Added: 10:07 am</p>
                  <p className="text-sm text-gray-500">Version 4.0</p>
                  <Link
                    to="/themes/builder"
                    className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Edit theme
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Explore Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                <ShoppingBagIcon className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Explore more themes</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Browse professionally designed free and premium themes
                </p>
              </div>
            </div>
            <Link
              to="/themes/all-themes"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shrink-0"
            >
              Visit theme store
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <SparklesIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Develop your theme</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Use the Ziplofy CLI tool to develop your theme from scratch
                </p>
              </div>
            </div>
            <Link
              to="/themes/builder"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors shrink-0"
            >
              Get started
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Design a Custom Theme Section */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <PaintBrushIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Design a custom theme</h2>
                <p className="text-sm text-gray-500">Create a theme tailored to your brand</p>
              </div>
            </div>
            <div className="relative max-w-md">
              <input
                type="text"
                value={customSearch}
                onChange={(e) => setCustomSearch(e.target.value)}
                placeholder="e.g. modern handmade jewellery"
                className="w-full pl-4 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all"
              />
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto max-h-[600px] py-2">
              <ThemeCardList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
