
interface CatalogBasicsSectionProps {
  title: string;
  status: 'active' | 'draft';
  onTitleChange: (value: string) => void;
  onStatusChange: (value: 'active' | 'draft') => void;
}

export default function CatalogBasicsSection({
  title,
  status,
  onTitleChange,
  onStatusChange,
}: CatalogBasicsSectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-300 transition-colors"
            placeholder="Enter catalog title"
          />
        </div>
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as 'active' | 'draft')}
            className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-300 bg-white transition-colors"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>
    </div>
  );
}

