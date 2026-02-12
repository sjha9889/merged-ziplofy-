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
    <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm flex items-center justify-between">
      <div>
        <h3 className="text-base font-semibold text-gray-900">Customize your domain</h3>
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
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Manage
      </button>
    </div>
  );
};

export default CustomizeDomainCard;

