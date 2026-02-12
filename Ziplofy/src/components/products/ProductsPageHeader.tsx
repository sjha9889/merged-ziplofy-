import { PlusIcon } from "@heroicons/react/24/outline";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const ProductsPageHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleAddProduct = useCallback(() => {
    navigate('/products/new');
  }, [navigate]);

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="pl-3 border-l-4 border-blue-500/60">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your store catalog</p>
      </div>
      <button
        onClick={handleAddProduct}
        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        <PlusIcon className="w-4 h-4" />
        Add Product
      </button>
    </div>
  );
};

export default ProductsPageHeader;

