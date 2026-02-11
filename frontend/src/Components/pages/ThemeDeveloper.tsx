import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./ThemeDeveloper.css";
import {
  Search,
  Plus,
  Calendar,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  X,
  LayoutGrid,
  LayoutList,
  Palette,
} from "lucide-react";
import { DateRange, Range } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { PermissionGate } from "../PermissionGate";
import { EditVerificationModal } from "../EditVerificationModal";
import { usePermissions } from "../../hooks/usePermissions";
import axiosi from "../../config/axios";

// ---------------------- Types ----------------------
interface Theme {
  _id: string;
  name: string;
  category: string;
  uploadDate: string;
  uploadBy: string;
  plan: string;
  description?: string;
  price?: number;
  version?: string;
  tags?: string[];
  isActive?: boolean;
  downloads?: number;
  thumbnailUrl?: string;
}

interface DateRangeItem {
  startDate: Date;
  endDate: Date;
  key: string;
}

// ---------------------- Component ----------------------
const ThemeDeveloper: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeActionDropdown, setActiveActionDropdown] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  
  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    name: "",
    description: "",
    category: "",
    plan: "",
    price: "",
    version: "1.0.0",
    tags: ""
  });
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Dynamic theme data
  const [themes, setThemes] = useState<Theme[]>([]);
  const [totalThemes, setTotalThemes] = useState<number>(0);
  const [loadingThemes, setLoadingThemes] = useState<boolean>(true);
  const [deletingThemeId, setDeletingThemeId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [pendingDeleteTheme, setPendingDeleteTheme] = useState<{ themeId: string; themeName: string } | null>(null);

  // Permission checking
  const { hasViewPermission, hasEditPermission, hasUploadPermission } = usePermissions();
  
  const canView = hasViewPermission('Developer', 'Theme Developer');
  const canUpload = hasUploadPermission('Developer', 'Theme Developer');
  
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRangeItem[]>([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
  const datePickerRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPlan, setSelectedPlan] = useState<string>("all");

  const getThumbnailSrc = (theme: Theme) =>
    theme.thumbnailUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120'%3E%3Crect fill='%23f1f5f9' width='200' height='120'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2394a3b8'%3ENo preview%3C/text%3E%3C/svg%3E";

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterMenu(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    if (showFilterMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDatePicker, showFilterMenu]);

  // Filter themes by search
  const filteredThemes = themes.filter((theme) => {
    const searchMatch =
      theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      theme.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      theme.uploadBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      theme.plan.toLowerCase().includes(searchTerm.toLowerCase());

    const categoryMatch = selectedCategory === "all" || theme.category === selectedCategory;
    const planMatch = selectedPlan === "all" || theme.plan === selectedPlan;
    return searchMatch && categoryMatch && planMatch;
  });

  const categoryOptions = useMemo(
    () => Array.from(new Set(themes.map((t) => t.category).filter(Boolean))),
    [themes]
  );
  const planOptions = useMemo(
    () => Array.from(new Set(themes.map((t) => t.plan).filter(Boolean))),
    [themes]
  );

  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) + (selectedPlan !== "all" ? 1 : 0);

  // Fetch themes from API
  const fetchThemes = async () => {
    try {
      setLoadingThemes(true);
      const response = await axiosi.get('/themes', { params: { limit: 100 } });
      if (response.data.success) {
        const apiBase = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api").replace("/api", "");
        const themesData = response.data.data.map((theme: any) => {
          const thumbUrl = theme.thumbnailUrl ?? (theme.themePath && theme.thumbnail?.filename
            ? `${apiBase}/uploads/themes/${theme.themePath}/thumbnail/${theme.thumbnail.filename}`
            : null);
          return {
            _id: theme._id,
            name: theme.name,
            category: theme.category,
            uploadDate: new Date(theme.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            }),
            uploadBy: theme.uploadBy?.name || 'Unknown',
            plan: theme.plan,
            description: theme.description,
            price: theme.price,
            version: theme.version,
            tags: theme.tags,
            isActive: theme.isActive,
            downloads: theme.downloads,
            thumbnailUrl: thumbUrl
          };
        });
        setThemes(themesData);
        setTotalThemes(response.data.total || themesData.length);
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
      // Fallback to empty array on error
      setThemes([]);
      setTotalThemes(0);
    } finally {
      setLoadingThemes(false);
    }
  };

  // Load themes on component mount
  useEffect(() => {
    if (canView) {
      fetchThemes();
    }
  }, [canView]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Don't close if clicking inside action-container, action-item, or action-dropdown
      const isInsideActionArea = target.closest('.action-container') || 
                                  target.closest('.action-item') || 
                                  target.closest('.action-dropdown') ||
                                  target.closest('.action-btn');
      
      if (activeActionDropdown && !isInsideActionArea) {
        setActiveActionDropdown(null);
      }
    };

    if (activeActionDropdown) {
      // Use click instead of mousedown to allow action-item clicks to process first
      document.addEventListener('click', handleClickOutside, true);

      return () => {
        document.removeEventListener('click', handleClickOutside, true);
      };
    }
  }, [activeActionDropdown]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'zip' | 'thumbnail') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'zip') {
        setZipFile(file);
      } else {
        setThumbnailFile(file);
      }
    }
  };

  // Execute theme deletion with OTP (called after OTP verification)
  const executeDeleteTheme = async (themeId: string, themeName: string, otp: string) => {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) {
      alert('Authentication required. Please log in again.');
      return;
    }

    setDeletingThemeId(themeId);
    setIsDeleting(true);

    try {
      const response = await axiosi.delete(`/themes/${themeId}`, {
        data: { editOtp: otp },
      });

      if (response.data.success) {
        alert('Theme deleted successfully!');
        setThemes(prevThemes => prevThemes.filter(theme => theme._id !== themeId));
        setTotalThemes(prevTotal => prevTotal - 1);
        await fetchThemes();
      }
    } catch (error: any) {
      let errorMessage = 'Delete failed';
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please make sure the backend server is running on port 5000.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Your session may have expired. Please log in again.';
        localStorage.removeItem('admin_token');
        localStorage.removeItem('userData');
        localStorage.removeItem('userRole');
        localStorage.removeItem('isSuperAdmin');
      } else if (error.response?.status === 403) {
        errorMessage = error.response?.data?.message || 'You do not have permission to delete themes. Contact administrator.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Theme not found. It may have already been deleted.';
        await fetchThemes();
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      alert(`Error: ${errorMessage}`);
    } finally {
      setDeletingThemeId(null);
      setIsDeleting(false);
    }
  };

  // Handle theme deletion - show OTP modal first
  const handleDeleteTheme = (themeId: string, themeName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the theme "${themeName}"? This action cannot be undone and will remove the theme from the database and all associated files.`
    );
    if (!confirmed) return;

    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) {
      alert('Authentication required. Please log in again.');
      return;
    }

    setPendingDeleteTheme({ themeId, themeName });
    setShowOtpModal(true);
  };

  const handleOtpVerified = (otp: string) => {
    setShowOtpModal(false);
    if (pendingDeleteTheme) {
      executeDeleteTheme(pendingDeleteTheme.themeId, pendingDeleteTheme.themeName, otp);
      setPendingDeleteTheme(null);
    }
  };

  // Handle form submission
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    setIsUploading(true);

    // Debug: Check user role and authentication
    const userRole = localStorage.getItem('userRole');
    const isSuperAdmin = localStorage.getItem('isSuperAdmin');
    const userData = localStorage.getItem('userData');
    console.log('🔍 User authentication debug:', {
      userRole,
      isSuperAdmin,
      userData: userData ? JSON.parse(userData) : null,
      adminToken: localStorage.getItem('admin_token') ? 'Present' : 'Missing'
    });

    try {
      // Validate required fields
      if (!uploadForm.name || !uploadForm.category || !uploadForm.plan) {
        throw new Error('Please fill in all required fields');
      }

      if (!zipFile || !thumbnailFile) {
        throw new Error('Please select both ZIP file and thumbnail');
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', uploadForm.name);
      formData.append('description', uploadForm.description);
      formData.append('category', uploadForm.category);
      formData.append('plan', uploadForm.plan);
      formData.append('price', uploadForm.price);
      formData.append('version', uploadForm.version);
      formData.append('tags', uploadForm.tags);
      formData.append('zipFile', zipFile);
      formData.append('thumbnail', thumbnailFile);


      // Make API call
      const response = await axiosi.post('/themes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        // Reset form
        setUploadForm({
          name: "",
          description: "",
          category: "",
          plan: "",
          price: "",
          version: "1.0.0",
          tags: ""
        });
        setZipFile(null);
        setThumbnailFile(null);
        setIsUploadOpen(false);
        
        // Refresh themes list
        await fetchThemes();
        
        // Show success message (you can add a toast notification here)
        alert('Theme uploaded successfully!');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorMessage = 'Upload failed';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to upload themes. Contact administrator.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid request data. Please check all fields.';
      } else {
        errorMessage = error.message || 'Upload failed';
      }
      
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // If user doesn't have view permission, show access denied message
  if (!canView) {
    return (
      <div className="theme-table-container" style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ 
          backgroundColor: '#f8fafc', 
          border: '1px solid #e2e8f0', 
          borderRadius: '10px', 
          padding: '32px',
          color: '#475569',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <h2 style={{ marginBottom: '12px', fontSize: '18px', fontWeight: 600, color: '#334155' }}>Access Denied</h2>
          <p>You don't have permission to view the Theme Developer section.</p>
          <p style={{ marginTop: '8px', fontSize: '14px', color: '#64748b' }}>Contact your administrator to request access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-table-container theme-developer-enhanced" style={{ position: 'relative' }}>
      {/* Hero Header */}
      <div className="theme-hero">
        <div className="theme-hero-content">
          <div className="theme-hero-icon">
            <Palette size={32} strokeWidth={2} />
          </div>
          <div>
            <h1 className="theme-hero-title">Theme Library</h1>
            <p className="theme-hero-subtitle">Manage and customize your store themes</p>
          </div>
        </div>
        <div className="theme-stats-row">
          <div className="theme-stat-card">
            <span className="theme-stat-value">{totalThemes}</span>
            <span className="theme-stat-label">Total Themes</span>
          </div>
          <div className="theme-stat-card">
            <span className="theme-stat-value">{filteredThemes.length}</span>
            <span className="theme-stat-label">Showing</span>
          </div>
        </div>
      </div>

      {/* Delete Loading Animation */}
      {isDeleting && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.2)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.75rem',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.1)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            minWidth: '280px',
            animation: 'slideIn 0.3s ease-out'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              border: '3px solid #e2e8f0',
              borderTop: '3px solid #64748b',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#334155',
              textAlign: 'center'
            }}>
              Deleting Theme...
            </div>
            
            <div style={{
              fontSize: '13px',
              color: '#64748b',
              textAlign: 'center'
            }}>
              Please wait while we remove the theme and all associated files
            </div>
          </div>
        </div>
      )}
      {/* Controls Bar */}
      <div className="theme-controls-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search Theme"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={16} className="search-icon" />
        </div>
        <div className="theme-controls-actions">
          <div className="view-toggle">
            <button
              className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid view"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              className={`view-toggle-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Table view"
            >
              <LayoutList size={18} />
            </button>
          </div>
          <button
            onClick={fetchThemes}
            className="refresh-btn-compact"
            disabled={loadingThemes}
            title="Refresh"
          >
            {loadingThemes ? "..." : "Refresh"}
          </button>
          <PermissionGate
            action="upload"
            section="Developer"
            subsection="Theme Developer"
            fallback={
              <div className="upload-fallback-msg">No upload permission</div>
            }
          >
            <button className="add-theme-btn add-theme-btn-accent" onClick={() => setIsUploadOpen(true)}>
              <Plus size={20} />
              Add Theme
            </button>
          </PermissionGate>
        </div>
      </div>

      {/* Date Range and Filter */}
      <div className="filters" style={{ position: 'relative' }}>
        <div className="date-range" onClick={() => setShowDatePicker(!showDatePicker)}>
          <Calendar size={16} />
          <span>
            {dateRange[0].startDate.toLocaleDateString()} - {dateRange[0].endDate.toLocaleDateString()}
          </span>
        </div>
        <div className="filter-wrapper" ref={filterRef}>
          <button
            className="filter-btn"
            onClick={() => setShowFilterMenu((prev) => !prev)}
            type="button"
          >
            <Filter size={16} />
            {activeFilterCount > 0 ? `Filter (${activeFilterCount})` : "Filter"}
          </button>
          {showFilterMenu && (
            <div className="filter-dropdown" onClick={(e) => e.stopPropagation()}>
              <div className="filter-row">
                <label>Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="filter-row">
                <label>Plan</label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                >
                  <option value="all">All</option>
                  {planOptions.map((plan) => (
                    <option key={plan} value={plan}>{plan}</option>
                  ))}
                </select>
              </div>
              <div className="filter-actions">
                <button
                  type="button"
                  className="filter-clear"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedPlan("all");
                  }}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="filter-apply"
                  onClick={() => setShowFilterMenu(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {showDatePicker && (
          <div className="date-range-picker" ref={datePickerRef}>
            <DateRange
              editableDateInputs={true}
              onChange={(item: { selection: Range }) => setDateRange([{ ...item.selection, key: "selection" }])}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
            />
          </div>
        )}
      </div>

      {/* Theme List - Grid or Table */}
      {viewMode === "grid" ? (
        <div className="theme-grid-enhanced">
          {loadingThemes ? (
            <div className="theme-grid-loading">
              <div className="theme-grid-spinner" />
              <p>Loading themes...</p>
            </div>
          ) : filteredThemes.length === 0 ? (
            <div className="theme-grid-empty">
              <Palette size={48} strokeWidth={1.5} />
              <p>{searchTerm ? "No themes match your search." : "No themes yet. Upload your first theme!"}</p>
            </div>
          ) : (
            filteredThemes.map((theme) => (
              <div key={theme._id} className="theme-card-enhanced">
                <div className="theme-card-thumb-wrap">
                  <img
                    src={getThumbnailSrc(theme)}
                    alt={theme.name}
                    className="theme-card-thumb-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120' fill='%23e2e8f0'%3E%3Crect width='200' height='120' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2394a3b8'%3ENo preview%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="theme-card-overlay">
                    <PermissionGate action="edit" section="Developer" subsection="Theme Developer">
                      <button
                        className="theme-card-overlay-btn"
                        onClick={() => navigate(`/admin/themes/edit/${theme._id}`)}
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                    </PermissionGate>
                  </div>
                </div>
                <div className="theme-card-body-enhanced">
                  <h3 className="theme-card-name-enhanced">{theme.name}</h3>
                  <div className="theme-card-meta-enhanced">
                    <span className="category-badge category-badge-sm">{theme.category}</span>
                    <span className={`plan-badge plan-${(theme.plan || "").toLowerCase().replace(/\s+/g, "-")} plan-badge-sm`}>
                      {theme.plan}
                    </span>
                  </div>
                  <div className="theme-card-footer-enhanced">
                    <span className="theme-card-date-enhanced">{theme.uploadDate}</span>
                    <span className="theme-card-by-enhanced">by {theme.uploadBy}</span>
                  </div>
                  <div className="theme-card-actions-enhanced">
                    <PermissionGate action="edit" section="Developer" subsection="Theme Developer">
                      <button
                        className="theme-card-action-btn"
                        onClick={() => navigate(`/admin/themes/edit/${theme._id}`)}
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <div className="action-container theme-card-action-dropdown">
                        <button
                          className="theme-card-action-btn icon-only"
                          onClick={() =>
                            setActiveActionDropdown(activeActionDropdown === theme._id ? null : theme._id)
                          }
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        {activeActionDropdown === theme._id && (
                          <div className="action-dropdown" onClick={(e) => e.stopPropagation()}>
                            <PermissionGate action="edit" section="Developer" subsection="Theme Developer">
                              <div
                                className="action-item"
                                onClick={() => {
                                  if (deletingThemeId !== theme._id) {
                                    handleDeleteTheme(theme._id, theme.name);
                                    setActiveActionDropdown(null);
                                  }
                                }}
                                style={{ cursor: deletingThemeId === theme._id ? "not-allowed" : "pointer" }}
                              >
                                <Trash2 size={16} className="action-icon delete-icon" />
                                <span>Delete</span>
                              </div>
                            </PermissionGate>
                          </div>
                        )}
                      </div>
                    </PermissionGate>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="table-container table-container-enhanced">
          <table className="theme-table">
            <thead>
              <tr>
                <th style={{ width: 72 }}>Preview</th>
                <th>Theme Name</th>
                <th>Category</th>
                <th>Upload Date</th>
                <th>Upload By</th>
                <th>Plan</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody style={{ textAlign: "left" }}>
              {loadingThemes ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "32px" }}>
                    <div className="theme-table-loading">
                      <div className="theme-grid-spinner" />
                      <span>Loading themes...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredThemes.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "#6b7280" }}>
                    {searchTerm ? "No themes match your search." : "No themes found. Upload your first theme!"}
                  </td>
                </tr>
              ) : (
                filteredThemes.map((theme) => (
                  <tr key={theme._id} className="theme-table-row-enhanced">
                    <td>
                      <div className="theme-table-thumb">
                        <img
                          src={getThumbnailSrc(theme)}
                          alt={theme.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='40'%3E%3Crect fill='%23e2e8f0' width='56' height='40'/%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                    </td>
                    <td className="theme-name">{theme.name}</td>
                    <td>
                      <span className="category-badge">{theme.category}</span>
                    </td>
                    <td className="upload-date">{theme.uploadDate}</td>
                    <td className="upload-by">{theme.uploadBy}</td>
                    <td>
                      <span className={`plan-badge plan-${(theme.plan || "").toLowerCase().replace(/\s+/g, "-")}`}>
                        {theme.plan}
                      </span>
                    </td>
                    <td>
                      <div className="action-container">
                        <PermissionGate action="edit" section="Developer" subsection="Theme Developer">
                          <button
                            className="action-btn action-btn-edit"
                            onClick={() => navigate(`/admin/themes/edit/${theme._id}`)}
                          >
                            <Edit size={14} /> Edit
                          </button>
                        </PermissionGate>
                        <button
                          className="action-btn"
                          onClick={() =>
                            setActiveActionDropdown(activeActionDropdown === theme._id ? null : theme._id)
                          }
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        {activeActionDropdown === theme._id && (
                          <div className="action-dropdown" onClick={(e) => e.stopPropagation()}>
                            <PermissionGate action="edit" section="Developer" subsection="Theme Developer">
                              <div
                                className="action-item"
                                onClick={() => {
                                  if (deletingThemeId !== theme._id) {
                                    handleDeleteTheme(theme._id, theme.name);
                                    setActiveActionDropdown(null);
                                  }
                                }}
                                style={{ cursor: deletingThemeId === theme._id ? "not-allowed" : "pointer" }}
                              >
                                <Trash2 size={16} className="action-icon delete-icon" />
                                <span>Delete</span>
                              </div>
                            </PermissionGate>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button className="pagination-btn" disabled>
          <ChevronLeft size={16} /> Prev
        </button>
        <button className="pagination-btn active">1</button>
        <button className="pagination-btn">
          Next <ChevronRight size={16} />
        </button>
      </div>

      {/* Upload Sidebar */}
      {isUploadOpen && (
        <div className="themeUpload-overlay">
          <div className="themeUpload-sidebar">
            <div className="themeUpload-header">
              <h2>Upload Theme</h2>
              <button className="themeUpload-close" onClick={() => setIsUploadOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="themeUpload-body">
              {uploadError && (
                <div style={{ 
                  color: '#b91c1c', 
                  backgroundColor: '#fef2f2', 
                  border: '1px solid #fecaca', 
                  borderRadius: '6px', 
                  padding: '10px 12px', 
                  marginBottom: '16px',
                  fontSize: '13px'
                }}>
                  {uploadError}
                </div>
              )}

              <label>Theme Name *</label>
              <input 
                type="text" 
                name="name"
                value={uploadForm.name}
                onChange={handleInputChange}
                placeholder="Enter theme name" 
                required
              />

              <label>Description</label>
              <textarea 
                name="description"
                value={uploadForm.description}
                onChange={handleInputChange}
                placeholder="Enter theme description"
                rows={3}
              />

              <label>Category *</label>
              <select 
                name="category"
                value={uploadForm.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                <option value="travel">Travel</option>
                <option value="business">Business</option>
                <option value="portfolio">Portfolio</option>
                <option value="ecommerce">E-commerce</option>
                <option value="blog">Blog</option>
                <option value="education">Education</option>
                <option value="health">Health</option>
                <option value="food">Food</option>
              </select>

              <label>Plan *</label>
              <select 
                name="plan"
                value={uploadForm.plan}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Plan</option>
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Enterprise</option>
              </select>

              <label>Price</label>
              <input 
                type="number" 
                name="price"
                value={uploadForm.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
              />

              <label>Version</label>
              <input 
                type="text" 
                name="version"
                value={uploadForm.version}
                onChange={handleInputChange}
                placeholder="1.0.0"
              />

              <label>Tags</label>
              <input 
                type="text" 
                name="tags"
                value={uploadForm.tags}
                onChange={handleInputChange}
                placeholder="tag1, tag2, tag3"
              />

              <label>Upload ZIP *</label>
              <input 
                type="file" 
                accept=".zip" 
                onChange={(e) => handleFileChange(e, 'zip')}
                required
              />
              {zipFile && (
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  Selected: {zipFile.name}
                </div>
              )}

              <label>Thumbnail (JPG/PNG) *</label>
              <input 
                type="file" 
                accept=".jpg,.jpeg,.png" 
                onChange={(e) => handleFileChange(e, 'thumbnail')}
                required
              />
              {thumbnailFile && (
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  Selected: {thumbnailFile.name}
                </div>
              )}

              <div className="themeUpload-footer">
                <button 
                  type="submit" 
                  className="themeUpload-submit"
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <EditVerificationModal
        isOpen={showOtpModal}
        onClose={() => {
          setShowOtpModal(false);
          setPendingDeleteTheme(null);
        }}
        onVerified={handleOtpVerified}
        requireVerification={true}
      />
    </div>
  );
};

export default ThemeDeveloper;
