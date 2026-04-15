import { SettingsHero, SettingsPanel } from '../components/settings/SettingsPageScaffold';

export const MetafeildsAndMetaObjectsSettingsPage = () => {
  return (
    <div className="w-full">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-6">
        <SettingsHero
          title="Metafields and metaobjects"
          description="Define custom data structures for products, customers, and more."
        />
        <SettingsPanel className="p-8">
          <p className="text-center text-sm text-gray-500">
            Metafields and metaobjects settings will be available here.
          </p>
        </SettingsPanel>
      </div>
    </div>
  );
};
