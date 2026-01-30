import { InformationCircleIcon } from '@heroicons/react/24/outline';
import React, { useCallback } from 'react';

interface BillingTaxIdSectionProps {
  onAddGstin: () => void;
}

const BillingTaxIdSection: React.FC<BillingTaxIdSectionProps> = ({ onAddGstin }) => {
  const handleAddGstin = useCallback(() => {
    onAddGstin();
  }, [onAddGstin]);

  return (
    <div className="border border-gray-200 bg-white/95 mb-4 p-4">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-sm font-medium text-gray-900">
          Tax ID
        </h2>
        <InformationCircleIcon className="w-4 h-4 text-gray-500" />
      </div>
      <p className="text-xs text-gray-600 mb-3">
        Ziplofy is required to charge Goods and Services Tax (GST) in India. Your bills may be exempt
        from Indian GST if you are GST registered in India and enter a valid GSTIN.
      </p>
      <button
        onClick={handleAddGstin}
        className="w-full px-3 py-2 border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-start"
      >
        + Add GSTIN
      </button>
    </div>
  );
};

export default BillingTaxIdSection;

