import CatalogsTableRow from './CatalogsTableRow';

interface CatalogItem {
  _id: string;
  title: string;
  status: string;
  includeCompareAtPrice?: boolean;
  priceAdjustment?: number;
  priceAdjustmentSide?: 'increase' | 'decrease';
  autoIncludeNewProducts?: boolean;
}

interface CatalogsTableProps {
  catalogs: CatalogItem[];
  onSelect: (id: string) => void;
}


export default function CatalogsTable({ catalogs, onSelect }: CatalogsTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-xs font-medium text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left">Title</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Assigned to</th>
              <th className="px-3 py-2 text-left">Price overrides</th>
              <th className="px-3 py-2 text-left">Overall adjustment</th>
              <th className="px-3 py-2 text-left">Products</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {catalogs.map((c) => (
              <CatalogsTableRow
                key={c._id}
                id={c._id}
                title={c.title}
                status={c.status}
                includeCompareAtPrice={c.includeCompareAtPrice}
                priceAdjustment={c.priceAdjustment}
                priceAdjustmentSide={c.priceAdjustmentSide}
                autoIncludeNewProducts={c.autoIncludeNewProducts}
                onSelect={onSelect}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

