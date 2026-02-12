import type { JSX } from 'react';
import { useState } from 'react';
import ContentPageHeader from '../components/ContentPageHeader';
import ContentTabPanels from '../components/ContentTabPanels';
import ContentTabs from '../components/ContentTabs';

const tabs = [
  {
    label: 'All Definitions',
    title: 'All Metaobject Definitions',
    description: 'Manage all your metaobject definitions in one place.',
    empty: 'No metaobject definitions found. Click "Add definition" to create one.',
  },
  {
    label: 'Product References',
    title: 'Product References',
    description: 'Metaobjects that reference products in your store.',
    empty: 'No product reference metaobjects found.',
  },
  {
    label: 'Content Blocks',
    title: 'Content Blocks',
    description: 'Reusable content blocks for your store.',
    empty: 'No content block metaobjects found.',
  },
];

export default function MetaobjectsPage(): JSX.Element {
  const [tab, setTab] = useState<number>(0);

  return (
    <div className="min-h-screen bg-page-background-color">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-4">
        <ContentPageHeader />
        <div className="mb-6">
          <ContentTabs tabs={tabs} activeIndex={tab} onChange={setTab} />
        </div>
        <ContentTabPanels tabs={tabs} activeIndex={tab} />
      </div>
    </div>
  );
}
