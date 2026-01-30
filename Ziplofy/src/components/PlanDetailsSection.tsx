import React from 'react';

interface PlanDetailsSectionProps {
  onCancelTrial: () => void;
  onChoosePlan: () => void;
}

const PlanDetailsSection: React.FC<PlanDetailsSectionProps> = ({
  onCancelTrial,
  onChoosePlan,
}) => {
  return (
    <div className="border border-gray-200 bg-white p-4 mb-4">
      <h2 className="text-base font-medium text-gray-900 mb-3">
        Plan details
      </h2>

      <div className="border border-gray-200 p-4 flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-gray-900">
          Trial
        </p>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onCancelTrial}
            className="px-3 py-1.5 text-sm text-gray-700 border border-gray-200 bg-transparent hover:bg-gray-50 transition-colors"
          >
            Cancel trial
          </button>
          <button
            onClick={onChoosePlan}
            className="px-3 py-1.5 text-sm text-white bg-gray-900 hover:bg-gray-800 transition-colors"
          >
            Choose plan
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-600 mt-3">
        View the{' '}
        <a href="#" className="text-gray-700 hover:underline">
          terms of service
        </a>{' '}
        and{' '}
        <a href="#" className="text-gray-700 hover:underline">
          privacy policy
        </a>
      </p>
    </div>
  );
};

export default PlanDetailsSection;

