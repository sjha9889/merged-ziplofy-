import {
  ArrowLeftIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useState } from 'react';
import { useCategories } from '../contexts/category.context';
import CategoryList from './CategoryList';

interface HierarchicalCategoryDropdownProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string, categoryName: string) => void;
  storeId: string;
}

const HierarchicalCategoryDropdown: React.FC<HierarchicalCategoryDropdownProps> = ({
  selectedCategory,
  onCategorySelect,
  storeId
}) => {
  const { categories, loading, fetchBaseCategories, fetchCategoriesByParentId } = useCategories();
  const [navigationStack, setNavigationStack] = useState<Array<{id: string, name: string}>>([]);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');

  // Initialize with base categories
  useEffect(() => {
    fetchBaseCategories();
  }, [fetchBaseCategories]);

  // Handle category selection
  const handleCategorySelect = useCallback((category: any) => {
    if (category.hasChildren) {
      // Navigate to children
      setNavigationStack(prev => [...prev, { id: category._id, name: category.name }]);
      setCurrentParentId(category._id);
      fetchCategoriesByParentId(category._id);
    } else {
      // Select this category
      onCategorySelect(category._id, category.name);
      setSelectedCategoryName(category.name);
    }
  }, [onCategorySelect, fetchCategoriesByParentId]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (navigationStack.length > 0) {
      const newStack = [...navigationStack];
      newStack.pop();
      setNavigationStack(newStack);
      
      if (newStack.length === 0) {
        setCurrentParentId(null);
        fetchBaseCategories();
      } else {
        const parent = newStack[newStack.length - 1];
        setCurrentParentId(parent.id);
        fetchCategoriesByParentId(parent.id);
      }
    }
  }, [navigationStack, fetchBaseCategories, fetchCategoriesByParentId]);

  // Handle home navigation
  const handleHome = useCallback(() => {
    setNavigationStack([]);
    setCurrentParentId(null);
    fetchBaseCategories();
  }, [fetchBaseCategories]);

  // Get current breadcrumb path
  const getBreadcrumbPath = useCallback(() => {
    if (navigationStack.length === 0) return 'Base Categories';
    return navigationStack.map(item => item.name).join(' > ');
  }, [navigationStack]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-h-96 overflow-hidden">
      {/* Header with navigation */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            {getBreadcrumbPath()}
          </span>
          <div className="flex items-center gap-1">
            {navigationStack.length > 0 && (
              <button
                onClick={handleBack}
                title="Go Back"
                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleHome}
              title="Home"
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <HomeIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {selectedCategoryName && (
          <span className="inline-flex items-center px-2.5 py-1 mt-2 text-xs font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-lg">
            Selected: {selectedCategoryName}
          </span>
        )}
      </div>

      {/* Categories List */}
      <div className="max-h-72 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center p-6">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
          </div>
        ) : categories.length > 0 ? (
          <CategoryList
            categories={categories}
            onCategorySelect={handleCategorySelect}
          />
        ) : (
          <div className="p-6 text-center">
            <p className="text-sm text-gray-500">
              No categories found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HierarchicalCategoryDropdown;
