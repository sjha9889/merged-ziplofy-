import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { useAuth } from '../../contexts/auth.context';
import './ClientThemeInstallation.css';

interface Theme {
  _id: string;
  name: string;
  description: string;
  previewImage: string;
  category: string;
  price: number;
  installationCount: number;
}

interface InstalledTheme {
  _id: string;
  themeId: {
    _id: string;
    name: string;
    description: string;
    previewImage: string;
  };
  status: string;
  installedAt: string;
  isActive: boolean;
  customizations?: any[];
}

const ClientThemeInstallation: React.FC = () => {
  const { user } = useAuth();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [installedThemes, setInstalledThemes] = useState<InstalledTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [installing, setInstalling] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetchThemes();
    fetchInstalledThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const response = await axios.get('/api/client/themes', {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`
        }
      });
      setThemes(response.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch themes');
    }
  };

  const fetchInstalledThemes = async () => {
    try {
      const response = await axios.get(`/api/client/store/${user?.storeId || 'default-store'}/themes`, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`
        }
      });
      setInstalledThemes(response.data.data || []);
    } catch (err: any) {
      console.error('Failed to fetch installed themes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInstallTheme = async (themeId: string) => {
    setInstalling(themeId);
    try {
      await axios.post('/api/client/install', {
        themeId,
        storeId: user?.storeId || 'default-store'
      }, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`
        }
      });
      
      // Refresh installed themes
      await fetchInstalledThemes();
      
      // Show success message
      alert('Theme installed successfully! You can now customize it in your store.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to install theme');
    } finally {
      setInstalling(null);
    }
  };

  const handleUninstallTheme = async (installationId: string) => {
    if (!confirm('Are you sure you want to uninstall this theme?')) {
      return;
    }

    try {
      await axios.delete(`/api/client/installation/${installationId}`, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`
        }
      });
      
      // Refresh installed themes
      await fetchInstalledThemes();
      
      // Show success message
      alert('Theme uninstalled successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to uninstall theme');
    }
  };

  const handleCustomizeTheme = (installationId: string) => {
    window.location.href = `/themes/customize/${installationId}`;
  };

  const handleEditCode = (installationId: string) => {
    window.location.href = `/themes/editor/${installationId}`;
  };

  const isThemeInstalled = (themeId: string) => {
    return installedThemes.some(installed => 
      installed.themeId._id === themeId && installed.status === 'installed'
    );
  };

  const getInstalledTheme = (themeId: string) => {
    return installedThemes.find(installed => 
      installed.themeId._id === themeId && installed.status === 'installed'
    );
  };

  const filteredThemes = themes.filter(theme => {
    const matchesSearch = theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         theme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || theme.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="loading">Loading themes...</div>;
  }

  return (
    <div className="client-theme-installation">
      <div className="theme-header">
        <h1>Install Themes for Your Store</h1>
        <p>Choose from our collection of beautiful themes and customize them to match your brand.</p>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search themes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="category-filter"
        >
          <option value="All">All Categories</option>
          <option value="ecommerce">E-commerce</option>
          <option value="business">Business</option>
          <option value="portfolio">Portfolio</option>
          <option value="blog">Blog</option>
          <option value="education">Education</option>
          <option value="health">Health</option>
          <option value="food">Food</option>
        </select>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      <div className="themes-grid">
        {filteredThemes.map((theme) => {
          const installedTheme = getInstalledTheme(theme._id);
          const isInstalled = isThemeInstalled(theme._id);
          
          return (
            <div key={theme._id} className="theme-card">
              <div className="theme-preview">
                <img 
                  src={theme.previewImage || '/default-theme.png'} 
                  alt={theme.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-theme.png';
                  }}
                />
                <div className="theme-overlay">
                  {isInstalled ? (
                    <div className="installed-badge">Installed</div>
                  ) : (
                    <div className="price-badge">
                      {theme.price === 0 ? 'Free' : `$${theme.price}`}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="theme-info">
                <h3>{theme.name}</h3>
                <p>{theme.description}</p>
                <div className="theme-meta">
                  <span className="category">{theme.category}</span>
                  <span className="installs">{theme.installationCount} installs</span>
                </div>
              </div>

              <div className="theme-actions">
                {isInstalled ? (
                  <div className="installed-actions">
                    <button 
                      className="btn customize"
                      onClick={() => handleCustomizeTheme(installedTheme!._id)}
                    >
                      Customize
                    </button>
                    <button 
                      className="btn edit-code"
                      onClick={() => handleEditCode(installedTheme!._id)}
                    >
                      Edit Code
                    </button>
                    <button 
                      className="btn uninstall"
                      onClick={() => handleUninstallTheme(installedTheme!._id)}
                    >
                      Uninstall
                    </button>
                  </div>
                ) : (
                  <button 
                    className="btn install"
                    onClick={() => handleInstallTheme(theme._id)}
                    disabled={installing === theme._id}
                  >
                    {installing === theme._id ? 'Installing...' : 'Install Theme'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredThemes.length === 0 && (
        <div className="no-themes">
          <h3>No themes found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default ClientThemeInstallation;
