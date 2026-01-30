import React, { useState } from 'react';
import {
  LockClosedIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
import Modal from '../../components/Modal';

const CustomerPrivacyPage: React.FC = () => {
  const navigate = useNavigate();
  const [networkIntelligenceEnabled, setNetworkIntelligenceEnabled] = useState(true);
  const [disableModalOpen, setDisableModalOpen] = useState(false);

  const handleOpenDisableModal = () => {
    setDisableModalOpen(true);
  };

  const handleCloseDisableModal = () => {
    setDisableModalOpen(false);
  };

  const handleTurnOffNetworkIntelligence = () => {
    setNetworkIntelligenceEnabled(false);
    setDisableModalOpen(false);
    // TODO: Implement API call to disable network intelligence
  };

  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <LockClosedIcon className="w-5 h-5 text-gray-900" />
          <h1 className="text-xl font-medium text-gray-900">Customer privacy</h1>
        </div>

        {/* Section 1: Privacy settings */}
        <div className="border border-gray-200 bg-white p-4 mb-4">
          <h2 className="text-base font-medium text-gray-900 mb-3">Privacy settings</h2>

          <button className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-50 transition-colors text-left mb-1">
            <div className="w-8 h-8 bg-gray-100 flex items-center justify-center shrink-0">
              <span className="text-sm font-medium text-gray-900">P</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Privacy policy</p>
              <p className="text-xs text-gray-600">Published on your online store</p>
            </div>
            <div className="flex items-center gap-1 mr-1">
              <div className="w-2 h-2 bg-gray-600 rounded-full" />
              <span className="text-xs text-gray-600">Automated</span>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
          </button>

          <hr className="my-2 border-gray-200" />

          <button className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-50 transition-colors text-left mb-1">
            <div className="w-8 h-8 bg-gray-100 flex items-center justify-center shrink-0">
              <span className="text-sm font-medium text-gray-900">C</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Cookie banner</p>
              <p className="text-xs text-gray-600">Not required for regions you're selling in</p>
            </div>
            <div className="flex items-center gap-1 mr-1">
              <div className="w-2 h-2 bg-gray-600 rounded-full" />
              <span className="text-xs text-gray-600">Automated</span>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
          </button>

          <hr className="my-2 border-gray-200" />

          <button
            onClick={() => navigate('/settings/customer-privacy/dns')}
            className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-50 transition-colors text-left"
          >
            <ArrowPathIcon className="w-5 h-5 text-gray-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">Data sharing opt out page</p>
              <p className="text-xs text-gray-600">Not required for regions you're selling in</p>
            </div>
            <div className="flex items-center gap-1 mr-1">
              <div className="w-2 h-2 bg-gray-600 rounded-full" />
              <span className="text-xs text-gray-600">Automated</span>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Section 2: Ziplofy Network Intelligence */}
        <div className="border border-gray-200 bg-white p-4 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-gray-900" />
              <h2 className="text-base font-medium text-gray-900">Ziplofy Network Intelligence</h2>
            </div>
            {networkIntelligenceEnabled && (
              <button
                onClick={handleOpenDisableModal}
                className="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Disable
              </button>
            )}
          </div>

          {networkIntelligenceEnabled && (
            <div className="flex items-center gap-1 mb-3">
              <div className="w-2 h-2 bg-gray-600 rounded-full" />
              <span className="text-xs text-gray-600">Enabled</span>
            </div>
          )}

          <p className="text-xs text-gray-600 leading-relaxed">
            Your customer data is securely used with other Ziplofy data to improve products, ad targeting, and
            personalization for your store as described in the{' '}
            <a href="#" className="text-gray-700 hover:underline">
              Additional Services Terms
            </a>
            . No other merchant can see your data.
          </p>
        </div>

        {/* Section 3: Marketing settings */}
        <div className="border border-gray-200 bg-white p-4 mb-4">
          <div className="flex items-center gap-1 mb-3">
            <h2 className="text-base font-medium text-gray-900">Marketing settings</h2>
            <button className="p-0.5 text-gray-600 hover:text-gray-700">
              <InformationCircleIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => navigate('/settings/checkout')}
            className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-50 transition-colors text-left mb-1"
          >
            <EnvelopeIcon className="w-5 h-5 text-gray-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">E-mail and SMS marketing in checkout</p>
              <p className="text-xs text-gray-600">Ask your customers for their marketing preferences</p>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
          </button>

          <hr className="my-2 border-gray-200" />

          <button
            onClick={() => navigate('/settings/notifications')}
            className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-50 transition-colors text-left"
          >
            <CheckCircleIcon className="w-5 h-5 text-gray-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">Double opt-in for marketing</p>
              <p className="text-xs text-gray-600">Ask your customers to confirm their contact details</p>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Section 4: Data storage hosting location */}
        <div className="border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-1 mb-3">
            <h2 className="text-base font-medium text-gray-900">Data storage hosting location</h2>
            <button className="p-0.5 text-gray-600 hover:text-gray-700">
              <InformationCircleIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl">🇺🇸</span>
            <p className="text-sm text-gray-900">United States</p>
          </div>
        </div>

        {/* Disable Network Intelligence Modal */}
        <Modal
          open={disableModalOpen}
          onClose={handleCloseDisableModal}
          title="Turn off Ziplofy Network Intelligence"
          maxWidth="sm"
          actions={
            <>
              <button
                onClick={handleCloseDisableModal}
                className="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTurnOffNetworkIntelligence}
                className="px-3 py-1.5 text-sm text-white bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                Turn off
              </button>
            </>
          }
        >
          <p className="text-xs text-gray-600 leading-relaxed">
            This means your customer data is no longer securely used with other Ziplofy data to improve products.
            This restricts your access or ability to customize all apps and features that require this data.
          </p>
        </Modal>
      </div>
    </GridBackgroundWrapper>
  );
};

export default CustomerPrivacyPage;
