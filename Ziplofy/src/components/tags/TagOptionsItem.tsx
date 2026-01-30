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
      className="bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors text-left"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
          <Icon className="w-4 h-4 text-gray-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 mb-0.5">
            {option.name}
          </h3>
          <p className="text-xs text-gray-600">
            {option.description}
          </p>
        </div>
      </div>
    </button>
  );
};

export default TagOptionsItem;

