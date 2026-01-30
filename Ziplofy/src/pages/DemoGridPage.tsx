import React from 'react';
import GridBackgroundWrapper from '../components/GridBackgroundWrapper';

const DemoGridPage: React.FC = () => {
  return (
    <GridBackgroundWrapper>
      <div className="p-6">
        <div className="max-w-[1600px] mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Demo Grid Page</h1>
          <p className="text-gray-600">This page demonstrates a CSS-based grid background wrapper.</p>
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default DemoGridPage;
