import React from 'react';
import NotificationListItem from './NotificationListItem';

interface NotificationItem {
  icon: React.ReactNode;
  title: string;
  description?: string;
  path: string;
}

interface NotificationListProps {
  items: NotificationItem[];
  onNavigate: (path: string) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  items,
  onNavigate,
}) => {
  return (
    <div className="border border-gray-200 bg-white/95">
      {items.map((item, index) => (
        <NotificationListItem
          key={item.path}
          icon={item.icon}
          title={item.title}
          description={item.description}
          path={item.path}
          onNavigate={onNavigate}
          showDivider={index < items.length - 1}
        />
      ))}
    </div>
  );
};

export default NotificationList;

