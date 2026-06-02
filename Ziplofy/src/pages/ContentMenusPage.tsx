import {
  Bars3BottomLeftIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const placeholderMenus = [
  { id: '1', name: 'Main menu', handle: 'main-menu', itemCount: 0 },
  { id: '2', name: 'Footer menu', handle: 'footer', itemCount: 0 },
];

export const ContentMenusPage = () => {
  return (
    <div className="min-h-[calc(100vh-48px)] w-full bg-page-background-color">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-gray-200/80 bg-gradient-to-b from-white to-blue-50/20 px-5 py-5 shadow-sm sm:px-6">
          <div className="min-w-0 pl-3 border-l-4 border-blue-500/70">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">Navigation menus</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create and edit menus for your online store header, footer, and other locations.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Link
              to="/content/menus/new"
              className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Create menu
            </Link>
            <Link
              to="/content/url-redirects"
              className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-50"
            >
              URL redirects
            </Link>
          </div>
        </header>

        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
            <h2 className="text-base font-semibold text-gray-900">Your menus</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Menus control which links appear in theme sections. Edit a menu to add nested items and URLs.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-5 py-3 sm:px-6">Name</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Handle</th>
                  <th className="px-4 py-3 text-right">Menu items</th>
                  <th className="w-12 px-4 py-3" aria-label="Actions" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {placeholderMenus.map((menu) => (
                  <tr key={menu.id} className="transition-colors hover:bg-gray-50/60">
                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                          <Bars3BottomLeftIcon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">{menu.name}</p>
                          <p className="text-xs text-gray-500 sm:hidden">/{menu.handle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-4 text-gray-600 sm:table-cell">{menu.handle}</td>
                    <td className="px-4 py-4 text-right tabular-nums text-gray-600">{menu.itemCount}</td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                        aria-label={`More actions for ${menu.name}`}
                      >
                        <EllipsisHorizontalIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6">
            <p className="text-center text-xs text-gray-500">
              Sample menus shown for layout. Connect your store API to load and save real navigation data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
