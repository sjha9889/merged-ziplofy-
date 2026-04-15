import { SettingsHero, SettingsPanel } from '../components/settings/SettingsPageScaffold';

export const LanguageSettingsPage = () => {
  return (
    <div className="w-full">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-6">
        <SettingsHero
          title="Languages"
          description="Manage storefront and admin languages for your store."
        />
        <SettingsPanel className="p-8">
          <p className="text-center text-sm text-gray-500">Language settings will be available here.</p>
        </SettingsPanel>
      </div>
    </div>
  );
};
