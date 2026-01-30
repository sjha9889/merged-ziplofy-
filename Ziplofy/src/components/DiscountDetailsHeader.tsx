import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface DiscountDetailsHeaderProps {
  method: string;
  discountCode?: string;
  title?: string;
  value: string;
  status?: string;
  onBack: () => void;
}

const DiscountDetailsHeader: React.FC<DiscountDetailsHeaderProps> = ({
  method,
  discountCode,
  title,
  value,
  status,
  onBack,
}) => {
  return (
    <div className="border-b border-gray-200 px-4 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-medium text-gray-900">
              {method === 'discount-code' ? (discountCode || '-') : (title || '-')}
            </h1>
            <p className="text-xs text-gray-600 mt-0.5">
              {method} • {value} • {status || 'active'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountDetailsHeader;

