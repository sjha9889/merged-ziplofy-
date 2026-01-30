import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface SettingsSidebarHeaderProps {
  onBack: () => void;
}

export default function SettingsSidebarHeader({ onBack }: SettingsSidebarHeaderProps) {
  return (
    <div className="px-4 py-3 border-b border-gray-200">
      <div className="flex items-center">
        <button
          onClick={onBack}
          className="cursor-pointer mr-2 p-1.5 text-gray-500 hover:bg-black/5 hover:text-gray-700 rounded transition-colors"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </button>
        <h2 className="text-sm font-medium text-gray-700">Settings</h2>
      </div>
    </div>
  );
}

