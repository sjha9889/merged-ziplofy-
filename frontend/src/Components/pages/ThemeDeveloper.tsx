import React, { useState, useRef, useEffect, RefObject } from "react";
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
} from "lucide-react";
import { DateRange, Range } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { PermissionGate, PermissionButton } from "../PermissionGate";
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
  
  // Permission checking
  const { hasViewPermission, hasEditPermission, hasUploadPermission, getPermissionDetails } = usePermissions();
  
  // Check permissions for Theme Developer subsection
  const canView = hasViewPermission('Developer', 'Theme Developer');
  const canEdit = hasEditPermission('Developer', 'Theme Developer');
  const canUpload = hasUploadPermission('Developer', 'Theme Developer');
  
  console.log('🔍 Theme Developer Permissions:', {
    canView,
    canEdit,
    canUpload,
    permissions: getPermissionDetails('Developer', 'Theme Developer')
  });

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRangeItem[]>([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const datePickerRef = useRef<HTMLDivElement | null>(null);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDatePicker]);

  // Fetch themes from API
  const fetchThemes = async () => {
    try {
      setLoadingThemes(true);
      const response = await axiosi.get('/themes');
      if (response.data.success) {
        const themesData = response.data.data.map((theme: any) => ({
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
          thumbnailUrl: theme.thumbnailUrl
        }));
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

  // Handle theme deletion
  const handleDeleteTheme = async (themeId: string, themeName: string) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete the theme "${themeName}"? This action cannot be undone and will remove the theme from the database and all associated files.`
    );
    
    if (!confirmed) {
      return;
    }

    // Check authentication before making the request
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) {
      alert('Authentication required. Please log in again.');
      return;
    }

    // Set loading states
    setDeletingThemeId(themeId);
    setIsDeleting(true);

    try {
      console.log('🗑️ Deleting theme:', { themeId, themeName });
      console.log('🔑 Using token:', adminToken ? 'Present' : 'Missing');
      console.log('🌐 Making request to:', `/themes/${themeId}`);
      
      const response = await axiosi.delete(`/themes/${themeId}`);
      
      console.log('✅ Delete response status:', response.status);
      console.log('✅ Delete response data:', response.data);
      
      if (response.data.success) {
        // Show success message
        alert('Theme deleted successfully!');
        
        // Immediately update the UI by removing the theme from the local state
        setThemes(prevThemes => prevThemes.filter(theme => theme._id !== themeId));
        setTotalThemes(prevTotal => prevTotal - 1);
        
        // Also refresh themes list to ensure consistency
        await fetchThemes();
      }
    } catch (error: any) {
      console.error('❌ Delete error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error config:', error.config);
      
      let errorMessage = 'Delete failed';
      
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please make sure the backend server is running on port 5000.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Your session may have expired. Please log in again.';
        // Clear invalid token
        localStorage.removeItem('admin_token');
        localStorage.removeItem('userData');
        localStorage.removeItem('userRole');
        localStorage.removeItem('isSuperAdmin');
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to delete themes. Contact administrator.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Theme not found. It may have already been deleted.';
        // If theme not found, refresh the list to update UI
        await fetchThemes();
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Error: ${errorMessage}`);
    } finally {
      // Clear loading states
      setDeletingThemeId(null);
      setIsDeleting(false);
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
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca', 
          borderRadius: '8px', 
          padding: '20px',
          color: '#dc2626'
        }}>
          <h2>Access Denied</h2>
          <p>You don't have permission to view the Theme Developer section.</p>
          <p>Contact your administrator to request access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-table-container" style={{ position: 'relative' }}>
      {/* Delete Loading Animation */}
      {isDeleting && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            minWidth: '300px',
            animation: 'slideIn 0.3s ease-out'
          }}>
            {/* Spinning Animation */}
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #f3f4f6',
              borderTop: '4px solid #ef4444',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            
            {/* Message */}
            <div style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151',
              textAlign: 'center'
            }}>
              Deleting Theme...
            </div>
            
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              textAlign: 'center'
            }}>
              Please wait while we remove the theme and all associated files
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <h1 className="title">Total Theme</h1>
          <span className="theme-count">{totalThemes}</span>
        </div>
        <div className="header-right">
          <button 
            onClick={fetchThemes} 
            style={{ 
              marginRight: '10px', 
              padding: '8px 12px', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            disabled={loadingThemes}
          >
            {loadingThemes ? 'Loading...' : 'Refresh'}
          </button>
          <span className="settings-icon">⚙</span>
          <span className="profile-icon">👤</span>
        </div>
      </div>

      {/* Controls */}
      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search Theme"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={16} className="search-icon" />
        </div>
        <PermissionGate 
          action="upload" 
          section="Developer" 
          subsection="Theme Developer"
          fallback={
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#f3f4f6', 
              borderRadius: '4px', 
              color: '#6b7280',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              You don't have permission to upload themes
            </div>
          }
        >
          <button className="add-theme-btn" onClick={() => setIsUploadOpen(true)}>
            <Plus size={20} />
            Add New Theme
          </button>
        </PermissionGate>
      </div>

      {/* Date Range and Filter */}
      <div className="filters">
        <div className="date-range" onClick={() => setShowDatePicker(!showDatePicker)}>
          <Calendar size={16} />
          <span>
            {dateRange[0].startDate.toLocaleDateString()} - {dateRange[0].endDate.toLocaleDateString()}
          </span>
        </div>
        <button className="filter-btn">
          <Filter size={16} />
          Filter
        </button>

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

      {/* Table */}
      <div className="table-container">
        <table className="theme-table">
          <thead>
            <tr>
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
                <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                  Loading themes...
                </td>
              </tr>
            ) : themes.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                  No themes found. Upload your first theme!
                </td>
              </tr>
            ) : (
              themes.map((theme) => (
                <tr key={theme._id}>
                  <td className="theme-name">{theme.name}</td>
                  <td>
                    <span className="category-badge">{theme.category}</span>
                  </td>
                  <td className="upload-date">{theme.uploadDate}</td>
                  <td className="upload-by">{theme.uploadBy}</td>
                  <td>
                    <span className="plan-badge">{theme.plan}</span>
                  </td>
                  <td>
                    <div className="action-container">
                      <button
                        className="action-btn"
                        onClick={() =>
                          setActiveActionDropdown(activeActionDropdown === theme._id ? null : theme._id)
                        }
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      {activeActionDropdown === theme._id && (
                      <div 
                        className="action-dropdown"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <PermissionGate action="view" section="Developer" subsection="Theme Developer">
                          <div className="action-item">
                            <Eye size={16} className="action-icon view-icon" />
                            <span>View</span>
                          </div>
                        </PermissionGate>
                        
                        <PermissionGate action="edit" section="Developer" subsection="Theme Developer">
                          <div 
                            className="action-item"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('✅ Edit button clicked for theme:', theme._id);
                              const targetPath = `/admin/themes/edit/${theme._id}`;
                              console.log('📍 Target path:', targetPath);
                              console.log('🔍 Current location:', window.location.pathname);
                              
                              // Close dropdown first
                              setActiveActionDropdown(null);
                              
                              // Navigate immediately
                              console.log('🚀 Attempting navigation...');
                              navigate(targetPath);
                              console.log('✅ Navigation called');
                            }}
                            onMouseDown={(e) => {
                              // Also handle mousedown to catch the event earlier
                              e.stopPropagation();
                            }}
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                          >
                            <Edit size={16} className="action-icon edit-icon" />
                            <span>Edit</span>
                          </div>
                        </PermissionGate>
                        
                        <PermissionGate action="edit" section="Developer" subsection="Theme Developer">
                          <div 
                            className="action-item" 
                            onClick={() => {
                              if (deletingThemeId !== theme._id) {
                                handleDeleteTheme(theme._id, theme.name);
                                setActiveActionDropdown(null); // Close dropdown after action
                              }
                            }}
                            style={{ 
                              cursor: deletingThemeId === theme._id ? 'not-allowed' : 'pointer',
                              opacity: deletingThemeId === theme._id ? 0.6 : 1
                            }}
                          >
                            <Trash2 size={16} className="action-icon delete-icon" />
                            <span>{deletingThemeId === theme._id ? 'Deleting...' : 'Delete'}</span>
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
                  color: '#dc2626', 
                  backgroundColor: '#fef2f2', 
                  border: '1px solid #fecaca', 
                  borderRadius: '4px', 
                  padding: '8px', 
                  marginBottom: '16px',
                  fontSize: '14px'
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
    </div>
  );
};

export default ThemeDeveloper;
