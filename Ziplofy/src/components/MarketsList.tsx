import MarketsListItems from './MarketsListItems';

type MarketItem = {
  _id: string;
  name: string;
  status: string;
};

interface MarketsListProps {
  markets: MarketItem[];
  loading: boolean;
  onSelect: (id: string) => void;
}

export default function MarketsList({ markets, loading, onSelect }: MarketsListProps) {
  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      <div className="grid grid-cols-[2fr_1fr] px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50">
        <div>Market Name</div>
        <div>Status</div>
      </div>
      <div className="border-t border-gray-200" />
      <div>
        {loading && <div className="px-3 py-3 text-sm text-gray-600">Loading markets...</div>}
        {!loading && markets.length === 0 && (
          <div className="px-3 py-3 text-sm text-gray-600">No markets yet</div>
        )}
        {!loading && (
          <MarketsListItems markets={markets} onSelect={onSelect} />
        )}
      </div>
    </div>
  );
}

