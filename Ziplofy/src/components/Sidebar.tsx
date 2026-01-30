// src/components/Sidebar.tsx
import {
  ChartBarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog6ToothIcon,
  CubeIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  HomeIcon,
  MegaphoneIcon,
  PuzzlePieceIcon,
  ShoppingCartIcon,
  TagIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Sidebar dimensions
const drawerWidth = 240;

// ---- Types ----
interface SubNavItem {
  text: string;
  path: string;
}

interface NavItem {
  text: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  path: string;
  children?: SubNavItem[];
}

const NAV: NavItem[] = [
  { text: 'Home', icon: HomeIcon, path: '/' },
  {
    text: 'Orders',
    icon: ShoppingCartIcon,
    path: '/orders',
    children: [
      { text: 'Orders', path: '/orders' },
      { text: 'Drafts', path: '/orders/drafts' },
      { text: 'Abandoned Carts', path: '/orders/abandoned-carts' },
    ],
  },
  {
    text: 'Products',
    icon: CubeIcon,
    path: '/products',
    children: [
      { text: 'Collections', path: '/products/collections' },
      { text: 'Inventory', path: '/products/inventory' },
      { text: 'Purchase orders', path: '/products/purchase-orders' },
      { text: 'Transfers', path: '/products/transfers' },
      { text: 'Gift cards', path: '/products/gift-cards' },
    ],
  },
  {
    text: 'Customers',
    icon: UserGroupIcon,
    path: '/customers',
    children: [{ text: 'Segments', path: '/customers/segments' }],
  },
  {
    text: 'Marketing',
    icon: MegaphoneIcon,
    path: '/marketing',
    children: [
      { text: 'Campaigns', path: '/marketing/campaigns' },
      { text: 'Attribution', path: '/marketing/attribution' },
      { text: 'Automations', path: '/marketing/automations' },
    ],
  },
  { text: 'Discounts', icon: TagIcon, path: '/discounts' },
  {
    text: 'Content',
    icon: DocumentTextIcon,
    path: '/content',
    children: [
      { text: 'Metaobjects', path: '/content/metaobjects' },
      { text: 'Files', path: '/content/files' },
      { text: 'Menus', path: '/content/menus' },
      { text: 'Blog posts', path: '/content/blog-posts' },
    ],
  },
  {
    text: 'Markets',
    icon: GlobeAltIcon,
    path: '/markets',
    children: [{ text: 'Catalogs', path: '/markets/catalogs' }],
  },
  {
    text: 'Analytics',
    icon: ChartBarIcon,
    path: '/analytics',
    children: [
      { text: 'Reports', path: '/analytics/reports' },
      { text: 'Live View', path: '/analytics/live-view' },
    ],
  },
  {
    text: 'Online Store',
    icon: GlobeAltIcon,
    path: '/online-store',
    children: [
      { text: 'Themes', path: '/online-store/themes' },
      { text: 'Pages', path: '/online-store/pages' },
      { text: 'Preference', path: '/online-store/preference' },
    ],
  },
  {
    text: 'Themes',
    icon: PuzzlePieceIcon,
    path: '/themes/all-themes',
  },
  {
    text: 'Tag Management',
    icon: TagIcon,
    path: '/tag-management',
  },
  {
    text: 'Vendors',
    icon: UserGroupIcon,
    path: '/vendors',
  },
];

// ---- Component ----
export default function Sidebar() {
  const location = useLocation();

  const defaultOpen = useMemo(() => {
    const map: Record<string, boolean> = {};
    NAV.forEach((n) => {
      if (n.children) map[n.text] = location.pathname.startsWith(n.path);
    });
    return map;
  }, [location.pathname]);

  const [open, setOpen] = useState<Record<string, boolean>>(defaultOpen);
  useEffect(() => setOpen(defaultOpen), [defaultOpen]);

  const toggle = useCallback((k: string) => {
    setOpen((p) => ({ ...p, [k]: !p[k] }));
  }, []);

  const isActive = useCallback(
    (path: string): boolean => location.pathname === path || location.pathname.startsWith(path + '/'),
    [location.pathname]
  );

  return (
    <aside
      className="fixed bg-white border-r border-gray-200 left-0 top-[60px] h-[calc(100vh-60px)] w-[240px] flex flex-col shrink-0 z-50"
      style={{ 
        width: `${drawerWidth}px`
      }}
    > 
      {/* navbar  */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-0 m-0 list-none">
          {/* nav list */}
          {NAV.map((item) => {
            const hasKids = !!item.children?.length;
            const openSection = open[item.text] ?? false;
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <li key={item.text}>
                <Link
                  to={item.path}
                  onClick={() => {
                    if (hasKids) {
                      toggle(item.text);
                    }
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors ${
                    active ? 'bg-gray-50' : ''
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-sm font-medium">{item.text}</span>
                  {hasKids && (
                    <span className="shrink-0">
                      {openSection ? (
                        <ChevronUpIcon className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                      )}
                    </span>
                  )}
                </Link>

                {hasKids && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openSection ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <ul className="p-0 m-0 list-none">
                      {item.children!.map((sub) => {
                        const subActive = location.pathname === sub.path;
                        return (
                          <li key={sub.text}>
                            <Link
                              to={sub.path}
                              className={`flex items-center gap-2 px-3 py-1.5 pl-10 text-gray-600 hover:bg-gray-50 transition-colors ${
                                subActive ? 'bg-gray-50 text-gray-900' : ''
                              }`}
                            >
                              <span className="text-xs">{sub.text}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className='border-t border-gray-200 w-full mt-2'></div>
      {/* settings option */}
      <nav>
        <ul className="p-0 m-0 list-none">
          <li>
            <Link
              to="/settings/general"
              className={`flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors ${
                location.pathname.startsWith('/settings') ? 'bg-gray-50' : ''
              }`}
            >
              <Cog6ToothIcon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-sm font-medium">Settings</span>
            </Link>
          </li>
        </ul>
      </nav>

    </aside>
  );
}
