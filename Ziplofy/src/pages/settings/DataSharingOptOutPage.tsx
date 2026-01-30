import React, { useState, useRef } from 'react';
import {
  ArrowLeftIcon,
  LockClosedIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
import ToggleSwitch from '../../components/ToggleSwitch';

const DataSharingOptOutPage: React.FC = () => {
  const navigate = useNavigate();
  const [useAutomatedSettings, setUseAutomatedSettings] = useState(false);
  const [navigationMenu, setNavigationMenu] = useState('footer');
  const [moreActionsOpen, setMoreActionsOpen] = useState(false);
  const moreActionsRef = useRef<HTMLButtonElement>(null);

  const handleMoreActionsClick = () => {
    setMoreActionsOpen(!moreActionsOpen);
  };

  const handleMoreActionsClose = () => {
    setMoreActionsOpen(false);
  };

  const handleBack = () => {
    navigate('/settings/customer-privacy');
  };

  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={handleBack}
                className="p-1 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-medium text-gray-900">
                Data sharing opt-out page
              </h1>
            </div>
            <p className="text-xs text-gray-600 ml-7">
              Data sharing opt-out allows customers in specific regions to opt out of data sharing.
            </p>
          </div>
          <div className="relative">
            <button
              ref={moreActionsRef}
              onClick={handleMoreActionsClick}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              More actions
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            {moreActionsOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={handleMoreActionsClose}
                />
                <div className="absolute right-0 mt-1 w-48 border border-gray-200 bg-white shadow-sm z-20">
                  <button
                    onClick={handleMoreActionsClose}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Option 1
                  </button>
                  <button
                    onClick={handleMoreActionsClose}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-200"
                  >
                    Option 2
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Regions and content section */}
        <div className="border border-gray-200 p-3 mb-3 bg-white/95">
          <h2 className="text-sm font-medium text-gray-900 mb-3">
            Regions and content
          </h2>

          {/* Use automated settings */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-0.5">
                Use automated settings
              </p>
              <p className="text-xs text-gray-600">
                Keep regions and content in sync with latest Ziplofy recommendations
              </p>
            </div>
            <ToggleSwitch
              checked={useAutomatedSettings}
              onChange={setUseAutomatedSettings}
            />
          </div>

          {/* Regions - Only visible when automated settings is OFF */}
          {!useAutomatedSettings && (
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-0.5">
                  Regions
                </p>
                <p className="text-xs text-gray-600">
                  Not active in any region
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Handle edit regions
                }}
                className="text-xs font-medium text-gray-700 hover:underline"
              >
                Edit
              </button>
            </div>
          )}

          {/* Content - Only visible when automated settings is OFF */}
          {!useAutomatedSettings && (
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-0.5">
                  Content
                </p>
                <p className="text-xs text-gray-600">
                  Customize default page content
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Handle edit content
                }}
                className="text-xs font-medium text-gray-700 hover:underline"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Navigation section */}
        <div className="border border-gray-200 p-3 mb-3 bg-white/95">
          <h2 className="text-sm font-medium text-gray-900 mb-2">
            Navigation
          </h2>

          <p className="text-xs text-gray-600 mb-3">
            Link to the page from your store menu, so that your visitors can easily access it.
          </p>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Menu</label>
            <select
              value={navigationMenu}
              onChange={(e) => setNavigationMenu(e.target.value)}
              className="w-full px-2.5 py-1.5 text-sm text-gray-900 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
            >
              <option value="main">Main menu</option>
              <option value="footer">Footer menu (recommended)</option>
              <option value="customer-account">Customer account main menu</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-600 text-center mt-4">
          Recommended privacy settings are for your convenience. Compliance with laws and regulations is your
          responsibility.{' '}
          <button
            onClick={(e) => {
              e.preventDefault();
              // TODO: Handle learn more
            }}
            className="text-gray-700 hover:underline"
          >
            Learn more
          </button>
        </p>
      </div>
    </GridBackgroundWrapper>
  );
};

export default DataSharingOptOutPage;

