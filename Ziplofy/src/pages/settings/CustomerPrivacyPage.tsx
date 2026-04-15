import React, { useState } from 'react';
import {
  ArrowPathIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/Modal';
import { SettingsHero } from '../../components/settings/SettingsPageScaffold';

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
    <div className="w-full">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-6">
        <SettingsHero
          title="Customer privacy"
          description="Manage privacy policy, cookie banner, data sharing, and marketing consent settings."
        />

        {/* Section 1: Privacy settings */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Privacy settings</h2>

          <button type="button" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left mb-1">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <span className="text-sm font-medium text-gray-900">P</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Privacy policy</p>
              <p className="text-sm text-gray-500">Published on your online store</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-2 h-2 bg-gray-500 rounded-full" />
              <span className="text-xs text-gray-500">Automated</span>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
          </button>

          <hr className="my-2 border-gray-200" />

          <button type="button" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left mb-1">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <span className="text-sm font-medium text-gray-900">C</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Cookie banner</p>
              <p className="text-sm text-gray-500">Not required for regions you're selling in</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-2 h-2 bg-gray-500 rounded-full" />
              <span className="text-xs text-gray-500">Automated</span>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
          </button>

          <hr className="my-2 border-gray-200" />

          <button
            type="button"
            onClick={() => navigate('/settings/customer-privacy/dns')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <ArrowPathIcon className="w-5 h-5 text-gray-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Data sharing opt out page</p>
              <p className="text-sm text-gray-500">Not required for regions you're selling in</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-2 h-2 bg-gray-500 rounded-full" />
              <span className="text-xs text-gray-500">Automated</span>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Section 2: Ziplofy Network Intelligence */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 mb-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-gray-900" />
              <h2 className="text-base font-semibold text-gray-900">Ziplofy Network Intelligence</h2>
            </div>
            {networkIntelligenceEnabled && (
              <button
                type="button"
                onClick={handleOpenDisableModal}
                className="rounded-lg px-4 py-2 text-sm font-medium border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Disable
              </button>
            )}
          </div>

          {networkIntelligenceEnabled && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-2 h-2 bg-gray-500 rounded-full" />
              <span className="text-sm text-gray-500">Enabled</span>
            </div>
          )}

          <p className="text-sm text-gray-500 leading-relaxed">
            Your customer data is securely used with other Ziplofy data to improve products, ad targeting, and
            personalization for your store as described in the{' '}
            <a href="#" className="text-gray-700 font-medium hover:underline">
              Additional Services Terms
            </a>
            . No other merchant can see your data.
          </p>
        </div>

        {/* Section 3: Marketing settings */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-base font-semibold text-gray-900">Marketing settings</h2>
            <button type="button" className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50">
              <InformationCircleIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate('/settings/checkout')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left mb-1"
          >
            <EnvelopeIcon className="w-5 h-5 text-gray-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">E-mail and SMS marketing in checkout</p>
              <p className="text-sm text-gray-500">Ask your customers for their marketing preferences</p>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
          </button>

          <hr className="my-2 border-gray-200" />

          <button
            type="button"
            onClick={() => navigate('/settings/notifications')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <CheckCircleIcon className="w-5 h-5 text-gray-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Double opt-in for marketing</p>
              <p className="text-sm text-gray-500">Ask your customers to confirm their contact details</p>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Section 4: Data storage hosting location */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-base font-semibold text-gray-900">Data storage hosting location</h2>
            <button type="button" className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50">
              <InformationCircleIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl">🇺🇸</span>
            <p className="text-sm font-medium text-gray-900">United States</p>
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
                type="button"
                onClick={handleCloseDisableModal}
                className="rounded-lg px-4 py-2 text-sm font-medium border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTurnOffNetworkIntelligence}
                className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Turn off
              </button>
            </>
          }
        >
          <p className="text-sm text-gray-500 leading-relaxed">
            This means your customer data is no longer securely used with other Ziplofy data to improve products.
            This restricts your access or ability to customize all apps and features that require this data.
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default CustomerPrivacyPage;
