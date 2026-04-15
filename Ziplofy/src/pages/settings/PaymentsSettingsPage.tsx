import React, { useState } from 'react';
import { CreditCardIcon, PlusIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { SettingsHero, SettingsPanel } from '../../components/settings/SettingsPageScaffold';

const PaymentsSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [captureMethod, setCaptureMethod] = useState('auto_checkout');
  const [giftCardExpiration, setGiftCardExpiration] = useState<'never' | 'expires'>('never');

  return (
    <div className="w-full">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-6">
        <SettingsHero
          title="Payments"
          description="Configure payment providers, capture rules, and payment methods at checkout."
        />

        {/* Manual payment transactions */}
        <SettingsPanel className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-1">Transactions</h2>
              <p className="text-sm text-gray-500 max-w-xl">
                View manual payment confirmations (UPI, reference IDs) submitted for your store from
                checkout.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/settings/payments/transactions')}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors shrink-0"
            >
              View transactions
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </SettingsPanel>

        {/* Payment providers */}
        <SettingsPanel className="p-5 sm:p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Payment providers</h2>
          <p className="text-sm text-gray-500 mb-4">
            Providers that enable you to accept payment methods at a rate set by the third-party. An
            additional fee will apply to new orders once you{' '}
            <a href="#" className="text-gray-700 hover:underline">
              select a plan
            </a>
            .
          </p>
          <button className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            Choose a provider
          </button>
        </SettingsPanel>

        {/* Supported payment methods */}
        <SettingsPanel className="p-5 sm:p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Supported payment methods</h2>
          <p className="text-sm text-gray-500 mb-4">
            Payment methods that are available with one of Ziplofy's approved payment providers
          </p>

          <div className="rounded-lg border border-gray-200 p-4 flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                <CreditCardIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">PayPal</p>
                <p className="text-sm text-gray-500">
                  Transaction fees vary by plan • Processing fees set by PayPal
                </p>
              </div>
            </div>
            <button className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors shrink-0">
              Activate PayPal
            </button>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <PlusIcon className="w-4 h-4" />
            Add payment method
          </button>
        </SettingsPanel>

        {/* Payment capture method */}
        <SettingsPanel className="p-5 sm:p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Payment capture method</h2>
          <p className="text-sm text-gray-500 mb-4">
            Payments are authorized when an order is placed. Select how to{' '}
            <a href="#" className="text-gray-700 hover:underline">
              capture payments
            </a>
            :
          </p>

          <div className="space-y-3">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="radio"
                name="captureMethod"
                value="auto_checkout"
                checked={captureMethod === 'auto_checkout'}
                onChange={(e) => setCaptureMethod(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500/30 mt-0.5"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">Automatically at checkout</p>
                <p className="text-sm text-gray-500">
                  Capture payment when an order is placed
                </p>
              </div>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="radio"
                name="captureMethod"
                value="auto_fulfilled"
                checked={captureMethod === 'auto_fulfilled'}
                onChange={(e) => setCaptureMethod(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500/30 mt-0.5"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Automatically when the entire order is fulfilled
                </p>
                <p className="text-sm text-gray-500">
                  Authorize payment at checkout and capture once the entire order is fulfilled
                </p>
              </div>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="radio"
                name="captureMethod"
                value="manual"
                checked={captureMethod === 'manual'}
                onChange={(e) => setCaptureMethod(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500/30 mt-0.5"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">Manually</p>
                <p className="text-sm text-gray-500">
                  Authorize payment at checkout and capture manually
                </p>
              </div>
            </label>
          </div>
        </SettingsPanel>

        {/* Manual payment methods */}
        <SettingsPanel className="p-5 sm:p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Manual payment methods</h2>
          <p className="text-sm text-gray-500 mb-4">
            Payments made outside your online store. Orders paid manually must be approved before being
            fulfilled.
          </p>
          <button className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <PlusIcon className="w-4 h-4" />
            Manual payment method
          </button>
        </SettingsPanel>

        {/* Payment method customizations */}
        <SettingsPanel className="p-5 sm:p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Payment method customizations</h2>
          <p className="text-sm text-gray-500 mb-4">
            Control how payment methods appear to your customers at checkout
          </p>
          <button className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            View payment method customization apps
          </button>
        </SettingsPanel>

        {/* Gift card expiration */}
        <SettingsPanel className="p-5 sm:p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Gift card expiration</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="giftCardExpiration"
                value="never"
                checked={giftCardExpiration === 'never'}
                onChange={(e) => setGiftCardExpiration(e.target.value as 'never' | 'expires')}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500/30"
              />
              <span className="text-sm text-gray-900">Gift cards never expire</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="giftCardExpiration"
                value="expires"
                checked={giftCardExpiration === 'expires'}
                onChange={(e) => setGiftCardExpiration(e.target.value as 'never' | 'expires')}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500/30"
              />
              <span className="text-sm text-gray-900">Gift cards expire</span>
            </label>
          </div>
        </SettingsPanel>

        {/* Apple Wallet passes */}
        <SettingsPanel className="p-5 sm:p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-1">Apple Wallet passes</h2>
              <p className="text-sm text-gray-500 max-w-[540px]">
                Give customers a digital Apple Wallet pass to use online or in your retail stores
              </p>
            </div>
            <button className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              Customize
            </button>
          </div>
        </SettingsPanel>

        <div className="text-center text-sm text-gray-500 mt-2">
          <button type="button" className="text-gray-700 font-medium hover:underline">
            Learn more about payments
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentsSettingsPage;
