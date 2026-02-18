import React, { useState } from 'react';
import { CreditCardIcon, PlusIcon } from '@heroicons/react/24/outline';

const PaymentsSettingsPage: React.FC = () => {
  const [captureMethod, setCaptureMethod] = useState('auto_checkout');
  const [giftCardExpiration, setGiftCardExpiration] = useState<'never' | 'expires'>('never');

  return (
    <div className="min-h-screen bg-page-background-color">
      <div className="max-w-[1400px] mx-auto py-6 px-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Payments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure payment providers, capture rules, and payment methods at checkout.
          </p>
        </header>

        {/* Payment providers */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 mb-6">
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
        </div>

        {/* Supported payment methods */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 mb-6">
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
        </div>

        {/* Payment capture method */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 mb-6">
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
        </div>

        {/* Manual payment methods */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Manual payment methods</h2>
          <p className="text-sm text-gray-500 mb-4">
            Payments made outside your online store. Orders paid manually must be approved before being
            fulfilled.
          </p>
          <button className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <PlusIcon className="w-4 h-4" />
            Manual payment method
          </button>
        </div>

        {/* Payment method customizations */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Payment method customizations</h2>
          <p className="text-sm text-gray-500 mb-4">
            Control how payment methods appear to your customers at checkout
          </p>
          <button className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            View payment method customization apps
          </button>
        </div>

        {/* Gift card expiration */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 mb-6">
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
        </div>

        {/* Apple Wallet passes */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 mb-6">
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
        </div>

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
