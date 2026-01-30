import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import AddPixelModal from '../../components/AddPixelModal';
import CustomerEventsHeader from '../../components/CustomerEventsHeader';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
import PixelsTable from '../../components/PixelsTable';
import Tabs from '../../components/Tabs';
import { DataSaleOption, Pixel, usePixels } from '../../contexts/pixel.context';
import { useStore } from '../../contexts/store.context';

const MAX_NAME = 30;
const DEFAULT_CODE = `// Step 1. Initialize the JavaScript pixel SDK (make sure to exclude HTML)

// Step 2. Subscribe to customer events with analytics.subscribe(), and add tracking
// analytics.subscribe("all_standard_events", function (event) {
//   console.log("Event data ", event?.data);
// });`;

type TabValue = 'all' | 'app' | 'custom';

const statusLabelMap: Record<string, string> = {
  inactive: 'Disconnected',
  disconnected: 'Disconnected',
  active: 'Connected',
};

const CustomerEventsPage: React.FC = () => {
  const [addOpen, setAddOpen] = useState(false);
  const [pixelName, setPixelName] = useState('');
  const [dataSale, setDataSale] = useState<DataSaleOption>('does_not_qualify_as_data_sale');
  const [code, setCode] = useState(DEFAULT_CODE);
  const [tab, setTab] = useState<TabValue>('all');

  const { activeStoreId } = useStore();
  const { pixels, create, fetchByStoreId, loading } = usePixels();
  const navigate = useNavigate();

  useEffect(() => {
    if (activeStoreId) {
      fetchByStoreId(activeStoreId).catch((err) => {
        toast.error(err?.message || 'Failed to fetch pixels');
      });
    }
  }, [activeStoreId, fetchByStoreId]);

  const isValid = useMemo(
    () => pixelName.trim().length > 0 && pixelName.length <= MAX_NAME,
    [pixelName]
  );

  const filteredPixels = useMemo(() => {
    if (tab === 'app') return [];
    if (tab === 'custom') return pixels.filter((p) => p.type.toLowerCase() === 'custom');
    return pixels;
  }, [pixels, tab]);

  const hasPixels = filteredPixels.length > 0;

  const handleClose = useCallback(() => {
    setAddOpen(false);
    setPixelName('');
    setDataSale('does_not_qualify_as_data_sale');
    setCode(DEFAULT_CODE);
  }, []);

  const handleCreate = useCallback(async () => {
    if (!isValid) return;
    if (!activeStoreId) {
      toast.error('Select a store before creating a pixel');
      return;
    }
    try {
      await create({
        storeId: activeStoreId,
        pixelName: pixelName.trim(),
        type: 'custom',
        status: 'inactive',
        required: false,
        notRequired: true,
        marketing: false,
        analytics: false,
        preferences: false,
        dataSale,
        code,
      });
      toast.success('Pixel created');
      handleClose();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create pixel');
    }
  }, [isValid, activeStoreId, pixelName, dataSale, code, create, handleClose]);

  const renderStatusChip = useCallback((pixel: Pixel) => {
    const label = statusLabelMap[pixel.status?.toLowerCase()] || pixel.status;
    return (
      <span className="px-2 py-0.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 capitalize">
        {label}
      </span>
    );
  }, []);

  const handleRefresh = useCallback(() => {
    if (activeStoreId) {
      fetchByStoreId(activeStoreId).catch((err) =>
        toast.error(err?.message || 'Failed to refresh pixels')
      );
    }
  }, [activeStoreId, fetchByStoreId]);

  const handleTabChange = useCallback((value: string) => {
    setTab(value as TabValue);
  }, []);

  const handleOpenModal = useCallback(() => {
    setAddOpen(true);
  }, []);

  const handleRowClick = useCallback((pixelId: string) => {
    navigate(`/settings/customer-events/${pixelId}`);
  }, [navigate]);

  const tabs = useMemo(() => [
    { id: 'all', label: 'All' },
    { id: 'app', label: 'App pixels' },
    { id: 'custom', label: 'Custom pixels' },
  ], []);

  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-xl font-medium text-gray-900 mb-4 border-b border-gray-200 pb-4">
          Customer events
        </h1>

        <div className="border border-gray-200 p-4 bg-white/95">
          <CustomerEventsHeader onOpenModal={handleOpenModal} />

          <div className="mt-4 border border-gray-200 bg-white/95">
            <div className="px-3 pt-3">
              <Tabs
                tabs={tabs}
                activeTab={tab}
                onTabChange={handleTabChange}
              />
            </div>

            <div className="h-px bg-gray-200" />

            <div className="px-3 py-2 flex justify-end gap-2">
              <button
                disabled
                className="p-1.5 text-gray-400 cursor-not-allowed"
              >
                <MagnifyingGlassIcon className="w-4 h-4" />
              </button>
              <button
                onClick={handleRefresh}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <ArrowPathIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="h-px bg-gray-200" />

            {loading ? (
              <div className="py-12 flex justify-center">
                <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : hasPixels ? (
              <PixelsTable
                pixels={filteredPixels}
                renderStatusChip={renderStatusChip}
                onRowClick={handleRowClick}
              />
            ) : (
              <div className="py-12 text-center text-gray-600">
                <p className="text-xs">No pixels found for this store.</p>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-600 mt-4">
            This list only shows{' '}
            <button className="text-gray-700 hover:underline">
              pixels
            </button>{' '}
            that use the applicable Shopify APIs, the supported pixel integration.
          </p>

          <button className="text-xs text-gray-700 mt-4 inline-flex items-center hover:underline">
            Learn more about pixels
          </button>
        </div>

        <AddPixelModal
          open={addOpen}
          onClose={handleClose}
          pixelName={pixelName}
          onPixelNameChange={setPixelName}
          dataSale={dataSale}
          onDataSaleChange={setDataSale}
          code={code}
          onCodeChange={setCode}
          isValid={isValid}
          loading={loading}
          onCreate={handleCreate}
          maxName={MAX_NAME}
        />
      </div>
    </GridBackgroundWrapper>
  );
};

export default CustomerEventsPage;
