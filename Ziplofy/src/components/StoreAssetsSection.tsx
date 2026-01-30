import { ChevronRightIcon, TagIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function StoreAssetsSection() {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 p-4">
      <h2 className="text-base font-medium text-gray-900 mb-4">Store assets</h2>

      <div className="mb-2">
        <button
          onClick={() => navigate('/settings/general/metafields')}
          className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors text-left"
        >
          <TagIcon className="w-4 h-4 text-gray-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-gray-900">Metafields</p>
            <p className="text-xs text-gray-600">Available in themes and configurable for Storefront API</p>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-gray-600 shrink-0" />
        </button>
      </div>

      <hr className="my-2 border-gray-200" />

      <div>
        <button
          onClick={() => navigate('/settings/general/branding')}
          className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors text-left"
        >
          <TagIcon className="w-4 h-4 text-gray-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-gray-900">Brand</p>
            <p className="text-xs text-gray-600">Integrate brand assets across sales channels, themes and apps</p>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-gray-600 shrink-0" />
        </button>
      </div>
    </div>
  );
}

