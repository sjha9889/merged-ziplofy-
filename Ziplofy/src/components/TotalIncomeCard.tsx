import React from 'react';

interface TotalIncomeCardProps {
  data?: {
    month: string;
    profit: number;
    loss: number;
  }[];
}

const TotalIncomeCard: React.FC<TotalIncomeCardProps> = ({
  data = [
    { month: 'Jan', profit: 23, loss: 23 },
    { month: 'Feb', profit: 20, loss: 23 },
    { month: 'Mar', profit: 23, loss: 28 },
    { month: 'Apr', profit: 37, loss: 18 },
    { month: 'May', profit: 33, loss: 20 },
    { month: 'Jun', profit: 23, loss: 18 },
    { month: 'Jul', profit: 21, loss: 22 },
  ],
}) => {
  const maxValue = 50;
  const chartHeight = 150;
  const chartWidth = 600;
  const barWidth = 60;
  const barGap = 25;
  const startX = 60;
  const startY = 20;

  const getBarHeight = (value: number) => {
    return (value / maxValue) * chartHeight;
  };

  const getBarX = (index: number) => {
    return startX + index * (barWidth + barGap);
  };

  return (
    <div className="bg-white rounded-lg p-4 min-h-80 border border-gray-200">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-base font-medium text-gray-900 mb-1.5">Total Income</h3>
        <p className="text-sm text-gray-500">View your income on a certain period of time</p>
      </div>

      {/* Profit and Loss Section */}
      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Profit and Loss</h4>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg width="100%" height={chartHeight + startY + 40} viewBox={`0 0 ${chartWidth} ${chartHeight + startY + 40}`}>
          {/* Grid Lines */}
          {[0, 10, 20, 30, 40, 50].map((value) => {
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
                  {value === 0 ? '00' : `${value}k`}
                </text>
              </g>
            );
          })}

          {/* Stacked Bars */}
          {data.map((item, index) => {
            const profitHeight = getBarHeight(item.profit);
            const lossHeight = getBarHeight(item.loss);
            const totalHeight = profitHeight + lossHeight;
            const x = getBarX(index);
            const profitY = startY + chartHeight - totalHeight;
            const lossY = profitY + profitHeight;

            return (
              <g key={item.month}>
                {/* Profit Bar (Blue - Bottom) */}
                <rect
                  x={x}
                  y={profitY}
                  width={barWidth}
                  height={profitHeight}
                  fill="#6366f1"
                  rx="4"
                  className="hover:opacity-80 transition-opacity"
                />
                {/* Loss Bar (Light Gray - Top) */}
                <rect
                  x={x}
                  y={lossY}
                  width={barWidth}
                  height={lossHeight}
                  fill="#e5e7eb"
                  rx="4"
                  className="hover:opacity-80 transition-opacity"
                />
                {/* Month Label */}
                <text
                  x={x + barWidth / 2}
                  y={startY + chartHeight + 20}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                  fontSize="12"
                >
                  {item.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default TotalIncomeCard;

