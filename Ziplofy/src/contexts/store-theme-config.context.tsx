import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import toast from 'react-hot-toast';

import { axiosi } from '../config/axios.config';

import { loadThemeEditorData, type ThemeEditorLoadResult } from '../utils/theme-editor-load';



export type StoreThemeConfigData = {

  storeId: string;

  themeId: string;

  themeName: string;

  themePath: string;

  configMode: 'sections' | 'flat';

  editorSchema: unknown;

  defaultConfig: Record<string, unknown> | null;

  manifest: Record<string, unknown> | null;

  storeOverrides: Record<string, unknown>;

  config: Record<string, unknown>;

  values: Record<string, string | boolean>;

  themeRuntime: { jsUrl: string | null; cssUrl: string | null };

  installed: boolean;

  canPersist: boolean;

  notice: string | null;

};



type ApiResponse = {

  success: boolean;

  message?: string;

  data?: StoreThemeConfigData & {

    schema?: unknown;

  };

};



function mapLoadResult(

  storeId: string,

  themeId: string,

  loaded: ThemeEditorLoadResult

): StoreThemeConfigData {

  return {

    storeId,

    themeId,

    themeName: loaded.themeName,

    themePath: loaded.themePath,

    configMode: loaded.configMode,

    editorSchema: loaded.editorSchema,

    defaultConfig: loaded.defaultConfig,

    manifest: loaded.manifest,

    storeOverrides: loaded.storeOverrides ?? {},

    config: loaded.config ?? loaded.defaultConfig ?? {},

    values: loaded.values,

    themeRuntime: {

      jsUrl: loaded.themeRuntime.jsUrl ?? null,

      cssUrl: loaded.themeRuntime.cssUrl ?? null,

    },

    installed: loaded.installed,

    canPersist: loaded.canPersist,

    notice: loaded.notice,

  };

}



function mapApiData(data: ApiResponse['data']): StoreThemeConfigData | null {

  if (!data) return null;

  return {

    storeId: data.storeId,

    themeId: data.themeId,

    themeName: data.themeName,

    themePath: data.themePath,

    configMode: data.configMode,

    editorSchema: data.editorSchema,

    defaultConfig: data.defaultConfig,

    manifest: data.manifest ?? null,

    storeOverrides: data.storeOverrides ?? {},

    config: data.config ?? {},

    values: data.values ?? {},

    themeRuntime: {

      jsUrl: data.themeRuntime?.jsUrl ?? null,

      cssUrl: data.themeRuntime?.cssUrl ?? null,

    },

    installed: Boolean(data.installed),

    canPersist: Boolean(data.canPersist),

    notice: data.notice ?? null,

  };

}



type StoreThemeConfigContextType = {

  data: StoreThemeConfigData | null;

  loading: boolean;

  saving: boolean;

  error: string | null;

  load: (storeId: string, themeId: string) => Promise<StoreThemeConfigData | null>;

  saveValues: (

    storeId: string,

    themeId: string,

    values: Record<string, string | boolean>

  ) => Promise<StoreThemeConfigData | null>;

};



const StoreThemeConfigContext = createContext<StoreThemeConfigContextType | undefined>(

  undefined

);



export const StoreThemeConfigProvider: React.FC<{ children: React.ReactNode }> = ({

  children,

}) => {

  const [data, setData] = useState<StoreThemeConfigData | null>(null);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);



  const load = useCallback(async (storeId: string, themeId: string) => {

    if (!storeId || !themeId) return null;

    setLoading(true);

    setError(null);

    try {

      const loaded = await loadThemeEditorData(themeId, storeId);

      const mapped = mapLoadResult(storeId, themeId, loaded);

      setData(mapped);

      return mapped;

    } catch (err: unknown) {

      const msg =

        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||

        (err as Error)?.message ||

        'Failed to load theme configuration';

      setError(msg);

      setData(null);

      return null;

    } finally {

      setLoading(false);

    }

  }, []);



  const saveValues = useCallback(

    async (storeId: string, themeId: string, values: Record<string, string | boolean>) => {

      if (!storeId || !themeId) return null;

      setSaving(true);

      setError(null);

      const toastId = toast.loading('Saving theme…');

      try {

        const { data: body } = await axiosi.put<ApiResponse>(

          `/store-theme-config/${storeId}/${themeId}`,

          { values }

        );

        if (!body?.success || !body.data) {

          throw new Error(body?.message || 'Save failed');

        }

        const mapped = mapApiData(body.data);

        if (!mapped) throw new Error('Save failed');

        setData(mapped);

        toast.success('Theme saved', { id: toastId });

        return mapped;

      } catch (err: unknown) {

        const msg =

          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||

          (err as Error)?.message ||

          'Failed to save theme';

        setError(msg);

        toast.error(msg, { id: toastId });

        return null;

      } finally {

        setSaving(false);

      }

    },

    []

  );



  const value = useMemo(

    () => ({ data, loading, saving, error, load, saveValues }),

    [data, loading, saving, error, load, saveValues]

  );



  return (

    <StoreThemeConfigContext.Provider value={value}>{children}</StoreThemeConfigContext.Provider>

  );

};



export function useStoreThemeConfig(): StoreThemeConfigContextType {

  const ctx = useContext(StoreThemeConfigContext);

  if (!ctx) {

    throw new Error('useStoreThemeConfig must be used within StoreThemeConfigProvider');

  }

  return ctx;

}


