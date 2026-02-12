interface ContentTabPanelProps {
  title: string;
  description: string;
  empty: string;
}

export default function ContentTabPanel({ title, description, empty }: ContentTabPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex items-center justify-center min-h-[280px] border border-dashed border-gray-200 bg-gray-50/50 rounded-lg mx-4 mb-4">
        <p className="text-sm text-gray-500 text-center px-6 max-w-md">{empty}</p>
      </div>
    </div>
  );
}

