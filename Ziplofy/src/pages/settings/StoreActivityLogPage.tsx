import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { type ActivityEntry } from '../../components/ActivityLogEntry';
import ActivityLogList from '../../components/ActivityLogList';

const activityEntries: ActivityEntry[] = [
  {
    id: '1',
    title: 'My Store Admin accessed shop',
    timestamp: 'November 17, 2025 at 11:17 AM GMT+5:30',
  },
  {
    id: '2',
    title: 'My Store Admin accessed shop',
    timestamp: 'November 17, 2025 at 10:32 AM GMT+5:30',
  },
  {
    id: '3',
    title: 'My Store Admin accessed shop',
    timestamp: 'November 14, 2025 at 5:28 PM GMT+5:30',
  },
  {
    id: '4',
    title: 'My Store Admin accessed shop',
    timestamp: 'November 14, 2025 at 2:46 PM GMT+5:30',
  },
  {
    id: '5',
    title: 'You included a product on Point of Sale',
    description: 't-shirt',
    timestamp: 'November 14, 2025 at 10:42 AM GMT+5:30',
    linkLabel: 't-shirt',
    linkHref: '#',
  },
  {
    id: '6',
    title: 'You included a product on Online Store',
    timestamp: 'November 14, 2025 at 10:42 AM GMT+5:30',
    linkLabel: 't-shirt',
    linkHref: '#',
  },
  {
    id: '7',
    title: 'You created a new product',
    timestamp: 'November 14, 2025 at 10:42 AM GMT+5:30',
    linkLabel: 't-shirt',
    linkHref: '#',
  },
  {
    id: '8',
    title: 'Theme was published',
    timestamp: 'November 14, 2025 at 10:40 AM GMT+5:30',
    linkLabel: 'Horizon',
    linkHref: '#',
  },
  {
    id: '9',
    title: 'My Store Admin accessed shop',
    timestamp: 'November 14, 2025 at 10:39 AM GMT+5:30',
  },
  {
    id: '10',
    title: 'Ziplofy added default retail role',
    timestamp: 'November 14, 2025 at 10:39 AM GMT+5:30',
    description: 'Associate',
  },
];

const StoreActivityLogPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate('/settings/general');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-page-background-color">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-6 py-6 px-4">
        <header className="flex items-start gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="mt-0.5 inline-flex items-center justify-center p-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            aria-label="Back to general settings"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Store activity log</h1>
            <p className="mt-1 text-sm text-gray-500">
              View recent activity and changes made to your store.
            </p>
          </div>
        </header>

        <ActivityLogList entries={activityEntries} />
      </div>
    </div>
  );
};

export default StoreActivityLogPage;

