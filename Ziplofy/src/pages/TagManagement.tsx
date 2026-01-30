import React from 'react';
import GridBackgroundWrapper from '../components/GridBackgroundWrapper';
import TagOptionsList from '../components/tags/TagOptionsList';

const TagManagement: React.FC = () => {
  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <div className="mb-4">
            <h1 className="text-xl font-medium text-gray-900">Tag Management</h1>
            <p className="mt-1 text-sm text-gray-600">Select a tag type to manage</p>
          </div>
          <TagOptionsList />
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default TagManagement;
