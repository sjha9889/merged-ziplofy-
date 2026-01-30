import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { useAdminAuth } from '../../contexts/admin-auth.context';
import './ThemeInstallation.css';

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
    category: string;
  };
  storeId: string;
  status: string;
  installedAt: string;
  customizations: any[];
}

interface ThemeInstallationProps {
  storeId: string;
}

const ThemeInstallation: React.FC<ThemeInstallationProps> = ({ storeId }) => {
  const { token } = useAdminAuth();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [installedThemes, setInstalledThemes] = useState<InstalledTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [installing, setInstalling] = useState<string | null>(null);

  useEffect(() => {
    fetchThemes();
    fetchInstalledThemes();
  }, [storeId]);

  const fetchThemes = async () => {
    try {
      const response = await axios.get('/api/themes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setThemes(response.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch themes');
    }
  };

  const fetchInstalledThemes = async () => {
    try {
      const response = await axios.get(`/api/theme-install/store/${storeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
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
      await axios.post('/api/theme-install/install', {
        themeId,
        storeId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Refresh installed themes
      await fetchInstalledThemes();
      
      // Show success message
      alert('Theme installed successfully!');
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
      await axios.delete(`/api/theme-install/${installationId}`, {
        headers: {
          Authorization: `Bearer ${token}`
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

  const isThemeInstalled = (themeId: string) => {
    return installedThemes.some(installed => 
      installed.themeId._id === themeId && installed.status === 'installed'
    );
  };

  const getInstallationId = (themeId: string) => {
    const installation = installedThemes.find(installed => 
      installed.themeId._id === themeId && installed.status === 'installed'
    );
    return installation?._id;
  };

  if (loading) {
    return <div className="loading">Loading themes...</div>;
  }

  return (
    <div className="theme-installation">
      <div className="page-header">
        <h2>Theme Installation</h2>
        <p>Install and manage themes for your store</p>
      </div>

      {error && (
        <div className="error-alert">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      <div className="themes-grid">
        {themes.map((theme) => (
          <div key={theme._id} className="theme-card">
            <div className="theme-preview">
              <img 
                src={theme.previewImage || '/default-theme.png'} 
                alt={theme.name}
                onError={(e) => {
                  e.currentTarget.src = '/default-theme.png';
                }}
              />
            </div>
            
            <div className="theme-info">
              <h3>{theme.name}</h3>
              <p className="theme-description">{theme.description}</p>
              <div className="theme-meta">
                <span className="theme-category">{theme.category}</span>
                <span className="theme-price">${theme.price}</span>
                <span className="theme-installs">
                  {theme.installationCount} installs
                </span>
              </div>
            </div>

            <div className="theme-actions">
              {isThemeInstalled(theme._id) ? (
                <div className="installed-theme">
                  <span className="installed-badge">✓ Installed</span>
                  <button 
                    className="btn uninstall"
                    onClick={() => handleUninstallTheme(getInstallationId(theme._id)!)}
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
        ))}
      </div>

      {installedThemes.length > 0 && (
        <div className="installed-themes-section">
          <h3>Installed Themes</h3>
          <div className="installed-themes-grid">
            {installedThemes.map((installation) => (
              <div key={installation._id} className="installed-theme-card">
                <img 
                  src={installation.themeId.previewImage || '/default-theme.png'} 
                  alt={installation.themeId.name}
                />
                <div className="installed-theme-info">
                  <h4>{installation.themeId.name}</h4>
                  <p>Installed: {new Date(installation.installedAt).toLocaleDateString()}</p>
                  <p>Customizations: {installation.customizations.length}</p>
                </div>
                <button 
                  className="btn customize"
                  onClick={() => {
                    // Navigate to theme customization page
                    window.location.href = `/theme-customize/${installation._id}`;
                  }}
                >
                  Customize
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeInstallation;
