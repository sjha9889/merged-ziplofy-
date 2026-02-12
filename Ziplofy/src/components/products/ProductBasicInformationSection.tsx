import React from "react";
import HierarchicalCategoryDropdown from "../HierarchicalCategoryDropdown";
import ProductDescriptionInput from "./ProductDescriptionInput";
import ProductTitleInput from "./ProductTitleInput";

interface ProductBasicInformationSectionProps {
  title: string;
  category: string;
  description: string;
  activeStoreId: string | null;
  onTitleChange: (value: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onDescriptionChange: (value: string) => void;
}

const ProductBasicInformationSection: React.FC<ProductBasicInformationSectionProps> = ({
  title,
  category,
  description,
  activeStoreId,
  onTitleChange,
  onCategoryChange,
  onDescriptionChange,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900 mb-4">
        Basic Information
      </h2>
      
      <div className="space-y-4">
        <ProductTitleInput
          value={title}
          onChange={onTitleChange}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <HierarchicalCategoryDropdown
            selectedCategory={category}
            onCategorySelect={(categoryId, categoryName) => {
              onCategoryChange(categoryId);
            }}
            storeId={activeStoreId || ''}
          />
        </div>
        
        <ProductDescriptionInput
          value={description}
          onChange={onDescriptionChange}
        />
      </div>
    </div>
  );
};

export default ProductBasicInformationSection;

