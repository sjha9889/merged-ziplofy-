import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ProductNotFoundProps {
  onBack?: () => void;
}

const ProductNotFound: React.FC<ProductNotFoundProps> = ({ onBack }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/products');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="bg-white p-12 text-center rounded-lg border border-gray-200">
        <div className="bg-red-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
          <XMarkIcon className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Product Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={handleBack}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Products
        </button>
      </div>
    </div>
  );
};

export default ProductNotFound;

