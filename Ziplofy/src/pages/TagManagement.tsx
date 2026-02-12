import React from 'react';
import TagOptionsList from '../components/tags/TagOptionsList';

const TagManagement: React.FC = () => {
  return (
    <div className="min-h-screen bg-page-background-color">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-4">
        <div className="mb-6 pl-3 border-l-4 border-blue-500/60">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tag Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Select a tag type to manage</p>
        </div>
        <TagOptionsList />
      </div>
    </div>
  );
};

export default TagManagement;
