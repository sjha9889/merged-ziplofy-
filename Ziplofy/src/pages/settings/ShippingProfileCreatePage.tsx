import React, { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
import { useShippingProfiles } from '../../contexts/shipping-profile.context';
import { useStore } from '../../contexts/store.context';

const ShippingProfileCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { activeStoreId } = useStore();
  const { createShippingProfile, loading } = useShippingProfiles();

  const [profileName, setProfileName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    navigate('/settings/shipping-and-delivery');
  };

  const handleSave = async () => {
    if (!activeStoreId) {
      setError('Please select a store.');
      return;
    }

    if (!profileName.trim()) {
      setError('Profile name is required.');
      return;
    }

    try {
      setError(null);
      await createShippingProfile({
        profileName: profileName.trim(),
        storeId: activeStoreId,
      });

      navigate('/settings/shipping-and-delivery');
    } catch (err: any) {
      setError(err.message || 'Failed to create shipping profile');
    }
  };

  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-medium text-gray-900">
              Create shipping profile
            </h1>
          </div>
          <button
            onClick={handleSave}
            disabled={!profileName.trim() || loading}
            className="px-3 py-1.5 text-sm font-medium border border-gray-200 text-gray-700 min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>

        {/* Form Section */}
        <div className="border border-gray-200 bg-white/95 p-4 max-w-2xl">
          <h2 className="text-sm font-medium text-gray-900 mb-1">
            Profile name
          </h2>
          <p className="text-xs text-gray-600 mb-3">
            Customers won't see this
          </p>
          <input
            type="text"
            placeholder="Fragile products"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm"
          />
          {error && (
            <p className="text-xs text-red-600 mt-2">
              {error}
            </p>
          )}
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default ShippingProfileCreatePage;
