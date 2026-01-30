import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { type ActivityEntry } from '../../components/ActivityLogEntry';
import ActivityLogList from '../../components/ActivityLogList';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';

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
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <button
            onClick={handleBack}
            className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-medium text-gray-900">
            Store activity log
          </h1>
        </div>

        <ActivityLogList entries={activityEntries} />
      </div>
    </GridBackgroundWrapper>
  );
};

export default StoreActivityLogPage;

