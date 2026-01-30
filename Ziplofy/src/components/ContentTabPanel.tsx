
interface ContentTabPanelProps {
  title: string;
  description: string;
  empty: string;
}

export default function ContentTabPanel({ title, description, empty }: ContentTabPanelProps) {
  return (
    <div className="border border-gray-200 p-4">
      <h2 className="text-base font-medium text-gray-900 mb-1.5">{title}</h2>
      <p className="text-xs text-gray-600 mb-3">{description}</p>
      <div className="flex items-center justify-center min-h-[300px] border border-dashed border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600 text-center px-4">{empty}</p>
      </div>
    </div>
  );
}

