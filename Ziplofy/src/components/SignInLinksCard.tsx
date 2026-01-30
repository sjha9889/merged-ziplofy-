import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import ToggleSwitch from './ToggleSwitch';

interface SignInLinksCardProps {
  showSignInLinks: boolean;
  onShowSignInLinksChange: (checked: boolean) => void;
  accountVersion: 'recommended' | 'legacy';
  onAccountVersionChange: (value: 'recommended' | 'legacy') => void;
  isControlsDisabled: boolean;
}

const SignInLinksCard: React.FC<SignInLinksCardProps> = ({
  showSignInLinks,
  onShowSignInLinksChange,
  accountVersion,
  onAccountVersionChange,
  isControlsDisabled,
}) => {
  return (
    <div className="border border-gray-200 bg-white/95 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-sm font-medium text-gray-900">Sign-in links</h2>
            <div className="group relative">
              <InformationCircleIcon className="w-4 h-4 text-gray-500 cursor-help" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-10 w-64 p-2 bg-gray-900 text-white text-xs border border-gray-200">
                Show sign-in links in the header of online store and at checkout
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            Show sign-in links in the header of online store and at checkout
          </p>
        </div>
        <ToggleSwitch
          checked={showSignInLinks}
          onChange={onShowSignInLinksChange}
          disabled={isControlsDisabled}
        />
      </div>

      {showSignInLinks ? (
        <>
          <div className="bg-gray-50 border border-gray-200 p-3 mb-4 flex items-start gap-2">
            <InformationCircleIcon className="w-4 h-4 shrink-0 mt-0.5 text-gray-600" />
            <p className="text-xs text-gray-600">
              Customers are required to sign in before checking out. To change this, go to{' '}
              <button className="text-gray-700 font-medium cursor-pointer hover:underline">
                checkout settings
              </button>
              .
            </p>
          </div>

          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Choose which version of customer accounts to link to
          </h3>

          <div className="flex flex-col md:flex-row gap-3">
            <div
              onClick={() => !isControlsDisabled && onAccountVersionChange('recommended')}
              className={`flex-1 p-3 border transition-all cursor-pointer flex items-start gap-3 ${
                accountVersion === 'recommended'
                  ? 'border-gray-900'
                  : 'border-gray-200'
              } ${isControlsDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300'}`}
            >
              <div className="mt-0.5">
                <input
                  type="radio"
                  value="recommended"
                  checked={accountVersion === 'recommended'}
                  onChange={() => onAccountVersionChange('recommended')}
                  disabled={isControlsDisabled}
                  className="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-400 focus:ring-1"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-gray-900">Customer accounts</h4>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Customers sign in with a one-time code sent to their email (no passwords)
                </p>
              </div>
            </div>

            <div
              onClick={() => !isControlsDisabled && onAccountVersionChange('legacy')}
              className={`flex-1 p-3 border transition-all cursor-pointer flex items-start gap-3 ${
                accountVersion === 'legacy'
                  ? 'border-gray-900'
                  : 'border-gray-200'
              } ${isControlsDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300'}`}
            >
              <div className="mt-0.5">
                <input
                  type="radio"
                  value="legacy"
                  checked={accountVersion === 'legacy'}
                  onChange={() => onAccountVersionChange('legacy')}
                  disabled={isControlsDisabled}
                  className="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-400 focus:ring-1"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 mb-1">Legacy</h4>
                <p className="text-xs text-gray-600">
                  Customers create an account and sign in with email and password
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-xs text-gray-600 mt-2">
          Both versions are still accessible by URL
        </p>
      )}
    </div>
  );
};

export default SignInLinksCard;

