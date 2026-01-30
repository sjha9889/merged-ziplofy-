import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import React from 'react';
import SettingsSidebarChildrenList from './SettingsSidebarChildrenList';

export interface SettingsNavItem {
  text: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  path?: string;
  children?: SettingsNavItem[];
}

interface SettingsSidebarItemProps {
  item: SettingsNavItem;
  isCurrentPath: boolean;
  isExpanded: boolean;
  hasChildren: boolean;
  onItemClick: (item: SettingsNavItem) => void;
  onChildClick: (path?: string) => void;
  isActivePath: (path?: string) => boolean;
}

export default function SettingsSidebarItem({
  item,
  isCurrentPath,
  isExpanded,
  hasChildren,
  onItemClick,
  onChildClick,
  isActivePath,
}: SettingsSidebarItemProps) {
  const Icon = item.icon;

  return (
    <li>
      <button
        onClick={() => onItemClick(item)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors text-left ${
          isCurrentPath ? 'bg-gray-50' : ''
        }`}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span className="flex-1 text-sm font-medium">{item.text}</span>
        {hasChildren && (
          <span className="shrink-0">
            {isExpanded ? (
              <ChevronUpIcon className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            )}
          </span>
        )}
      </button>

      {hasChildren && (
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <SettingsSidebarChildrenList
            children={item.children!}
            isActivePath={isActivePath}
            onChildClick={onChildClick}
          />
        </div>
      )}
    </li>
  );
}

