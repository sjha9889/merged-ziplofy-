import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStore } from '../../contexts/store.context';
import { StoreThemeConfigProvider } from '../../contexts/store-theme-config.context';
import SectionThemeConfigEditor from './SectionThemeConfigEditor';
import FlatThemeConfigEditor from './FlatThemeConfigEditor';
import { loadThemeEditorData } from '../../utils/theme-editor-load';

const StoreThemeConfigEditorInner: React.FC = () => {
  const { themeId = '' } = useParams();
  const { activeStoreId } = useStore();
  const [configMode, setConfigMode] = useState<'sections' | 'flat' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const detectMode = useCallback(async () => {
    if (!themeId || !activeStoreId) {
      setLoading(false);
      setConfigMode(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const loaded = await loadThemeEditorData(themeId, activeStoreId);
      setConfigMode(loaded.configMode);
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { message?: string } } })?.response?.data;
      setError(data?.message || (err as Error)?.message || 'Failed to load theme editor');
      setConfigMode(null);
    } finally {
      setLoading(false);
    }
  }, [themeId, activeStoreId]);

  useEffect(() => {
    detectMode();
  }, [detectMode]);

  if (!activeStoreId) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-sm text-gray-600">Select a store first, then open the theme editor.</p>
        <Link to="/themes/all-themes" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline">
          ← Back to themes
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1e1e1e]">
        <div className="rounded-lg bg-white px-8 py-6 shadow-lg">
          <p className="text-sm text-gray-600">Loading theme editor…</p>
        </div>
      </div>
    );
  }

  if (error && !configMode) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-sm text-red-600">{error}</p>
        <Link to="/themes/all-themes" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          ← Back to themes
        </Link>
      </div>
    );
  }

  return configMode === 'sections' ? (
    <SectionThemeConfigEditor themeId={themeId} />
  ) : (
    <FlatThemeConfigEditor themeId={themeId} />
  );
};

const StoreThemeConfigEditor: React.FC = () => {
  return (
    <StoreThemeConfigProvider>
      <StoreThemeConfigEditorInner />
    </StoreThemeConfigProvider>
  );
};

export default StoreThemeConfigEditor;
