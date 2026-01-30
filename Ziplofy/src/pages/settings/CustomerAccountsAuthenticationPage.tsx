import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeftIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
import ToggleSwitch from '../../components/ToggleSwitch';
import { useStore } from '../../contexts/store.context';
import { useCustomerAccountSettings } from '../../contexts/customer-account-settings.context';

const CustomerAccountsAuthenticationPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeStoreId } = useStore();
  const {
    settings,
    loading,
    error,
    fetchByStoreId,
    update,
  } = useCustomerAccountSettings();
  const [menuAnchor, setMenuAnchor] = useState<{ element: HTMLElement; id: string } | null>(null);
  const [shopEnabled, setShopEnabled] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeStoreId) {
      fetchByStoreId(activeStoreId).catch(() => {});
    }
  }, [activeStoreId, fetchByStoreId]);

  useEffect(() => {
    if (!settings) {
      setShopEnabled(true);
      setHasUnsavedChanges(false);
      return;
    }
    setShopEnabled(Boolean(settings.shopAuth?.enabled));
    setHasUnsavedChanges(false);
  }, [settings]);

  useEffect(() => {
    if (!settings) {
      setHasUnsavedChanges(false);
      return;
    }
    setHasUnsavedChanges(Boolean(settings.shopAuth?.enabled) !== shopEnabled);
  }, [shopEnabled, settings]);

  // Handle click outside menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        handleMenuClose();
      }
    };

    if (menuAnchor) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuAnchor]);

  const handleBack = () => {
    navigate('/settings/customer-accounts');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchor({ element: event.currentTarget, id });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleTurnOff = () => {
    setShopEnabled(false);
    handleMenuClose();
  };

  const handleTurnOn = () => {
    setShopEnabled(true);
    handleMenuClose();
  };

  const handleSave = async () => {
    if (!settings?._id) return;
    try {
      setSaving(true);
      await update(settings._id, {
        shopAuth: { enabled: shopEnabled },
      });
      setHasUnsavedChanges(false);
    } catch (err) {
      // handled by context
    } finally {
      setSaving(false);
    }
  };

  const isDisabled = loading || saving || !settings;

  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-medium text-gray-900">
              Authentication
            </h1>
          </div>
          {settings && (
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isDisabled}
              className="px-3 py-1.5 text-sm font-medium border border-gray-200 text-gray-700 min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>

        <p className="text-xs text-gray-600 mb-4">
          Manage sign-in options and account access
        </p>

        {error && (
          <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 mb-4 text-xs">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Sign-in options */}
          <div className="border border-gray-200 bg-white/95 p-4">
            <h2 className="text-sm font-medium text-gray-900 mb-4">
              Sign-in options
            </h2>

            <div className="flex items-center justify-between p-3 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 flex items-center justify-center">
                  <div
                    className={`w-4 h-4 border-2 border-white border-t-transparent border-r-transparent rounded-full ${
                      shopEnabled ? 'animate-spin' : ''
                    }`}
                  />
                </div>
                <p className="text-sm font-medium text-gray-900">Shop</p>
              </div>
              <div className="flex items-center gap-2">
                {shopEnabled ? (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                    On
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium border border-gray-200">
                    Off
                  </span>
                )}
                <div className="relative">
                  <button
                    ref={menuButtonRef}
                    onClick={(e) => handleMenuOpen(e, 'shop')}
                    className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={isDisabled}
                  >
                    <EllipsisHorizontalIcon className="w-4 h-4" />
                  </button>
                  {menuAnchor?.id === 'shop' && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 top-full mt-1 bg-white border border-gray-200 z-10 min-w-[120px]"
                    >
                      {shopEnabled ? (
                        <button
                          onClick={handleTurnOff}
                          disabled={isDisabled}
                          className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Turn off
                        </button>
                      ) : (
                        <button
                          onClick={handleTurnOn}
                          disabled={isDisabled}
                          className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Turn on
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Available connections */}
          <div className="border border-gray-200 bg-white/95 p-4">
            <h2 className="text-sm font-medium text-gray-900 mb-4">
              Available connections
            </h2>

            <div className="space-y-3">
              {/* Google */}
              <div className="flex items-center justify-between p-3 border border-gray-200">
                <div className="flex items-center gap-3">
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    className="w-5 h-5"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <p className="text-sm font-medium text-gray-900">Google</p>
                </div>
                <button
                  onClick={() => navigate('/settings/customer-accounts/authentication/google')}
                  className="px-3 py-1.5 text-xs font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Connect
                </button>
              </div>

              {/* Facebook */}
              <div className="flex items-center justify-between p-3 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    f
                  </div>
                  <p className="text-sm font-medium text-gray-900">Facebook</p>
                </div>
                <button
                  onClick={() => navigate('/settings/customer-accounts/authentication/facebook')}
                  className="px-3 py-1.5 text-xs font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default CustomerAccountsAuthenticationPage;
