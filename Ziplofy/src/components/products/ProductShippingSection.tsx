import React, { useCallback, useEffect } from "react";
import { usePackaging } from "../../contexts/packaging.context";

interface ProductShippingSectionProps {
  physicalProduct: boolean;
  selectedPackage: string;
  productWeight: string;
  weightUnit: string;
  countryOfOrigin: string;
  hsCode: string;
  onPhysicalProductChange: (checked: boolean) => void;
  onSelectedPackageChange: (value: string) => void;
  onProductWeightChange: (value: string) => void;
  onWeightUnitChange: (value: string) => void;
  onCountryOfOriginChange: (value: string) => void;
  onHsCodeChange: (value: string) => void;
  activeStoreId: string | null;
}

// Weight units for shipping
const weightUnits = ['lb', 'oz', 'kg', 'grams'];

// Countries data for customs
const countries = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands',
  'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland',
  'Czech Republic', 'Hungary', 'Portugal', 'Greece', 'Ireland', 'Luxembourg', 'Slovakia',
  'Slovenia', 'Croatia', 'Romania', 'Bulgaria', 'Lithuania', 'Latvia', 'Estonia', 'Malta',
  'Cyprus', 'Japan', 'South Korea', 'China', 'India', 'Australia', 'New Zealand', 'Brazil',
  'Argentina', 'Chile', 'Mexico', 'South Africa', 'Israel', 'Turkey', 'Russia', 'Ukraine',
  'Thailand', 'Singapore', 'Malaysia', 'Indonesia', 'Philippines', 'Vietnam', 'Taiwan',
  'Hong Kong', 'Saudi Arabia', 'United Arab Emirates', 'Egypt', 'Morocco', 'Nigeria',
  'Kenya', 'Ghana', 'Ethiopia', 'Tanzania', 'Uganda', 'Rwanda', 'Senegal', 'Ivory Coast',
  'Cameroon', 'Algeria', 'Tunisia', 'Libya', 'Sudan', 'Angola', 'Mozambique', 'Zambia',
  'Zimbabwe', 'Botswana', 'Namibia', 'Lesotho', 'Swaziland', 'Madagascar', 'Mauritius',
  'Seychelles', 'Comoros', 'Djibouti', 'Somalia', 'Eritrea', 'South Sudan', 'Central African Republic',
  'Chad', 'Niger', 'Mali', 'Burkina Faso', 'Guinea', 'Sierra Leone', 'Liberia', 'Gambia',
  'Guinea-Bissau', 'Cape Verde', 'São Tomé and Príncipe', 'Equatorial Guinea', 'Gabon',
  'Republic of the Congo', 'Democratic Republic of the Congo', 'Burundi', 'Malawi'
];

const ProductShippingSection: React.FC<ProductShippingSectionProps> = ({
  physicalProduct,
  selectedPackage,
  productWeight,
  weightUnit,
  countryOfOrigin,
  hsCode,
  onPhysicalProductChange,
  onSelectedPackageChange,
  onProductWeightChange,
  onWeightUnitChange,
  onCountryOfOriginChange,
  onHsCodeChange,
  activeStoreId,
}) => {
  const { packagings, fetchPackagingsByStoreId } = usePackaging();

  // Fetch packagings when component mounts or activeStoreId changes
  useEffect(() => {
    if (activeStoreId) {
      fetchPackagingsByStoreId(activeStoreId);
    }
  }, [activeStoreId, fetchPackagingsByStoreId]);

  const handlePhysicalProductChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onPhysicalProductChange(e.target.checked);
  }, [onPhysicalProductChange]);

  const handlePackageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectedPackageChange(e.target.value);
  }, [onSelectedPackageChange]);

  const handleProductWeightChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onProductWeightChange(e.target.value);
  }, [onProductWeightChange]);

  const handleWeightUnitChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onWeightUnitChange(e.target.value);
  }, [onWeightUnitChange]);

  const handleCountryOfOriginChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onCountryOfOriginChange(e.target.value);
  }, [onCountryOfOriginChange]);

  const handleHsCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onHsCodeChange(e.target.value);
  }, [onHsCodeChange]);

  return (
    <div className="mb-6 border border-gray-200 p-3 bg-white/95">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-medium text-gray-900">
          Shipping
        </h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={physicalProduct}
            onChange={handlePhysicalProductChange}
            className="w-3.5 h-3.5 text-gray-900 focus:ring-gray-400 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Physical product</span>
        </label>
      </div>

      {/* Conditional Shipping Fields */}
      {physicalProduct && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package
              </label>
              <select
                value={selectedPackage}
                onChange={handlePackageChange}
                className="w-full px-3 py-2 border border-gray-200 rounded text-base focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
              >
                <option value="">Select a package</option>
                {packagings.map((pkg) => (
                  <option key={pkg._id} value={pkg._id}>
                    {pkg.packageName} - {pkg.length} x {pkg.width} x {pkg.height} {pkg.dimensionsUnit}, {pkg.weight} {pkg.weightUnit}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product weight
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={productWeight}
                  onChange={handleProductWeightChange}
                  placeholder="0.00"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded text-base focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                />
                <select
                  value={weightUnit}
                  onChange={handleWeightUnitChange}
                  className="px-3 py-2 border border-gray-200 rounded text-base focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors min-w-[100px]"
                >
                  <option value="" disabled>Unit</option>
                  {weightUnits.map(unit => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Customs Information Sub-segment */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Customs Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country/Region of Origin
                </label>
                <select
                  value={countryOfOrigin}
                  onChange={handleCountryOfOriginChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded text-base focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harmonized System (HS) Code
                </label>
                <input
                  type="text"
                  value={hsCode}
                  onChange={handleHsCodeChange}
                  placeholder="Enter a six-digit code or search by keyword"
                  className="w-full px-3 py-2 border border-gray-200 rounded text-base focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                />
                <p className="mt-1 text-sm text-gray-500">Enter a six-digit code or search by keyword</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductShippingSection;

