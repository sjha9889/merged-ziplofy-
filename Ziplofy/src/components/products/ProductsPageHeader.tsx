import { CubeIcon, PlusIcon } from "@heroicons/react/24/outline";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const ProductsPageHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleAddProduct = useCallback(() => {
    navigate('/products/new');
  }, [navigate]);

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CubeIcon className="w-5 h-5 text-gray-600" />
          <h1 className="text-xl font-medium text-gray-900">Products</h1>
        </div>
        <button
          onClick={handleAddProduct}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add Product
        </button>
      </div>
    </div>
  );
};

export default ProductsPageHeader;

