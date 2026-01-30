import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
import ProductTagsSection from '../../components/tags/ProductTagsSection';

const ProductTagsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/tag-management');
  };

  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <div className="mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 mb-3 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span className="text-sm font-medium cursor-pointer">Back</span>
            </button>
            <h1 className="text-xl font-medium text-gray-900">Product Tags</h1>
            <p className="mt-1 text-sm text-gray-600">Manage tags for your products</p>
          </div>
          <ProductTagsSection />
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default ProductTagsPage;

