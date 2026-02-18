import React, { useCallback } from 'react';
import {
  BellIcon,
  ChevronRightIcon,
  PlusIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-page-background-color">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-6 py-6 px-4">
        <header className="flex items-start gap-3">
          <button
            type="button"
            onClick={handleBackClick}
            className="mt-0.5 inline-flex items-center justify-center p-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            aria-label="Back to notifications"
          >
            <BellIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Webhooks</h1>
            <p className="mt-1 text-sm text-gray-500">
              Send XML or JSON notifications about store events to a URL.
            </p>
          </div>
        </header>

        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 mb-6">
          <button
            type="button"
            onClick={handleCreateWebhook}
            className="w-full flex items-center justify-start rounded-lg border border-gray-200 text-sm font-medium text-gray-700 py-2.5 px-3 mb-4 hover:bg-gray-50 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create webhook
          </button>

          <div className="p-3 rounded-lg bg-gray-50 flex items-center gap-2 border border-gray-200">
            <InformationCircleIcon className="w-4 h-4 text-gray-600 shrink-0" />
            <p className="text-sm text-gray-500">
              Your webhooks will be signed with{' '}
              <span className="text-gray-700 font-mono">
                {webhookSigningKey}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebhooksNotificationsPage;
