import React, { useCallback } from "react";

interface CompareAtPriceInputProps {
  value: string;
  onChange: (value: string) => void;
}

const CompareAtPriceInput: React.FC<CompareAtPriceInputProps> = ({
  value,
  onChange,
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Compare at price
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-base">₹</span>
        <input
          type="number"
          value={value}
          onChange={handleChange}
          placeholder="0.00"
          className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded text-base focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
        />
      </div>
    </div>
  );
};

export default CompareAtPriceInput;

