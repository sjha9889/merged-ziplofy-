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
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-base font-semibold text-gray-900">Code</h3>
        <InformationCircleIcon
          className="w-5 h-5 text-gray-500 cursor-help"
          title="Pixel code snippet"
        />
      </div>
      <p className="text-sm text-gray-500 mb-3">
        Paste your pixel or tracking code snippet below.
      </p>
      <textarea
        value={code}
        rows={8}
        onChange={(e) => onCodeChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-2 font-mono text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        placeholder="<script>...</script>"
      />
    </div>
  );
};

export default PixelCodeSection;

