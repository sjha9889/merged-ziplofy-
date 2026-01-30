import React from 'react';
import {
  EllipsisHorizontalIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import type { Pixel } from '../contexts/pixel.context';

interface PixelTableRowProps {
  pixel: Pixel;
  renderStatusChip: (pixel: Pixel) => React.ReactNode;
  onRowClick: (pixelId: string) => void;
}

const PixelTableRow: React.FC<PixelTableRowProps> = ({
  pixel,
  renderStatusChip,
  onRowClick,
}) => {
  return (
    <tr
      onClick={() => onRowClick(pixel._id)}
      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-100 border border-gray-200 text-gray-600 flex items-center justify-center shrink-0">
            <Squares2X2Icon className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-medium capitalize text-gray-900">
            {pixel.pixelName}
          </span>
        </div>
      </td>
      <td className="px-3 py-2 text-sm capitalize text-gray-900">{pixel.type}</td>
      <td className="px-3 py-2">{renderStatusChip(pixel)}</td>
      <td className="px-3 py-2 text-right">
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
        >
          <EllipsisHorizontalIcon className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};

export default PixelTableRow;

