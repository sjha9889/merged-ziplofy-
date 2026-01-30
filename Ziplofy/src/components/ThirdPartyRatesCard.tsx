import React from 'react';
import { TruckIcon } from '@heroicons/react/24/outline';

interface ThirdPartyRatesCardProps {
  onUpgradeClick?: () => void;
  onLearnMoreClick?: () => void;
}

const ThirdPartyRatesCard: React.FC<ThirdPartyRatesCardProps> = ({
  onUpgradeClick,
  onLearnMoreClick,
}) => {
  return (
    <div className="bg-white/95 border border-gray-200 p-4 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h2 className="text-sm font-medium text-gray-900 mb-1">
            Enable third-party calculated rates at checkout
          </h2>
          <p className="text-xs text-gray-600 mb-3">
            Connect your existing shipping carrier account to use your own rates
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onUpgradeClick}
              className="px-3 py-1.5 text-xs font-medium border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Upgrade your plan
            </button>
            <a
              href="#"
              onClick={(e) => {
                if (onLearnMoreClick) {
                  e.preventDefault();
                  onLearnMoreClick();
                }
              }}
              className="text-gray-700 hover:text-gray-900 text-xs transition-colors"
            >
              Learn more
            </a>
          </div>
        </div>
        <div className="ml-4 w-16 h-16 flex items-center justify-center shrink-0">
          <TruckIcon className="w-12 h-12 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default ThirdPartyRatesCard;

