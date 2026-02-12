import React from 'react';

interface TagOption {
  name: string;
  route: string;
  icon: any;
  description: string;
}

interface TagOptionsItemProps {
  option: TagOption;
  onClick: (route: string) => void;
}

const TagOptionsItem: React.FC<TagOptionsItemProps> = ({ option, onClick }) => {
  const Icon = option.icon;
  
  return (
    <button
      onClick={() => onClick(option.route)}
      className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-4 hover:shadow-md hover:border-blue-200 hover:bg-blue-50/30 transition-all text-left group"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-0.5 group-hover:text-blue-700 transition-colors">
            {option.name}
          </h3>
          <p className="text-xs text-gray-500">
            {option.description}
          </p>
        </div>
      </div>
    </button>
  );
};

export default TagOptionsItem;

