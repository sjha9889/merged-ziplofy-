import React from 'react';
import { SettingsHero, SettingsPanel } from '../../components/settings/SettingsPageScaffold';

const SettingsPlaceholder: React.FC<{ title?: string }> = ({ title = 'Settings' }) => {
  return (
    <div className="w-full">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-6">
        <SettingsHero
          title={title}
          description="This section is not fully implemented yet. Check back later for updates."
        />
        <SettingsPanel className="p-8">
          <p className="text-center text-sm text-gray-500">
            This settings section is not implemented yet.
          </p>
        </SettingsPanel>
      </div>
    </div>
  );
};

export default SettingsPlaceholder;
