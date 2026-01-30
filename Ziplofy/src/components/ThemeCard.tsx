import {
  ArrowDownTrayIcon,
  EyeIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import React, { useCallback } from 'react';

interface ThemeCardProps {
  theme: {
    _id: string;
    name: string;
    description?: string | null;
    category: string;
    thumbnailUrl?: string | null;
    rating?: {
      average?: number;
    } | null;
  };
  installedThemes: any[];
  onInstallClick: (themeId: string) => void;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, installedThemes, onInstallClick }) => {
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src =
      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23f3f4f6"/><text x="150" y="100" text-anchor="middle" fill="%236b7280" font-family="Arial" font-size="14">No Preview</text></svg>';
  }, []);

  const isInstalled = Array.isArray(installedThemes) && installedThemes.some((it: any) => String((it.themeId || {})._id) === String(theme._id));

  return (
    <div className="bg-white border border-gray-200 flex flex-col hover:border-gray-300 transition-colors group">
      <div className="relative w-full h-[140px] overflow-hidden bg-gray-50">
        <img
          src={theme?.thumbnailUrl || ''}
          alt={theme?.name}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button className="flex items-center gap-1 px-2 py-1 border border-white bg-transparent text-white text-xs hover:bg-white hover:text-gray-900">
            <EyeIcon className="w-3 h-3" />
            <span>Preview</span>
          </button>
          <button className="flex items-center gap-1 px-2 py-1 border border-white bg-transparent text-white text-xs hover:bg-white hover:text-gray-900">
            <ArrowDownTrayIcon className="w-3 h-3" />
            <span>Details</span>
          </button>
        </div>
      </div>

      <div className="p-3">
        <div className="flex justify-between items-start mb-1.5">
          <h3 className="text-xs font-medium text-gray-900 capitalize">{theme?.name}</h3>
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-2.5 h-2.5 text-orange-500 fill-current" />
              ))}
            </div>
            <span className="text-xs text-gray-500">{Number(theme?.rating?.average || 0).toFixed(1)}</span>
          </div>
        </div>

        {theme?.description && <p className="text-xs text-gray-600 mb-2 leading-snug capitalize line-clamp-2">{theme?.description}</p>}

        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500 bg-gray-50 px-1.5 py-0.5 capitalize">{theme?.category}</span>
          <span className="text-xs text-gray-600">Free</span>
        </div>

        <div className="flex gap-1.5 flex-col">
          <button className="w-full px-2 py-1.5 text-xs font-medium text-white bg-gray-900 border border-gray-900 hover:bg-gray-800">
            Try theme
          </button>
          <div className="flex gap-1.5">
            <button className="flex-1 px-2 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 hover:bg-gray-50">
              View demo
            </button>
            {isInstalled ? (
              <button className="flex-1 px-2 py-1.5 text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 cursor-not-allowed" disabled>
                Installed
              </button>
            ) : (
              <button onClick={() => onInstallClick(theme._id)} className="flex-1 px-2 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 hover:bg-gray-50">
                Install
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCard;
