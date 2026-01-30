import React, { useState } from 'react';
import { CreditCardIcon, PlusIcon } from '@heroicons/react/24/outline';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';

const PaymentsSettingsPage: React.FC = () => {
  const [captureMethod, setCaptureMethod] = useState('auto_checkout');
  const [giftCardExpiration, setGiftCardExpiration] = useState<'never' | 'expires'>('never');

  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-xl font-medium text-gray-900 mb-4">Payments</h1>

        {/* Payment providers */}
        <div className="border border-gray-200 bg-white p-4 mb-4">
          <h2 className="text-base font-medium text-gray-900 mb-1">Payment providers</h2>
          <p className="text-xs text-gray-600 mb-3">
            Providers that enable you to accept payment methods at a rate set by the third-party. An
            additional fee will apply to new orders once you{' '}
            <a href="#" className="text-gray-700 hover:underline">
              select a plan
            </a>
            .
          </p>
          <button className="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
            Choose a provider
          </button>
        </div>

        {/* Supported payment methods */}
        <div className="border border-gray-200 bg-white p-4 mb-4">
          <h2 className="text-base font-medium text-gray-900 mb-1">Supported payment methods</h2>
          <p className="text-xs text-gray-600 mb-3">
            Payment methods that are available with one of Ziplofy's approved payment providers
          </p>

          <div className="border border-gray-200 p-3 flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-white border border-gray-200 flex items-center justify-center">
                <CreditCardIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">PayPal</p>
                <p className="text-xs text-gray-600">
                  Transaction fees vary by plan • Processing fees set by PayPal
                </p>
              </div>
            </div>
            <button className="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
              Activate PayPal
            </button>
          </div>
          <button className="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
            <PlusIcon className="w-4 h-4" />
            Add payment method
          </button>
        </div>

        {/* Payment capture method */}
        <div className="border border-gray-200 bg-white p-4 mb-4">
          <h2 className="text-base font-medium text-gray-900 mb-1">Payment capture method</h2>
          <p className="text-xs text-gray-600 mb-3">
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
                className="w-4 h-4 text-gray-900 focus:ring-gray-400 mt-0.5"
              />
              <div>
                <p className="text-sm text-gray-900">Automatically at checkout</p>
                <p className="text-xs text-gray-600">
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
                className="w-4 h-4 text-gray-900 focus:ring-gray-400 mt-0.5"
              />
              <div>
                <p className="text-sm text-gray-900">
                  Automatically when the entire order is fulfilled
                </p>
                <p className="text-xs text-gray-600">
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
                className="w-4 h-4 text-gray-900 focus:ring-gray-400 mt-0.5"
              />
              <div>
                <p className="text-sm text-gray-900">Manually</p>
                <p className="text-xs text-gray-600">
                  Authorize payment at checkout and capture manually
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Manual payment methods */}
        <div className="border border-gray-200 bg-white p-4 mb-4">
          <h2 className="text-base font-medium text-gray-900 mb-1">Manual payment methods</h2>
          <p className="text-xs text-gray-600 mb-3">
            Payments made outside your online store. Orders paid manually must be approved before being
            fulfilled.
          </p>
          <button className="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
            <PlusIcon className="w-4 h-4" />
            Manual payment method
          </button>
        </div>

        {/* Payment method customizations */}
        <div className="border border-gray-200 bg-white p-4 mb-4">
          <h2 className="text-base font-medium text-gray-900 mb-1">Payment method customizations</h2>
          <p className="text-xs text-gray-600 mb-3">
            Control how payment methods appear to your customers at checkout
          </p>
          <button className="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
            View payment method customization apps
          </button>
        </div>

        {/* Gift card expiration */}
        <div className="border border-gray-200 bg-white p-4 mb-4">
          <h2 className="text-base font-medium text-gray-900 mb-3">Gift card expiration</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="giftCardExpiration"
                value="never"
                checked={giftCardExpiration === 'never'}
                onChange={(e) => setGiftCardExpiration(e.target.value as 'never' | 'expires')}
                className="w-4 h-4 text-gray-900 focus:ring-gray-400"
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
                className="w-4 h-4 text-gray-900 focus:ring-gray-400"
              />
              <span className="text-sm text-gray-900">Gift cards expire</span>
            </label>
          </div>
        </div>

        {/* Apple Wallet passes */}
        <div className="border border-gray-200 bg-white p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-medium text-gray-900 mb-1">Apple Wallet passes</h2>
              <p className="text-xs text-gray-600 max-w-[540px]">
                Give customers a digital Apple Wallet pass to use online or in your retail stores
              </p>
            </div>
            <button className="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
              Customize
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-gray-600 mt-4">
          Learn more about payments
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default PaymentsSettingsPage;
