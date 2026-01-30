import React from "react";

interface FreeShippingCountryRatesCardProps {
  countrySelection?: string;
  selectedCountryCodes?: string[];
  excludeShippingRates?: boolean;
  shippingRateLimit?: number | string;
}

const FreeShippingCountryRatesCard: React.FC<FreeShippingCountryRatesCardProps> = ({
  countrySelection,
  selectedCountryCodes,
  excludeShippingRates,
  shippingRateLimit,
}) => {
  const renderBoolean = (v?: boolean) => (v ? 'Yes' : 'No');

  return (
    <div className="bg-white border border-gray-200 p-4">
      <h2 className="text-base font-medium mb-3 text-gray-900">Country & Rates</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-600 mb-1">Country Selection</p>
          <p className="text-sm text-gray-900">{countrySelection}</p>
        </div>
        {countrySelection === 'selected-countries' && (
          <div>
            <p className="text-xs text-gray-600 mb-1">Selected Country Codes</p>
            <p className="text-sm text-gray-900">{(selectedCountryCodes || []).join(', ') || '-'}</p>
          </div>
        )}
        <div>
          <p className="text-xs text-gray-600 mb-1">Exclude Shipping Rates</p>
          <p className="text-sm text-gray-900">{renderBoolean(excludeShippingRates)}</p>
        </div>
        {excludeShippingRates && (
          <div>
            <p className="text-xs text-gray-600 mb-1">Shipping Rate Limit</p>
            <p className="text-sm text-gray-900">{shippingRateLimit}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreeShippingCountryRatesCard;

