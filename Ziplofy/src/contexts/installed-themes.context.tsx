import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { axiosi } from '../config/axios.config';

export interface PopulatedTheme {
  _id: string;
  name: string;
  description: string;
  category: string;
  plan?: string;
  price?: number;
  version?: string;
  tags?: string[];
  isActive?: boolean;
  downloads?: number;
  rating?: { average: number; count: number };
  uploadBy?: string;
  createdAt?: string;
  updatedAt?: string;
  thumbnailUrl?: string | null;
}

export interface InstalledThemeDoc {
  _id: string;
  installedThemeId?: string;
  storeId: string;
  themeId: PopulatedTheme;
  createdAt: string;
  updatedAt: string;
}

interface ApiListResponse {
  success: boolean;
  data: InstalledThemeDoc[];
}

interface ApiSingleResponse {
  success: boolean;
  data: InstalledThemeDoc;
}

interface InstalledThemesContextType {
  installedThemes: InstalledThemeDoc[];
  loading: boolean;
  error: string | null;
  fetchByStoreId: (storeId: string) => Promise<void>;
  installTheme: (storeId: string, themeId: string) => Promise<void>;
  applyTheme: (storeId: string, themeId: string) => Promise<void>;
  uninstallTheme: (installedThemeId: string) => Promise<void>;
}

const InstalledThemesContext = createContext<InstalledThemesContextType | undefined>(undefined);

export const InstalledThemesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [installedThemes, setInstalledThemes] = useState<InstalledThemeDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchByStoreId = useCallback(async (storeId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Pass both userId and storeId to ensure backend checks both directories
      // Add cache-busting parameter to ensure fresh data
      const { data } = await axiosi.get(`/themes/installed?userId=${storeId}&storeId=${storeId}&_t=${Date.now()}`);
      setInstalledThemes(data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch installed themes');
      setInstalledThemes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const installTheme = useCallback(async (storeId: string, themeId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosi.post(`/themes/install`, { storeId, themeId });
      if (data.success) {
        // IMPORTANT: Clear any custom theme from localStorage since we're installing a regular theme
        // This ensures only one theme (regular or custom) is active at a time
        localStorage.removeItem('ziplofy.appliedCustomThemeId');
        localStorage.removeItem('ziplofy.appliedCustomThemeStoreId');
        // Wait a moment for backend to complete cleanup (delete custom theme directories)
        await new Promise(resolve => setTimeout(resolve, 500));
        // Refresh the installed themes list
        await fetchByStoreId(storeId);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to install theme');
    } finally {
      setLoading(false);
    }
  }, [fetchByStoreId]);

  const uninstallTheme = useCallback(async (installedThemeId: string) => {
    setLoading(true);
    setError(null);
    try {
      await axiosi.delete(`/themes/uninstall`, { data: { installedThemeId } });
      setInstalledThemes(prev => prev.filter(it => it.installedThemeId !== installedThemeId));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to uninstall theme');
    } finally {
      setLoading(false);
    }
  }, []);

  const applyTheme = useCallback(async (storeId: string, themeId: string) => {
    setLoading(true);
    setError(null);
    try {
      await axiosi.post(`/themes/apply`, { storeId, themeId });
      await fetchByStoreId(storeId);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to apply theme');
    } finally {
      setLoading(false);
    }
  }, [fetchByStoreId]);

  const value: InstalledThemesContextType = useMemo(() => ({
    installedThemes,
    loading,
    error,
    fetchByStoreId,
    installTheme,
    applyTheme,
    uninstallTheme,
  }), [installedThemes, loading, error, fetchByStoreId, installTheme, applyTheme, uninstallTheme]);

  return (
    <InstalledThemesContext.Provider value={value}>
      {children}
    </InstalledThemesContext.Provider>
  );
};

export function useInstalledThemes(): InstalledThemesContextType {
  const ctx = useContext(InstalledThemesContext);
  if (!ctx) throw new Error('useInstalledThemes must be used within InstalledThemesProvider');
  return ctx;
}


