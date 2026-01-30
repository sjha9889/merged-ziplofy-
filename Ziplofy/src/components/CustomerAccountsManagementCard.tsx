import React from 'react';
import { ArrowRightIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import ToggleSwitch from './ToggleSwitch';

interface CustomerAccountsManagementCardProps {
  accountUrl: string;
  onNavigateToAuthentication: () => void;
  onNavigateToDomains: () => void;
  selfServeReturns: boolean;
  onSelfServeReturnsChange: (checked: boolean) => void;
  storeCredit: boolean;
  onStoreCreditChange: (checked: boolean) => void;
  isControlsDisabled: boolean;
}

const CustomerAccountsManagementCard: React.FC<CustomerAccountsManagementCardProps> = ({
  accountUrl,
  onNavigateToAuthentication,
  onNavigateToDomains,
  selfServeReturns,
  onSelfServeReturnsChange,
  storeCredit,
  onStoreCreditChange,
  isControlsDisabled,
}) => {
  return (
    <div className="border border-gray-200 bg-white/95 p-4">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-sm font-medium text-gray-900">Customer accounts</h2>
        <div className="group relative">
          <InformationCircleIcon className="w-4 h-4 text-gray-500 cursor-help" />
          <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-10 w-64 p-2 bg-gray-900 text-white text-xs border border-gray-200">
            Manage sign-in methods and account access
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Authentication</h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Manage sign-in methods and account access
            </p>
          </div>
          <button
            onClick={onNavigateToAuthentication}
            className="px-3 py-1.5 text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 self-start sm:self-center"
          >
            Manage
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="border-t border-gray-200" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Self-serve returns</h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Allow customers to request and manage returns. Customize what your customers can return with{' '}
              <button className="text-gray-700 hover:underline">
                return rules
              </button>
            </p>
          </div>
          <ToggleSwitch
            checked={selfServeReturns}
            onChange={onSelfServeReturnsChange}
            disabled={isControlsDisabled}
          />
        </div>

        <div className="border-t border-gray-200" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Store credit</h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Allow customers to see and spend store credit
            </p>
          </div>
          <ToggleSwitch
            checked={storeCredit}
            onChange={onStoreCreditChange}
            disabled={isControlsDisabled}
          />
        </div>

        <div className="border-t border-gray-200" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900">URL</h3>
            <p className="text-xs text-gray-600 mt-0.5 mb-2">
              Use this URL anywhere you'd like customers to access customer accounts
            </p>
            <input
              type="text"
              value={accountUrl || ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
            />
          </div>
          <button
            onClick={onNavigateToDomains}
            className="px-3 py-1.5 text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 self-start sm:self-center"
          >
            Manage
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerAccountsManagementCard;

