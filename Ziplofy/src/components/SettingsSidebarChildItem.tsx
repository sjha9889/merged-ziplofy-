import { SettingsNavItem } from './SettingsSidebarItem';

interface SettingsSidebarChildItemProps {
  child: SettingsNavItem;
  isActive: boolean;
  onChildClick: (path?: string) => void;
}

export default function SettingsSidebarChildItem({
  child,
  isActive,
  onChildClick,
}: SettingsSidebarChildItemProps) {
  return (
    <li>
      <button
        onClick={() => onChildClick(child.path)}
        className={`w-full flex items-center gap-2 px-3 py-1.5 pl-10 text-gray-600 hover:bg-gray-50 transition-colors text-left ${
          isActive ? 'bg-gray-50 text-gray-900' : ''
        }`}
      >
        <span className="text-xs">{child.text}</span>
      </button>
    </li>
  );
}

