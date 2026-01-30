import React, { useCallback, useEffect } from 'react';
import { useStore } from '../contexts/store.context';
import { useStoreSubdomain } from '../contexts/storeSubdomain.context';

const CustomizeDomainCard: React.FC = () => {
  const { activeStoreId } = useStore();
  const { storeSubdomain, getByStoreId, loading: subLoading, error: subError } = useStoreSubdomain();

  // Fetch store subdomain on active store change
  useEffect(() => {
    if (activeStoreId) {
      getByStoreId(activeStoreId);
    }
  }, [activeStoreId, getByStoreId]);

  const handleManageClick = useCallback(() => {
    // Handle manage button click - can be extended later
    console.log('Manage domain clicked');
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
      <div>
        <h6 className="text-base font-medium text-gray-900 mb-1.5">Customize your domain</h6>
        {subError ? (
          <p className="text-sm text-red-600">{subError}</p>
        ) : (
          <p className="text-sm text-gray-600">
            Default domain:{' '}
            {subLoading ? (
              'Loading...'
            ) : storeSubdomain?.url ? (
              <a
                href={storeSubdomain.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:underline"
              >
                {storeSubdomain.url.replace(/^https?:\/\//, '')}
              </a>
            ) : (
              '—'
            )}
          </p>
        )}
      </div>
      <button
        onClick={handleManageClick}
        className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
      >
        Manage
      </button>
    </div>
  );
};

export default CustomizeDomainCard;

