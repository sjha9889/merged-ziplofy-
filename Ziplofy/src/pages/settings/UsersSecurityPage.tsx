import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ClipboardDocumentIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
import { useStore } from '../../contexts/store.context';
import { useStoreSecuritySettings } from '../../contexts/store-security-settings.context';

const UsersSecurityPage: React.FC = () => {
  const { stores, activeStoreId } = useStore();
  const { settings, loading, fetchByStoreId, update, generateNewCode } = useStoreSecuritySettings();
  const activeStore = useMemo(
    () => stores.find((store) => store._id === activeStoreId),
    [stores, activeStoreId]
  );

  const [requireCode, setRequireCode] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [generatingCode, setGeneratingCode] = useState<boolean>(false);

  // Fetch security settings on mount
  useEffect(() => {
    if (activeStoreId) {
      fetchByStoreId(activeStoreId).catch(() => {
        // Error already handled in context
      });
    }
  }, [activeStoreId, fetchByStoreId]);

  // Update local state when settings are fetched
  useEffect(() => {
    if (settings) {
      setRequireCode(settings.requireCode);
    } else {
      setRequireCode(false);
    }
  }, [settings]);

  const handleCopySecurityCode = useCallback(() => {
    if (!settings?.securityCode) {
      toast.dismiss();
      toast.error('No security code to copy');
      return;
    }
    navigator.clipboard
      .writeText(settings.securityCode)
      .then(() => {
        toast.dismiss();
        toast.success('Security code copied');
      })
      .catch(() => {
        toast.dismiss();
        toast.error('Failed to copy code');
      });
  }, [settings]);

  const handleGenerateNewSecurityCode = useCallback(async () => {
    if (!settings?._id) {
      toast.dismiss();
      toast.error('Settings not available');
      return;
    }
    setGeneratingCode(true);
    try {
      await generateNewCode(settings._id);
      toast.dismiss();
      toast.success('New security code generated successfully');
    } catch (err: any) {
      const msg = err?.message || 'Failed to generate new security code';
      toast.dismiss();
      toast.error(msg);
    } finally {
      setGeneratingCode(false);
    }
  }, [settings, generateNewCode]);

  const handleDisableRequireCode = useCallback(async () => {
    if (!activeStoreId || !settings) {
      toast.dismiss();
      toast.error('Settings not available');
      return;
    }

    setUpdating(true);
    try {
      await update(settings._id, {
        requireCode: false,
      });
      toast.dismiss();
      toast.success('Security code requirement disabled');
      setRequireCode(false);
    } catch (err: any) {
      const msg = err?.message || 'Failed to disable security code requirement';
      toast.dismiss();
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  }, [activeStoreId, settings, update]);

  const handleRequireCodeButton = useCallback(async () => {
    if (!activeStoreId || !settings) {
      toast.dismiss();
      toast.error('Settings not available');
      return;
    }

    setUpdating(true);
    try {
      await update(settings._id, {
        requireCode: true,
      });
      toast.dismiss();
      toast.success('Security code requirement enabled');
      setRequireCode(true);
    } catch (err: any) {
      const msg = err?.message || 'Failed to enable security code requirement';
      toast.dismiss();
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  }, [activeStoreId, settings, update]);

  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-4">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          </div>
        )}

        {/* Collaborators Section */}
        {!loading && settings && (
          <div className="border border-gray-200 bg-white p-4">
            <h2 className="text-base font-medium text-gray-900 mb-1">Collaborators</h2>
            <p className="text-xs text-gray-600 mb-3">
              Give designers, developers, and marketers access to this store. Collaborators don't count toward your staff limit.
              Learn more about{' '}
              <a href="#" className="text-gray-700 hover:underline">
                collaborators
              </a>
              .
            </p>

            {/* When requireCode is false */}
            {!settings.requireCode && (
              <div className="border border-gray-200 p-3 bg-gray-50">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">
                      Anyone can send a collaborator request for {activeStore?.storeName || 'My Store'}. A code is not required.
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      You'll still need to review and approve this request from{' '}
                      <a href="#" className="text-gray-700 hover:underline">
                        Users
                      </a>
                      .
                    </p>
                  </div>
                  <button
                    onClick={handleRequireCodeButton}
                    disabled={updating}
                    className="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    Require code
                  </button>
                </div>
              </div>
            )}

            {/* When requireCode is true */}
            {settings.requireCode && (
              <div className="border border-gray-200 p-3 bg-gray-50">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 uppercase tracking-wide">My Store</p>
                    <p className="text-sm font-medium text-gray-900">
                      {activeStore?.storeName || 'My Store'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Share this code to allow someone to send you a collaborator request for this store. You'll still need to
                      review and approve this request from{' '}
                      <a href="#" className="text-gray-700 hover:underline">
                        Users
                      </a>
                      .
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {settings.securityCode && (
                      <button
                        onClick={handleCopySecurityCode}
                        className="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors font-mono font-medium"
                      >
                        <span className="flex items-center gap-1.5">
                          <ClipboardDocumentIcon className="w-4 h-4" />
                          {settings.securityCode}
                        </span>
                      </button>
                    )}
                    <button
                      onClick={handleGenerateNewSecurityCode}
                      disabled={generatingCode}
                      className="px-3 py-1.5 text-sm text-white bg-gray-900 hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {generatingCode ? (
                        <span className="flex items-center gap-1.5">
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Generating...
                        </span>
                      ) : (
                        'Generate new code'
                      )}
                    </button>
                    <button
                      onClick={handleDisableRequireCode}
                      disabled={updating}
                      className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </GridBackgroundWrapper>
  );
};

export default UsersSecurityPage;
