import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { useAdminAuth } from '../../contexts/admin-auth.context';
import './ThemeCustomize.css';

interface CustomizationData {
  section: string;
  property: string;
  value: string;
  type: 'color' | 'text' | 'image' | 'number';
}

interface ThemeCustomizeProps {}

const ThemeCustomize: React.FC<ThemeCustomizeProps> = () => {
  const { installationId } = useParams<{ installationId: string }>();
  const navigate = useNavigate();
  const { token } = useAdminAuth();
  
  const [installation, setInstallation] = useState<any>(null);
  const [customizations, setCustomizations] = useState<CustomizationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (installationId) {
      fetchInstallationDetails();
    }
  }, [installationId]);

  const fetchInstallationDetails = async () => {
    try {
      const response = await axios.get(`/api/theme-install/${installationId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setInstallation(response.data.data);
      setCustomizations(response.data.data.customizations || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch theme details');
    } finally {
      setLoading(false);
    }
  };

  const addCustomization = () => {
    setCustomizations([...customizations, {
      section: '',
      property: '',
      value: '',
      type: 'text'
    }]);
  };

  const updateCustomization = (index: number, field: keyof CustomizationData, value: string) => {
    const updated = [...customizations];
    updated[index] = { ...updated[index], [field]: value };
    setCustomizations(updated);
  };

  const removeCustomization = (index: number) => {
    setCustomizations(customizations.filter((_, i) => i !== index));
  };

  const saveCustomizations = async () => {
    setSaving(true);
    try {
      await axios.put(`/api/theme-install/${installationId}/customize`, {
        customization: {
          customizations,
          updatedAt: new Date().toISOString()
        }
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      alert('Customizations saved successfully!');
      navigate('/themes');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save customizations');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading theme details...</div>;
  }

  if (!installation) {
    return <div className="error">Theme installation not found</div>;
  }

  return (
    <div className="theme-customize">
      <div className="page-header">
        <button 
          className="btn back"
          onClick={() => navigate('/themes')}
        >
          ← Back to Themes
        </button>
        <h2>Customize Theme: {installation.themeId?.name}</h2>
        <p>Customize your theme to match your brand</p>
      </div>

      {error && (
        <div className="error-alert">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      <div className="customization-section">
        <div className="section-header">
          <h3>Theme Customizations</h3>
          <button 
            className="btn add"
            onClick={addCustomization}
          >
            + Add Customization
          </button>
        </div>

        {customizations.length === 0 ? (
          <div className="no-customizations">
            <p>No customizations yet. Click "Add Customization" to get started.</p>
          </div>
        ) : (
          <div className="customizations-list">
            {customizations.map((customization, index) => (
              <div key={index} className="customization-item">
                <div className="customization-fields">
                  <div className="field-group">
                    <label>Section</label>
                    <input
                      type="text"
                      value={customization.section}
                      onChange={(e) => updateCustomization(index, 'section', e.target.value)}
                      placeholder="e.g., Header, Footer, Sidebar"
                    />
                  </div>

                  <div className="field-group">
                    <label>Property</label>
                    <input
                      type="text"
                      value={customization.property}
                      onChange={(e) => updateCustomization(index, 'property', e.target.value)}
                      placeholder="e.g., background-color, font-size, logo"
                    />
                  </div>

                  <div className="field-group">
                    <label>Type</label>
                    <select
                      value={customization.type}
                      onChange={(e) => updateCustomization(index, 'type', e.target.value as any)}
                    >
                      <option value="text">Text</option>
                      <option value="color">Color</option>
                      <option value="image">Image</option>
                      <option value="number">Number</option>
                    </select>
                  </div>

                  <div className="field-group">
                    <label>Value</label>
                    {customization.type === 'color' ? (
                      <input
                        type="color"
                        value={customization.value}
                        onChange={(e) => updateCustomization(index, 'value', e.target.value)}
                      />
                    ) : customization.type === 'image' ? (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Handle file upload here
                            updateCustomization(index, 'value', file.name);
                          }
                        }}
                      />
                    ) : (
                      <input
                        type={customization.type === 'number' ? 'number' : 'text'}
                        value={customization.value}
                        onChange={(e) => updateCustomization(index, 'value', e.target.value)}
                        placeholder={`Enter ${customization.type} value`}
                      />
                    )}
                  </div>
                </div>

                <button 
                  className="btn remove"
                  onClick={() => removeCustomization(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="actions">
        <button 
          className="btn save"
          onClick={saveCustomizations}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Customizations'}
        </button>
        
        <button 
          className="btn preview"
          onClick={() => {
            // Open theme preview in new tab
            window.open(`/theme-preview/${installationId}`, '_blank');
          }}
        >
          Preview Theme
        </button>
      </div>
    </div>
  );
};

export default ThemeCustomize;
