import React from "react";

interface ProductDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

const ProductDescriptionInput: React.FC<ProductDescriptionInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Describe your product...",
  rows = 4
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Description
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-200 rounded text-base focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors resize-none"
      />
    </div>
  );
};

export default ProductDescriptionInput;

