import { PlusIcon } from "@heroicons/react/24/outline";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import AddPackageModal from "../AddPackageModal";
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
  const { packagings, fetchPackagingsByStoreId, createPackaging } = usePackaging();
  const [isAddPackageModalOpen, setIsAddPackageModalOpen] = useState(false);
  const [packageFormData, setPackageFormData] = useState({
    packageName: "",
    packageType: "box",
    length: "",
    width: "",
    height: "",
    dimensionsUnit: "cm",
    weight: "",
    weightUnit: "kg",
    isDefault: false,
  });

  // Fetch packagings when component mounts or activeStoreId changes
  useEffect(() => {
    if (activeStoreId) {
      fetchPackagingsByStoreId(activeStoreId);
    }
  }, [activeStoreId, fetchPackagingsByStoreId]);

  useEffect(() => {
    if (!selectedPackage && packagings.length > 0) {
      const preferredPackage = packagings.find((pkg) => pkg.isDefault) || packagings[0];
      onSelectedPackageChange(preferredPackage._id);
    }
  }, [selectedPackage, packagings, onSelectedPackageChange]);

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

  const isHsCodeValid = hsCode.trim() === "" || /^\d{6}$/.test(hsCode.trim());

  const resetPackageForm = useCallback(() => {
    setPackageFormData({
      packageName: "",
      packageType: "box",
      length: "",
      width: "",
      height: "",
      dimensionsUnit: "cm",
      weight: "",
      weightUnit: "kg",
      isDefault: false,
    });
  }, []);

  const handleOpenAddPackageModal = useCallback(() => {
    resetPackageForm();
    setIsAddPackageModalOpen(true);
  }, [resetPackageForm]);

  const handleCloseAddPackageModal = useCallback(() => {
    setIsAddPackageModalOpen(false);
  }, []);

  const handlePackageFormChange = useCallback((field: string, value: any) => {
    setPackageFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleAddPackageSubmit = useCallback(async () => {
    if (!activeStoreId) {
      toast.error("Please select a store first");
      return;
    }

    const payload = {
      storeId: activeStoreId,
      packageName: packageFormData.packageName.trim(),
      packageType: packageFormData.packageType as "box" | "envelope" | "soft_package",
      length: parseFloat(packageFormData.length),
      width: parseFloat(packageFormData.width),
      height: packageFormData.packageType === "envelope" ? 0 : parseFloat(packageFormData.height),
      dimensionsUnit: packageFormData.dimensionsUnit as "cm" | "in",
      weight: parseFloat(packageFormData.weight),
      weightUnit: packageFormData.weightUnit as "g" | "kg" | "oz" | "lb",
      isDefault: packageFormData.isDefault,
    };

    if (
      !payload.packageName ||
      Number.isNaN(payload.length) ||
      Number.isNaN(payload.width) ||
      Number.isNaN(payload.weight) ||
      (payload.packageType !== "envelope" && Number.isNaN(payload.height))
    ) {
      toast.error("Please fill all required package details");
      return;
    }

    try {
      await createPackaging(payload);
      setIsAddPackageModalOpen(false);
      await fetchPackagingsByStoreId(activeStoreId);
      toast.success("Package added");
    } catch (error) {
      toast.error("Failed to add package");
    }
  }, [
    activeStoreId,
    packageFormData,
    createPackaging,
    fetchPackagingsByStoreId,
  ]);

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
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
              <div className="mt-2 flex items-center justify-between gap-2">
                {packagings.length === 0 ? (
                  <p className="text-xs text-amber-600">
                    No packages found. Add one to continue shipping setup.
                  </p>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={handleOpenAddPackageModal}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  Add package
                </button>
              </div>
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
                  className={`w-full px-3 py-2 border rounded text-base focus:outline-none focus:ring-1 transition-colors ${
                    isHsCodeValid
                      ? "border-gray-200 focus:ring-gray-400 focus:border-gray-400"
                      : "border-red-300 focus:ring-red-300 focus:border-red-400"
                  }`}
                  maxLength={6}
                  inputMode="numeric"
                  pattern="\d{6}"
                  aria-invalid={!isHsCodeValid}
                />
                <p className={`mt-1 text-sm ${isHsCodeValid ? "text-gray-500" : "text-red-600"}`}>
                  {isHsCodeValid
                    ? "Enter a six-digit code or search by keyword"
                    : "HS code must be exactly 6 digits"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <AddPackageModal
        open={isAddPackageModalOpen}
        onClose={handleCloseAddPackageModal}
        formData={packageFormData}
        onFormChange={handlePackageFormChange}
        onSubmit={handleAddPackageSubmit}
      />
    </div>
  );
};

export default ProductShippingSection;

