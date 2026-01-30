import React, { useState, useRef, useCallback } from 'react';
import {
  GlobeAltIcon,
  InformationCircleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';

const DomainsPage: React.FC = () => {
  const [connectMenuOpen, setConnectMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleConnectClick = useCallback(() => {
    setConnectMenuOpen(!connectMenuOpen);
  }, [connectMenuOpen]);

  const handleConnectClose = useCallback(() => {
    setConnectMenuOpen(false);
  }, []);

  // Mock data - replace with actual data fetching
  const domains = [
    {
      id: '1',
      domain: '00yj51-t0.ziplofy.com',
      type: 'Online Store',
      isPrimary: true,
      status: 'connected',
    },
  ];

  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2">
            <GlobeAltIcon className="w-5 h-5 text-gray-600" />
            <h1 className="text-xl font-medium text-gray-900">
              Domains
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                ref={menuButtonRef}
                onClick={handleConnectClick}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Connect existing
                <ChevronDownIcon className="w-4 h-4" />
              </button>
              {connectMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={handleConnectClose}
                  />
                  <div className="absolute right-0 mt-1 w-48 border border-gray-200 bg-white shadow-sm z-20">
                    <button
                      onClick={handleConnectClose}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Connect domain
                    </button>
                    <button
                      onClick={handleConnectClose}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-200"
                    >
                      Transfer domain
                    </button>
                  </div>
                </>
              )}
            </div>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors">
              Buy new domain
            </button>
          </div>
        </div>

        {/* Information Alert */}
        <div className="mb-4 p-3 bg-white/95 border border-gray-200 flex items-start gap-2">
          <InformationCircleIcon className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600">
            Connect or buy a custom domain below and get a $20 USD subscription discount on your next bill.{' '}
            <button
              onClick={(e) => {
                e.preventDefault();
                // Handle terms click
              }}
              className="text-gray-700 hover:underline"
            >
              Terms apply
            </button>
            .
          </p>
        </div>

        {/* Change ziplofy.com domain section */}
        <div className="border border-gray-200 p-4 mb-4 bg-white/95">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <h2 className="text-sm font-medium text-gray-900 mb-1">
                Change to a new ziplofy.com domain
              </h2>
              <p className="text-xs text-gray-600 mb-3">
                Update your current Ziplofy subdomain for free to better match your brand. You can also buy or connect a custom domain.
              </p>
              <button className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-white transition-colors">
                Change ziplofy.com domain
              </button>
            </div>
            <div className="hidden md:flex items-center justify-center relative w-48 h-32">
              {/* Simplified illustration */}
              <div className="absolute w-24 h-20 border border-gray-200 bg-white flex items-center justify-center z-10">
                <GlobeAltIcon className="w-8 h-8 text-gray-500" />
              </div>
              <div className="absolute top-4 right-0 w-24 h-20 border border-gray-200 bg-gray-100 flex items-center justify-center z-0">
                <GlobeAltIcon className="w-7 h-7 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Domain List */}
        <div className="border border-gray-200 bg-white/95">
          <div className="px-3 py-2 border-b border-gray-200 bg-white/95">
            <div className="flex justify-between items-center">
              <p className="text-xs font-medium text-gray-700">
                Domain
              </p>
              <p className="text-xs font-medium text-gray-700">
                Status
              </p>
            </div>
          </div>
          <div className="p-2">
            {domains.map((domain) => (
              <div
                key={domain.id}
                className="flex justify-between items-center py-2 px-1 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <GlobeAltIcon className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-gray-900">
                    {domain.domain}
                  </p>
                  {domain.isPrimary && (
                    <span className="px-2 py-0.5 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200">
                      Primary
                    </span>
                  )}
                </div>
                <span className="px-2 py-0.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200">
                  {domain.status.charAt(0).toUpperCase() + domain.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default DomainsPage;
