import { ChevronDownIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useRef, useState } from 'react';

interface RevenueAnalyticsCardProps {
  timeframe?: string;
  data?: { day: string; value: number }[];
}

const RevenueAnalyticsCard: React.FC<RevenueAnalyticsCardProps> = ({
  timeframe = 'This Week',
  data = [
    { day: 'Fri', value: 17 },
    { day: 'Sat', value: 13 },
    { day: 'Sun', value: 22 },
    { day: 'Mon', value: 13 },
    { day: 'Tue', value: 17 },
    { day: 'Wed', value: 22 },
    { day: 'Thu', value: 17 },
  ],
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const maxValue = 30;
  const chartHeight = 150;
  const chartWidth = 600;
  const barWidth = 60;
  const barGap = 30;
  const startX = 60;
  const startY = 20;

  const timeframes = ['This Week', 'This Month', 'This Year'];

  const getBarHeight = (value: number) => {
    return (value / maxValue) * chartHeight;
  };

  const getBarX = (index: number) => {
    return startX + index * (barWidth + barGap);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="bg-white rounded-lg p-4 min-h-80 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-medium text-gray-900">Revenue analytics</h3>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
          >
            {selectedTimeframe}
            <ChevronDownIcon className="w-4 h-4" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-md py-1 z-10 min-w-[120px]">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    setSelectedTimeframe(tf);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {tf}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg width="100%" height={chartHeight + startY + 40} viewBox={`0 0 ${chartWidth} ${chartHeight + startY + 40}`}>
          {/* Grid Lines */}
          {[0, 5, 10, 15, 20, 25, 30].map((value) => {
            const y = startY + chartHeight - (value / maxValue) * chartHeight;
            return (
              <g key={value}>
                <line
                  x1={startX - 10}
                  y1={y}
                  x2={chartWidth - 20}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={startX - 15}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-500"
                  fontSize="12"
                >
                  {value}k
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((item, index) => {
            const barHeight = getBarHeight(item.value);
            const x = getBarX(index);
            const y = startY + chartHeight - barHeight;

            return (
              <g key={item.day}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="#6366f1"
                  rx="4"
                  className="hover:opacity-80 transition-opacity"
                />
                {/* Day Label */}
                <text
                  x={x + barWidth / 2}
                  y={startY + chartHeight + 20}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                  fontSize="12"
                >
                  {item.day}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default RevenueAnalyticsCard;

