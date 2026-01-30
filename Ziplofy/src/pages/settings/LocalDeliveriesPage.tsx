import {
  ArrowLeftIcon,
  ChevronRightIcon,
  TruckIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
import { useLocalDeliveryLocationEntries } from '../../contexts/local-delivery-location-entries.context';

const LocalDeliveriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { localDeliveryId } = useParams<{ localDeliveryId?: string }>();
  const {
    entries,
    fetchEntriesByLocalDeliveryId,
    loading: entriesLoading,
  } = useLocalDeliveryLocationEntries();

  useEffect(() => {
    if (localDeliveryId) {
      fetchEntriesByLocalDeliveryId(localDeliveryId);
    }
  }, [localDeliveryId, fetchEntriesByLocalDeliveryId]);

  const combinedEntries = entries;
  const missingLocalDeliveryId = !localDeliveryId;
  const isLoading = entriesLoading && !missingLocalDeliveryId;

  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Back Button and Header */}
        <div className="flex items-center gap-3 mb-3 border-b border-gray-200 pb-4">
          <button
            onClick={() => navigate('/settings/shipping-and-delivery')}
            className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <TruckIcon className="w-5 h-5 text-gray-700" />
          <ChevronRightIcon className="w-4 h-4 text-gray-500" />
          <h1 className="text-xl font-medium text-gray-900">
            Local delivery
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-gray-600 mb-4">
          Deliver orders to customers directly from your locations
        </p>

        {/* Your locations card */}
        <div className="border border-gray-200 bg-white/95 p-4">
          <h2 className="text-sm font-medium text-gray-900 mb-3">
            Your locations
          </h2>

          {missingLocalDeliveryId ? (
            <p className="text-sm text-gray-600 py-3">
              Local delivery identifier missing. Please navigate via the Manage button.
            </p>
          ) : isLoading ? (
            <div className="py-8 text-center">
              <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            </div>
          ) : combinedEntries.length === 0 ? (
            <p className="text-sm text-gray-600 py-3">
              No locations found.
            </p>
          ) : (
            <div className="space-y-2">
              {combinedEntries.map((entry, index) => {
                const location =
                  typeof entry.locationId === 'string' || !entry.locationId
                    ? null
                    : entry.locationId;
                const locationId =
                  typeof entry.locationId === 'string' ? entry.locationId : entry.locationId?._id;
                if (!locationId) return null;
                return (
                  <div
                    key={locationId}
                    onClick={() => {
                      if (!localDeliveryId) return;
                      navigate(
                        `/settings/shipping-and-delivery/local_deliveries/${localDeliveryId}/locations/${locationId}`
                      );
                    }}
                    className={`flex items-center justify-between py-2 ${
                      index !== combinedEntries.length - 1 ? 'border-b border-gray-100' : ''
                    } cursor-pointer hover:bg-gray-50 transition-colors`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <MapPinIcon className="w-5 h-5 text-gray-600 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {location?.name || 'Unknown location'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {location?.countryRegion || 'No country specified'}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium ${
                        entry.canLocalDeliver
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {entry.canLocalDeliver ? 'Offers delivery' : "Doesn't offer delivery"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default LocalDeliveriesPage;

