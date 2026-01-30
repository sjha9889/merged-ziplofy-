import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface PixelCodeSectionProps {
  code: string;
  onCodeChange: (value: string) => void;
}

const PixelCodeSection: React.FC<PixelCodeSectionProps> = ({
  code,
  onCodeChange,
}) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 mt-6">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-base font-semibold">Code</h3>
        <div className="relative group">
          <InformationCircleIcon 
            className="w-5 h-5 text-gray-500 cursor-help" 
            title="Pixel code snippet"
          />
        </div>
      </div>
      <textarea
        value={code}
        rows={8}
        onChange={(e) => onCodeChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

export default PixelCodeSection;

