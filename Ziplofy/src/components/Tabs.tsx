import React from 'react';
import TabButton from './TabButton';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex gap-1 border-b border-gray-200">
      {tabs.map((t) => (
        <TabButton
          key={t.id}
          id={t.id}
          label={t.label}
          isActive={activeTab === t.id}
          onClick={onTabChange}
        />
      ))}
    </div>
  );
};

export default Tabs;

