import { useCallback, useState } from 'react';
import { useMarkets } from '../contexts/market.context';
import { useStore } from '../contexts/store.context';

interface MarketsNewFormProps {
  onCreated?: () => void;
}

export default function MarketsNewForm({ onCreated }: MarketsNewFormProps) {
  const { createMarket, loading } = useMarkets();
  const { activeStoreId } = useStore();
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'active' | 'draft'>('active');

  const onCreate = useCallback(async () => {
    if (!activeStoreId || !name.trim()) return;
    await createMarket({ storeId: activeStoreId, name: name.trim(), status });
    onCreated?.();
  }, [activeStoreId, name, status, createMarket, onCreated]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 w-full flex flex-col">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-300 transition-colors"
            placeholder="Enter market name"
          />
        </div>

        <div className="w-full md:w-40">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'active' | 'draft')}
            className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-300 bg-white transition-colors"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCreate}
          disabled={!name.trim() || !activeStoreId || loading}
          className="cursor-pointer px-3 py-1.5 rounded bg-gray-900 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Create
        </button>
      </div>
    </div>
  );
}

