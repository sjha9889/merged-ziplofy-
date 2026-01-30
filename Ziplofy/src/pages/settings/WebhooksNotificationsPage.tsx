import React, { useCallback } from 'react';
import {
  BellIcon,
  ChevronRightIcon,
  PlusIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';

const WebhooksNotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const webhookSigningKey = 'bfad2685eaa342b6584e1a4b12c0735e6cc8f4343cb8b10626cef0c4dd00064d';

  const handleBackClick = useCallback(() => {
    navigate('/settings/notifications');
  }, [navigate]);

  const handleCreateWebhook = useCallback(() => {
    // TODO: Implement create webhook flow
  }, []);

  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-4">
          <button
            onClick={handleBackClick}
            className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <BellIcon className="w-5 h-5" />
          </button>
          <ChevronRightIcon className="w-4 h-4 text-gray-500" />
          <h1 className="text-xl font-medium text-gray-900">
            Webhooks
          </h1>
        </div>

        <div className="border border-gray-200 p-4">
          <p className="text-sm text-gray-900 mb-4">
            Send XML or JSON notifications about store events to a URL
          </p>

          <button
            onClick={handleCreateWebhook}
            className="w-full flex items-center justify-start border border-gray-200 text-sm text-gray-700 py-2 px-3 mb-4 hover:bg-gray-50 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create webhook
          </button>

          <div className="p-3 bg-gray-50 flex items-center gap-2 border border-gray-200">
            <InformationCircleIcon className="w-4 h-4 text-gray-600 shrink-0" />
            <p className="text-xs text-gray-600">
              Your webhooks will be signed with{' '}
              <span className="text-gray-700 font-mono">
                {webhookSigningKey}
              </span>
            </p>
          </div>
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default WebhooksNotificationsPage;
