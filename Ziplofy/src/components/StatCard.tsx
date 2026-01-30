import React from 'react';

interface StatCardProps {
  title: string;
  value?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value = "—" }) => (
  <div className="p-3 border border-gray-200 bg-white">
    <p className="text-xs text-gray-600 mb-1">{title}</p>
    <h3 className="text-lg font-medium text-gray-900">{value}</h3>
  </div>
);

export default StatCard;

