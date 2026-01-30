interface CatalogRowProps {
  id: string;
  title: string;
  status: string;
  includeCompareAtPrice?: boolean;
  priceAdjustment?: number;
  priceAdjustmentSide?: 'increase' | 'decrease';
  autoIncludeNewProducts?: boolean;
  onSelect: (id: string) => void;
}

export default function CatalogsTableRow({
  id,
  title,
  status,
  includeCompareAtPrice,
  priceAdjustment,
  priceAdjustmentSide,
  autoIncludeNewProducts,
  onSelect,
}: CatalogRowProps) {
  const isActive = status === 'active';
  return (
    <tr
      className="hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onSelect(id)}
    >
      <td className="px-3 py-2 text-sm font-medium text-gray-900">{title}</td>
      <td className="px-3 py-2">
        <span
          className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${
            isActive
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-gray-50 text-gray-700 border-gray-200'
          }`}
        >
          {isActive ? 'Active' : 'Draft'}
        </span>
      </td>
      <td className="px-3 py-2 text-sm text-gray-700">—</td>
      <td className="px-3 py-2 text-sm text-gray-700">
        {includeCompareAtPrice ? 'Compare-at included' : '—'}
      </td>
      <td className="px-3 py-2 text-sm text-gray-700">
        {`${priceAdjustment || 0}% ${priceAdjustmentSide === 'increase' ? '↑' : '↓'}`}
      </td>
      <td className="px-3 py-2 text-sm text-gray-700">
        {autoIncludeNewProducts ? 'Auto include new' : 'Manual'}
      </td>
    </tr>
  );
}

