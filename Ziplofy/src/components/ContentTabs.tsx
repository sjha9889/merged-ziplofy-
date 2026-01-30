import ContentTabList from './ContentTabList';

interface ContentTab {
  label: string;
}

interface ContentTabsProps {
  tabs: ContentTab[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export default function ContentTabs({ tabs, activeIndex, onChange }: ContentTabsProps) {
  return (
    <div className="flex gap-3" role="tablist" aria-label="Metaobjects tabs">
      <ContentTabList tabs={tabs} activeIndex={activeIndex} onChange={onChange} />
    </div>
  );
}

