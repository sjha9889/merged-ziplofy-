import React, { useCallback } from 'react';

export interface SetupStep {
  id: string;
  title: string;
  description?: string;
  buttonText: string;
  buttonVariant?: 'primary' | 'added';
  onClick?: () => void;
}

interface GettingStartedCardProps {
  steps?: SetupStep[];
  onStepClick?: (stepId: string) => void;
  onTestOrderClick?: () => void;
}

const GettingStartedCard: React.FC<GettingStartedCardProps> = ({
  steps = [
    {
      id: 'theme',
      title: 'Make your store stand out with the right theme',
      buttonText: 'Configure Theme',
      buttonVariant: 'primary',
    },
    {
      id: 'domain',
      title: 'Set your own domain for your store',
      description: 'Added Domain: fashion-0-60058040737.ziplofy.com',
      buttonText: 'Add Domain',
      buttonVariant: 'primary',
    },
    {
      id: 'items',
      title: "Add all the items that you'll be selling on your store",
      buttonText: 'Add Itmes',
      buttonVariant: 'primary',
    },
    {
      id: 'shipping',
      title: 'Set up shipping zones to deliver your items efficiently',
      buttonText: 'Added',
      buttonVariant: 'added',
    },
    {
      id: 'payment',
      title: 'Connect payment gateways to start accepting online payments',
      buttonText: 'Configure Online Payments',
      buttonVariant: 'primary',
    },
  ],
  onStepClick,
  onTestOrderClick,
}) => {
  const handleStepClick = useCallback(
    (stepId: string) => {
      if (onStepClick) {
        onStepClick(stepId);
      } else {
        console.log('Step clicked:', stepId);
      }
    },
    [onStepClick]
  );

  const handleTestOrderClick = useCallback(() => {
    if (onTestOrderClick) {
      onTestOrderClick();
    } else {
      console.log('Test order clicked');
    }
  }, [onTestOrderClick]);

  return (
    <div className='bg-white rounded-lg p-4 border border-gray-200'>
      {/* Main Title */}
      <div className="text-center mb-3">
        <h2 className="text-base font-medium text-gray-900">
          Complete these few steps to launch your store
        </h2>
      </div>

      {/* Setup Steps */}
      <div className="space-y-2 mb-3">
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 mb-0.5">{step.title}</p>
              {step.description && (
                <p className="text-xs text-gray-500 truncate">{step.description}</p>
              )}
            </div>
            <button
              onClick={() => handleStepClick(step.id)}
              className={`ml-3 px-3 py-1.5 text-sm font-medium rounded border transition-colors whitespace-nowrap flex-shrink-0 ${
                step.buttonVariant === 'added'
                  ? 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {step.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Test Order Section */}
      <div className="bg-gray-50 rounded p-3 border border-gray-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 mb-0.5">
              Try placing a test order yourself
            </h3>
            <p className="text-xs text-gray-600">
              Experience how the process works from start to finish
            </p>
          </div>
          <button
            onClick={handleTestOrderClick}
            className="px-3 py-1.5 text-sm font-medium text-white bg-gray-600 rounded hover:bg-gray-500 transition-colors whitespace-nowrap flex-shrink-0"
          >
            See How It Works
          </button>
        </div>
      </div>
    </div>
  );
};

export default GettingStartedCard;

