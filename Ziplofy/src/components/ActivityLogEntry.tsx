import React from 'react';

export type ActivityEntry = {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  linkLabel?: string;
  linkHref?: string;
};

interface ActivityLogEntryProps {
  entry: ActivityEntry;
  showDivider: boolean;
}

const ActivityLogEntry: React.FC<ActivityLogEntryProps> = ({ entry, showDivider }) => (
  <>
    <div className="py-2.5">
      <p className="text-sm font-medium text-gray-900">
        {entry.title}
        {entry.linkLabel && (
          <>
            {': '}
            <a
              href={entry.linkHref}
              className="text-gray-700 ml-0.5 hover:text-gray-900 transition-colors"
            >
              {entry.linkLabel}
            </a>
          </>
        )}
      </p>
      {entry.description && !entry.linkLabel && (
        <p className="text-sm text-gray-600 mt-1">
          {entry.description}
        </p>
      )}
      <p className="text-xs text-gray-500 mt-1">
        {entry.timestamp}
      </p>
    </div>
    {showDivider && <hr className="my-2 border-gray-200" />}
  </>
);

export default ActivityLogEntry;

