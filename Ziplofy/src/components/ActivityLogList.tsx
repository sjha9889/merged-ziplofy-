import React from 'react';
import ActivityLogEntry, { type ActivityEntry } from './ActivityLogEntry';

interface ActivityLogListProps {
  entries: ActivityEntry[];
}

const ActivityLogList: React.FC<ActivityLogListProps> = ({ entries }) => (
  <div className="border border-gray-200 bg-white p-4">
    {entries.map((entry, index) => (
      <ActivityLogEntry
        key={entry.id}
        entry={entry}
        showDivider={index < entries.length - 1}
      />
    ))}
  </div>
);

export default ActivityLogList;

