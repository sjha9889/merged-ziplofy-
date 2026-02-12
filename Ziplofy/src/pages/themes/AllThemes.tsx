import {
  Download as DownloadIcon,
  Visibility as EyeIcon,
  FilterList as FilterIcon,
  GridView as GridIcon,
  ViewList as ListIcon,
  Search as SearchIcon,
  Star as StarIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useThemes } from "../../contexts/themes.context";
import { useInstalledThemes } from "../../contexts/installed-themes.context";
import { useStore } from "../../contexts/store.context";
import { useCustomThemes } from "../../contexts/custom-themes.context";
import ThemePreviewModal from "../../components/ThemePreviewModal";
import ThemeEditChoiceModal from "../../components/ThemeEditChoiceModal";
import { axiosi } from "../../config/axios.config";
import "./AllThemes.css";

interface Theme {
  _id: string;
  name: string;
  description: string;
  category: string;
  thumbnailUrl: string;
}

const AllThemes: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    themeId: string;
    themeName: string;
    isInstalled?: boolean;
    isCustomTheme?: boolean;
  }>({
    isOpen: false,
    themeId: "",
    themeName: "",
    isInstalled: false,
    isCustomTheme: false,
  });
  const [editChoice, setEditChoice] = useState<{ isOpen: boolean; themeId: string; isInstalled?: boolean }>({
    isOpen: false,
    themeId: "",
    isInstalled: false,
  });
  const { themes, loading: themesLoading, error: themesError, fetchAll } = useThemes();
  const { installedThemes, installTheme, uninstallTheme, fetchByStoreId } = useInstalledThemes();
  const { activeStoreId } = useStore();
  const { customThemes, loading: customThemesLoading, fetchAll: fetchCustomThemes, deleteTheme: deleteCustomTheme, installTheme: installCustomTheme, uninstallTheme: uninstallCustomTheme, updateTheme } = useCustomThemes();
  const [recentInstallations, setRecentInstallations] = useState<any[]>([]);
  const [loadingRecent, setLoadingRecent] = useState<boolean>(false);
  const [selectionMode, setSelectionMode] = useState<boolean>(false);
  const [selectedRecentIds, setSelectedRecentIds] = useState<Set<string>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [thumbnailUpdateModal, setThumbnailUpdateModal] = useState<{
    isOpen: boolean;
    themeId: string;
    themeName: string;
  }>({
    isOpen: false,
    themeId: "",
    themeName: "",
  });
  const [uploadingThumbnail, setUploadingThumbnail] = useState<boolean>(false);
  const [thumbnailPreviews, setThumbnailPreviews] = useState<Record<string, string>>({});

  const handleUninstall = async (installedThemeId: string) => {
    await uninstallTheme(installedThemeId);
  };

  const handleInstallClick = async (themeId: string) => {
    if (!activeStoreId) return;
    await installTheme(activeStoreId, themeId);
    // Refresh recent installations after installing
    setTimeout(() => {
      fetchRecentInstallations();
    }, 500);
  };

  const handlePreviewClick = (themeId: string, themeName: string, isInstalled: boolean = false, isCustomTheme: boolean = false) => {
    setPreviewModal({
      isOpen: true,
      themeId,
      themeName,
      isInstalled,
      isCustomTheme,
    });
  };

  const handleClosePreview = () => {
    setPreviewModal({
      isOpen: false,
      themeId: "",
      themeName: "",
      isInstalled: false,
      isCustomTheme: false,
    });
  };

  // Resolve installed theme URL - prioritizes store-specific, then user-specific, then default
  const resolveInstalledThemeUrl = (themeId: string): string => {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const cacheBuster = `?v=${Date.now()}`;
    
    // Get userId from JWT token if available
    const getUserIdFromToken = (): string | null => {
      try {
        const token = localStorage.getItem('accessToken') || 
                     sessionStorage.getItem('accessToken') ||
                     localStorage.getItem('token') ||
                     sessionStorage.getItem('token');
        if (!token) return null;
        
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        return String(payload.uid || payload.userId || payload.id || '');
      } catch {
        return null;
      }
    };

    const userId = getUserIdFromToken();
    
    // Priority 1: Store-specific installed theme (if activeStoreId is available)
    if (activeStoreId) {
      return `${apiBase}/themes/installed/${activeStoreId}/${themeId}/unzippedTheme/index.html${cacheBuster}`;
    }
    
    // Priority 2: User-specific installed theme (if userId is available)
    if (userId) {
      return `${apiBase}/themes/installed/${userId}/${themeId}/unzippedTheme/index.html${cacheBuster}`;
    }
    
    // Priority 3: Fall back to default preview
    return `${apiBase}/themes/preview/${themeId}${cacheBuster}`;
  };

  const handleOpenTheme = (themeId: string, isCustomTheme: boolean = false) => {
    let themeUrl: string;
    if (isCustomTheme) {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const cacheBuster = `?v=${Date.now()}`;
      
      // Check if it's in installed format (custom-{customThemeId})
      if (themeId.startsWith('custom-')) {
        // For installed custom themes, use the installed theme endpoint
        const getUserIdFromToken = (): string | null => {
          try {
            const token = localStorage.getItem('accessToken') || 
                         sessionStorage.getItem('accessToken') ||
                         localStorage.getItem('token') ||
                         sessionStorage.getItem('token');
            if (!token) return null;
            
            const parts = token.split('.');
            if (parts.length < 2) return null;
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
            return String(payload.uid || payload.userId || payload.id || '');
          } catch {
            return null;
          }
        };

        const userId = getUserIdFromToken();
        
        // Priority 1: Store-specific installed theme (if activeStoreId is available)
        if (activeStoreId) {
          themeUrl = `${apiBase}/themes/installed/${activeStoreId}/${themeId}/unzippedTheme/index.html${cacheBuster}`;
        } else if (userId) {
          // Priority 2: User-specific installed theme
          themeUrl = `${apiBase}/themes/installed/${userId}/${themeId}/unzippedTheme/index.html${cacheBuster}`;
        } else {
          // Fallback: try to extract actual custom theme ID
          const actualCustomThemeId = themeId.replace(/^custom-/, '');
          themeUrl = `${apiBase}/custom-themes/${actualCustomThemeId}/files/index.html${cacheBuster}`;
        }
      } else {
        // Direct custom theme (not installed), use custom theme file serving route
        themeUrl = `${apiBase}/custom-themes/${themeId}/files/index.html${cacheBuster}`;
      }
    } else {
      themeUrl = resolveInstalledThemeUrl(themeId);
    }
    window.open(themeUrl, '_blank', 'noopener,noreferrer');
  };

  const handleEditTheme = (themeId: string, isInstalled: boolean = false) => {
    setEditChoice({ isOpen: true, themeId, isInstalled });
  };

  // Handle thumbnail update
  const handleUpdateThumbnail = async (themeId: string, thumbnailFile: File) => {
    setUploadingThumbnail(true);
    let previewUrl: string | null = null;
    
    try {
      // Create a preview URL for immediate UI update
      previewUrl = URL.createObjectURL(thumbnailFile);
      
      // Update local preview state immediately for instant UI feedback
      setThumbnailPreviews(prev => ({
        ...prev,
        [themeId]: previewUrl!
      }));
      
      // Fetch current theme data using authenticated axios
      const response = await axiosi.get(`/custom-themes/${themeId}`);
      
      if (!response.data.success || !response.data.data) {
        throw new Error('Theme not found');
      }
      
      const theme = response.data.data;
      
      // Convert file to blob
      const thumbnailBlob = new Blob([thumbnailFile], { type: thumbnailFile.type });
      
      // Update theme with new thumbnail
      const updated = await updateTheme(themeId, theme.name, theme.html || '', theme.css || '', thumbnailBlob);
      
      if (updated) {
        // Force refresh the custom themes list with cache buster
        await fetchCustomThemes();
        
        // Wait a bit for the server to process the thumbnail
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log("this is the domain section");
        
        // Remove preview after server thumbnail is loaded
        setTimeout(() => {
          setThumbnailPreviews(prev => {
            const newPreviews = { ...prev };
            delete newPreviews[themeId];
            return newPreviews;
          });
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
          }
        }, 1000);
        
        setThumbnailUpdateModal({ isOpen: false, themeId: "", themeName: "" });
        setOpenMenuId(null);
      } else {
        // Remove preview on error
        setThumbnailPreviews(prev => {
          const newPreviews = { ...prev };
          delete newPreviews[themeId];
          return newPreviews;
        });
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        alert('Failed to update thumbnail. Please try again.');
      }
    } catch (error: any) {
      console.error('Error updating thumbnail:', error);
      // Remove preview on error
      setThumbnailPreviews(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[themeId];
        return newPreviews;
      });
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update thumbnail. Please try again.';
      alert(errorMessage);
    } finally {
      setUploadingThumbnail(false);
    }
  };

  // Handle file input change for thumbnail
  const handleThumbnailFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB.');
      return;
    }
    
    // Update thumbnail
    if (thumbnailUpdateModal.themeId) {
      handleUpdateThumbnail(thumbnailUpdateModal.themeId, file);
    }
    
    // Reset input
    event.target.value = '';
  };

  // Delete custom theme
  const handleDeleteCustomTheme = async (themeId: string) => {
    // Validate that the theme ID is a valid MongoDB ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(themeId);
    if (!isValidObjectId) {
      alert('Invalid theme ID. This theme may have been created with an old format. It cannot be deleted through the API.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this theme? This action cannot be undone.')) {
      return;
    }

    const success = await deleteCustomTheme(themeId);
    if (success) {
      // If this was the applied theme, clear it
      const appliedThemeId = localStorage.getItem('ziplofy.appliedCustomThemeId');
      if (appliedThemeId === themeId) {
        localStorage.removeItem('ziplofy.appliedCustomThemeId');
      }
    } else {
      alert('Failed to delete theme. Please try again.');
    }
  };

  // Check if a theme is installed
  const isThemeInstalled = (themeId: string) => {
    return installedThemes.some(installedTheme => installedTheme._id === themeId);
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Fetch recent installations
  const fetchRecentInstallations = async () => {
    setLoadingRecent(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiBase}/themes/recent`);
      if (response.ok) {
        const data = await response.json();
        setRecentInstallations(data || []);
      }
    } catch (error) {
      console.error('Error fetching recent installations:', error);
      setRecentInstallations([]);
    } finally {
      setLoadingRecent(false);
    }
  };

  useEffect(() => {
    fetchRecentInstallations();
  }, []);

  // Handle delete selected recent installations
  const handleDeleteSelectedRecent = async () => {
    if (selectedRecentIds.size === 0) {
      alert('Please select at least one theme to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedRecentIds.size} theme(s) from history?`)) {
      return;
    }

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiBase}/themes/recent/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ themeIds: Array.from(selectedRecentIds) }),
      });

      if (response.ok) {
        // Remove deleted items from state
        setRecentInstallations(prev => prev.filter(rt => {
          const idToCheck = rt.recentId || rt._id;
          return !selectedRecentIds.has(idToCheck);
        }));
        setSelectedRecentIds(new Set());
        setSelectionMode(false);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete themes from history');
      }
    } catch (error) {
      console.error('Error deleting recent installations:', error);
      alert('Failed to delete themes from history');
    }
  };

  useEffect(() => {
    if (activeStoreId) {
      fetchByStoreId(activeStoreId);
    }
  }, [activeStoreId, fetchByStoreId]);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !(event.target as Element).closest('.theme-card-menu')) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openMenuId]);

  // Clear previews when themes are refreshed from server
  useEffect(() => {
    // Keep previews only for themes that are still being uploaded
    // This ensures server thumbnails are shown after upload completes
    if (customThemes.length > 0 && Object.keys(thumbnailPreviews).length > 0) {
      // Don't clear immediately - let the timeout in handleUpdateThumbnail handle it
      // This allows smooth transition from preview to server thumbnail
    }
  }, [customThemes]);

  // Load custom themes from API
  useEffect(() => {
    fetchCustomThemes();
    
    // Clean up invalid theme IDs from localStorage
    const appliedThemeId = localStorage.getItem('ziplofy.appliedCustomThemeId');
    if (appliedThemeId) {
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(appliedThemeId);
      if (!isValidObjectId) {
        // Remove invalid ID (likely old UUID format from localStorage)
        localStorage.removeItem('ziplofy.appliedCustomThemeId');
        console.warn('Removed invalid custom theme ID from localStorage');
      }
    }
  }, [fetchCustomThemes]);

  const filteredThemes = themes.filter(
    (theme) =>
      theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (theme.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-page-background-color">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-4">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Themes</h1>
          <p className="text-sm text-gray-600 mt-1">
            Discover professionally designed themes to make your store stand out
          </p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full sm:w-auto">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search themes..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <FilterIcon fontSize="small" />
                <span>Filter</span>
              </button>

              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className={`p-2 transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <GridIcon fontSize="small" />
                </button>
                <button
                  className={`p-2 transition-colors ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <ListIcon fontSize="small" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Installed Themes - Section 1 */}
        {Array.isArray(installedThemes) && installedThemes.length > 0 && (
          <React.Fragment>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Installed themes</h2>
          <div className={`themes-layout ${viewMode} themes-section-body`}>
            {installedThemes.map((it: any) => {
              const t = it; // The theme data is directly in it, not nested under themeId
              const isCustomTheme = t.isCustomTheme || t._id?.startsWith('custom-');
              const actualThemeId = isCustomTheme && t.customThemeId ? t.customThemeId : t._id;
              
              return (
              <div key={it._id} className="theme-card">
                <div className="theme-thumbnail">
                  {t.thumbnailUrl ? (
                    <img
                      src={t.thumbnailUrl}
                      alt={t.name || ''}
                      className="theme-image"
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        e.currentTarget.src =
                          'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23f3f4f6"/><text x="150" y="100" text-anchor="middle" fill="%236b7280" font-family="Arial" font-size="14">No Preview</text></svg>';
                      }}
                    />
                  ) : (
                    <div className="theme-image-placeholder">
                      <span>No Preview</span>
                    </div>
                  )}
                  <div className="theme-overlay">
                    <button 
                      className="overlay-btn preview-btn"
                      onClick={() => handlePreviewClick(t._id, t.name, true, isCustomTheme)}
                    >
                      <EyeIcon fontSize="small" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>

                <div className="theme-info">
                  <div className="theme-header-info">
                    <h3 className="theme-name">{t.name}</h3>
                    <div className="theme-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} fontSize="inherit" className="star filled" />
                        ))}
                      </div>
                      <span className="rating-text">{Number((t as any).rating?.average || 0).toFixed(1)}</span>
                    </div>
                  </div>

                  {t.description && <p className="theme-description">{t.description}</p>}

                  <div className="theme-meta">
                    <span className="theme-category">{t.category}</span>
                    <span className="theme-price">Free</span>
                  </div>

                  <div className="theme-actions">
                    <button 
                      className="action-btn primary" 
                      onClick={() => handleOpenTheme(t._id, isCustomTheme)}
                    >
                      Open
                    </button>
                    {isCustomTheme ? (
                      <button 
                        className="action-btn secondary" 
                        onClick={() => {
                          if (actualThemeId) {
                            window.open(`/themes/builder?themeId=${actualThemeId}`, '_blank', 'noopener,noreferrer');
                          }
                        }}
                      >
                        Edit
                      </button>
                    ) : (
                    <button 
                      className="action-btn secondary" 
                      onClick={() => handleEditTheme(t._id, true)}
                    >
                      Edit
                    </button>
                    )}
                    <button 
                      className="action-btn secondary" 
                      onClick={isCustomTheme ? async () => {
                        if (!activeStoreId) {
                          alert('Please select a store first.');
                          return;
                        }
                        // Uninstall custom theme (deletes installation directory)
                        // Confirmation dialog and toast notification removed per user request
                        const success = await uninstallCustomTheme(actualThemeId, activeStoreId);
                        if (success) {
                          // Refresh the list
                          await fetchByStoreId(activeStoreId);
                        }
                      } : () => handleUninstall(it.installedThemeId)}
                    >
                      Uninstall
                    </button>
                  </div>
                </div>
              </div>
            );})}
          </div>
          </React.Fragment>
        )}

        {/* Recent Installations - Section 2 */}
        {recentInstallations.length > 0 && (
          <React.Fragment>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Recently Installed</h2>
              <div className="flex items-center gap-3">
                {selectionMode && (
                  <button
                    onClick={() => {
                      setSelectionMode(false);
                      setSelectedRecentIds(new Set());
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => {
                    if (selectionMode) {
                      handleDeleteSelectedRecent();
                    } else {
                      setSelectionMode(true);
                    }
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectionMode
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {selectionMode ? 'Delete Selected' : 'Delete Selected'}
                </button>
              </div>
            </div>
          {selectionMode && (
            <div className="themes-selection-hint">
              Select themes to delete from history
            </div>
          )}
          <div className={`themes-layout ${viewMode} themes-section-body`}>
            {recentInstallations.map((rt: any) => {
              const isCustomTheme = rt.isCustomTheme || rt._id?.startsWith('custom-');
              const actualThemeId = isCustomTheme && rt.customThemeId ? rt.customThemeId : rt._id;
              
              return (
                <div key={rt._id} className="theme-card" style={{ position: 'relative' }}>
                  {selectionMode && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      zIndex: 10,
                    }}>
                      <input
                        type="checkbox"
                        checked={selectedRecentIds.has(rt.recentId || rt._id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedRecentIds);
                          const idToUse = rt.recentId || rt._id;
                          if (e.target.checked) {
                            newSelected.add(idToUse);
                          } else {
                            newSelected.delete(idToUse);
                          }
                          setSelectedRecentIds(newSelected);
                        }}
                        style={{
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          accentColor: '#16a34a',
                        }}
                      />
                    </div>
                  )}
                  <div className="theme-thumbnail">
                    {rt.thumbnailUrl ? (
                      <img
                        src={rt.thumbnailUrl}
                        alt={rt.name || ''}
                        className="theme-image"
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          e.currentTarget.src =
                            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23f3f4f6"/><text x="150" y="100" text-anchor="middle" fill="%236b7280" font-family="Arial" font-size="14">No Preview</text></svg>';
                        }}
                      />
                    ) : (
                      <div className="theme-image-placeholder">
                        <span>{rt.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="theme-info">
                    <div className="theme-header-info">
                      <h3 className="theme-name">{rt.name}</h3>
                      <div className="theme-rating">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} fontSize="inherit" className="star filled" />
                          ))}
                        </div>
                        <span className="rating-text">0.0</span>
                      </div>
                    </div>

                    {rt.description && <p className="theme-description">{rt.description}</p>}

                    <div className="theme-meta">
                      <span className="theme-category">{rt.category || 'Custom'}</span>
                      <span className="theme-price">Free</span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Your Creations (Custom Themes) - Section 3 */}
      <div className="themes-section-actions">
        <h2 className="themes-section-title themes-section-title--inline">Your creations</h2>
        <button
          onClick={() => window.open('/themes/builder', '_blank', 'noopener,noreferrer')}
          className="themes-btn-primary"
        >
          <span>✨</span>
          <span>Create your Own</span>
        </button>
      </div>

        {/* Custom Themes (saved locally) */}
        {customThemes.length > 0 && (
          <React.Fragment>
            <h2 className="text-base font-semibold text-gray-900 mb-4 mt-6">Custom Themes</h2>
        <>
          <div className={`themes-layout ${viewMode} themes-section-body`}>
            {customThemes.map((ct) => {
              // Validate that the theme ID is a valid MongoDB ObjectId
              const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(ct._id);
              // Check if this custom theme is already installed
              const isInstalled = installedThemes.some((it: any) => {
                const isCustomTheme = it.isCustomTheme || it._id?.startsWith('custom-');
                const actualThemeId = isCustomTheme && it.customThemeId ? it.customThemeId : null;
                return isCustomTheme && actualThemeId === ct._id;
              });
              
              return (
              <div key={ct._id} className="theme-card" style={{ position: 'relative' }}>
                {/* 3-dots menu button */}
                {isValidObjectId && (
                  <div className="theme-card-menu">
                    <button
                      className="theme-card-menu-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === ct._id ? null : ct._id);
                      }}
                      aria-label="Theme options"
                    >
                      <MoreVertIcon fontSize="small" />
                    </button>
                    {openMenuId === ct._id && (
                      <>
                        <div 
                          className="theme-card-menu-overlay"
                          onClick={() => setOpenMenuId(null)}
                        />
                        <div className="theme-card-menu-dropdown">
                          <button
                            className="theme-card-menu-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              setThumbnailUpdateModal({
                                isOpen: true,
                                themeId: ct._id,
                                themeName: ct.name,
                              });
                              setOpenMenuId(null);
                            }}
                          >
                            <ImageIcon fontSize="small" style={{ marginRight: '8px' }} />
                            Update Thumbnail
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
                <div className="theme-thumbnail">
                  {(() => {
                    // Use preview if available, otherwise use server thumbnail with cache buster
                    const previewUrl = thumbnailPreviews[ct._id];
                    const serverThumbnailUrl = (ct as any).thumbnailUrl;
                    // Add cache buster only for server thumbnails, not previews
                    const thumbnailUrl = previewUrl || (serverThumbnailUrl ? `${serverThumbnailUrl}${serverThumbnailUrl.includes('?') ? '&' : '?'}v=${Date.now()}` : null);
                    
                    return thumbnailUrl ? (
                      <img
                        key={`${ct._id}-${previewUrl ? 'preview' : 'server'}`} // Force re-render when switching between preview and server
                        src={thumbnailUrl}
                        alt={ct.name || ''}
                        className="theme-image"
                        onLoad={() => {
                          // Image loaded successfully
                        }}
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          e.currentTarget.style.display = 'none';
                          const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                    ) : null;
                  })()}
                  <div className="theme-image-placeholder" style={{ display: (thumbnailPreviews[ct._id] || (ct as any).thumbnailUrl) ? 'none' : 'flex' }}>
                    <span>{ct.name}</span>
                  </div>
                  {isValidObjectId && (
                    <div className="theme-overlay">
                      <button 
                        className="overlay-btn preview-btn"
                        onClick={() => handlePreviewClick(ct._id, ct.name, false, true)}
                      >
                        <EyeIcon fontSize="small" />
                        <span>Preview</span>
                      </button>
                    </div>
                  )}
                </div>
                <div className="theme-info">
                  <div className="theme-header-info">
                    <h3 className="theme-name">{ct.name}</h3>
                  </div>
                  <div className="theme-actions">
                    <button
                      className="action-btn primary"
                      onClick={() => {
                        if (!isValidObjectId) {
                          alert('Invalid theme ID. This theme may have been created with an old format. Please delete and recreate it.');
                          return;
                        }
                        window.open(`/themes/builder?id=${encodeURIComponent(ct._id)}`, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      Edit
                    </button>
                    {isInstalled ? (
                      <button
                        className="action-btn secondary"
                        disabled
                        style={{
                          backgroundColor: '#16a34a',
                          color: '#ffffff',
                          border: '1px solid #16a34a',
                          cursor: 'not-allowed',
                          opacity: 0.9,
                        }}
                      >
                        Installed
                      </button>
                    ) : (
                      <button
                        className="action-btn secondary"
                        onClick={async () => {
                          if (!isValidObjectId) {
                            alert('Invalid theme ID. Please recreate this theme.');
                            return;
                          }
                          if (!activeStoreId) {
                            alert('Please select a store first.');
                            return;
                          }
                          // Install custom theme (copies files to store directory)
                          const success = await installCustomTheme(ct._id, activeStoreId);
                          if (success) {
                            // Wait a moment for file system to sync
                            await new Promise(resolve => setTimeout(resolve, 500));
                            // Refresh installed themes list
                            await fetchByStoreId(activeStoreId);
                            // Refresh recent installations
                            fetchRecentInstallations();
                            // Toast notification is already shown by installCustomTheme
                          }
                        }}
                      >
                        Apply theme
                      </button>
                    )}
                    <button
                      className="action-btn secondary"
                      onClick={() => handleDeleteCustomTheme(ct._id)}
                      style={{
                        backgroundColor: '#dc2626',
                        color: '#ffffff',
                        border: '1px solid #dc2626',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#b91c1c';
                        e.currentTarget.style.borderColor = '#b91c1c';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc2626';
                        e.currentTarget.style.borderColor = '#dc2626';
                      }}
                    >
                      <DeleteIcon fontSize="small" style={{ marginRight: '4px' }} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </>
          </React.Fragment>
        )}

        {/* All Themes - Section 4 */}
        <h2 className="text-base font-semibold text-gray-900 mb-4 mt-6">All themes</h2>
      <div className={`themes-layout ${viewMode}`}>
        {themesLoading && (
          <div className="no-results"><div className="no-results-content"><h3>Loading themes...</h3></div></div>
        )}
        {themesError && (
          <div className="no-results"><div className="no-results-content"><h3>{themesError}</h3></div></div>
        )}
        {filteredThemes.map((theme) => (
          <div key={theme._id} className="theme-card">
            <div className="theme-thumbnail">
              <img
                src={theme.thumbnailUrl || ''}
                alt={theme.name}
                className="theme-image"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.src =
                    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23f3f4f6"/><text x="150" y="100" text-anchor="middle" fill="%236b7280" font-family="Arial" font-size="14">No Preview</text></svg>';
                }}
              />
              <div className="theme-overlay">
                <button 
                  className="overlay-btn preview-btn"
                  onClick={() => handlePreviewClick(theme._id, theme.name)}
                >
                  <EyeIcon fontSize="small" />
                  <span>Preview</span>
                </button>
                <button className="overlay-btn download-btn">
                  <DownloadIcon fontSize="small" />
                  <span>View Details</span>
                </button>
              </div>
            </div>

            <div className="theme-info">
              <div className="theme-header-info">
                <h3 className="theme-name">{theme.name}</h3>
                <div className="theme-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} fontSize="inherit" className="star filled" />
                    ))}
                  </div>
                  <span className="rating-text">{Number((theme as any).rating?.average || 0).toFixed(1)}</span>
                </div>
              </div>

              {theme.description && <p className="theme-description">{theme.description}</p>}

              <div className="theme-meta">
                <span className="theme-category">{theme.category}</span>
                <span className="theme-price">Free</span>
              </div>

              <div className="theme-actions">
                {isThemeInstalled(theme._id) ? (
                  <button className="action-btn installed" disabled>
                    Installed
                  </button>
                ) : (
                  <button 
                    className="action-btn primary"
                    onClick={() => handleInstallClick(theme._id)}
                  >
                    Try theme
                  </button>
                )}
                <button 
                  className="action-btn secondary"
                  onClick={() => handlePreviewClick(theme._id, theme.name)}
                >
                  View demo
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredThemes.length === 0 && (
        <div className="no-results">
          <div className="no-results-content">
            <h3>No themes found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        </div>
      )}

      {/* Theme Preview Modal */}
      <ThemePreviewModal
        isOpen={previewModal.isOpen}
        onClose={handleClosePreview}
        themeId={previewModal.themeId}
        themeName={previewModal.themeName}
        isInstalled={previewModal.isInstalled}
        isCustomTheme={previewModal.isCustomTheme}
      />
      <ThemeEditChoiceModal
        isOpen={editChoice.isOpen}
        onClose={() => setEditChoice({ isOpen: false, themeId: "" })}
        themeId={editChoice.themeId}
      />

      {/* Thumbnail Update Modal */}
      {thumbnailUpdateModal.isOpen && (
        <div className="thumbnail-update-modal-overlay" onClick={() => !uploadingThumbnail && setThumbnailUpdateModal({ isOpen: false, themeId: "", themeName: "" })}>
          <div className="thumbnail-update-modal" onClick={(e) => e.stopPropagation()}>
            <div className="thumbnail-update-modal-header">
              <h2>Update Thumbnail</h2>
              <button
                className="thumbnail-update-modal-close"
                onClick={() => !uploadingThumbnail && setThumbnailUpdateModal({ isOpen: false, themeId: "", themeName: "" })}
                disabled={uploadingThumbnail}
              >
                ×
              </button>
            </div>
            <div className="thumbnail-update-modal-content">
              <p>Select an image to update the thumbnail for <strong>{thumbnailUpdateModal.themeName}</strong></p>
              <div className="thumbnail-update-modal-upload">
                <input
                  type="file"
                  id="thumbnail-upload-input"
                  accept="image/*"
                  onChange={handleThumbnailFileChange}
                  disabled={uploadingThumbnail}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="thumbnail-upload-input"
                  className={`thumbnail-upload-label ${uploadingThumbnail ? 'disabled' : ''}`}
                >
                  {uploadingThumbnail ? (
                    <>
                      <div className="thumbnail-upload-spinner"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon fontSize="large" />
                      <span>Choose Image</span>
                      <span className="thumbnail-upload-hint">PNG, JPG, or GIF (max 5MB)</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AllThemes;